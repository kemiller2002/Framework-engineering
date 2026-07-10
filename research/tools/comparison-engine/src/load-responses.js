import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseResponseText } from "./parse-response.js";
import { parsePacketMetadata, relativeTo } from "./utilities.js";

export async function loadExperimentData(config) {
  const packetFiles = await indexPacketFiles(config.packet_root);
  const warnings = [];
  const dataQuality = [];
  const records = [];

  for (const variant of config.variants) {
    const packetMeta = packetFiles.get(variant.packet_id) || {};
    for (const provider of config.providers) {
      const record = await loadSingleResponse({
        config,
        variant,
        provider,
        packetMeta,
        packetFiles,
      });
      if (record.warning) warnings.push(record.warning);
      if (record.data_quality) dataQuality.push(record.data_quality);
      records.push(record.record);
    }
  }

  return { records, warnings, dataQuality, packetFiles };
}

async function indexPacketFiles(packetRoot) {
  const files = await readdir(packetRoot);
  const mapping = new Map();
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const fullPath = path.join(packetRoot, file);
    const raw = await readFile(fullPath, "utf8");
    const metadata = parsePacketMetadata(raw);
    if (metadata.packet_id) {
      mapping.set(metadata.packet_id, {
        ...metadata,
        file_path: fullPath,
      });
    }
  }
  return mapping;
}

async function loadSingleResponse({ config, variant, provider, packetMeta }) {
  const providerDir = path.join(config.response_root, provider);
  const canonicalName = `${variant.packet_id}-${provider}.json`;
  const canonicalPath = path.join(providerDir, canonicalName);

  let candidatePath = canonicalPath;
  let sourceKind = "canonical";
  let rawText = "";

  try {
    rawText = await readFile(canonicalPath, "utf8");
  } catch {
    const fallback = await discoverLegacyCandidate(providerDir, variant);
    if (!fallback) {
      return {
        record: baseRecord(config, variant, provider, packetMeta, {
          status: "missing",
          source_path: "",
          source_kind: "missing",
        }),
        data_quality: {
          packet_id: variant.packet_id,
          provider,
          status: "missing",
          notes: "Expected canonical filename missing.",
        },
      };
    }
    candidatePath = fallback.path;
    sourceKind = "legacy_mapped";
    rawText = fallback.raw;
  }

  const parsed = parseResponseText(rawText);
  if (!parsed.ok) {
    return {
      record: baseRecord(config, variant, provider, packetMeta, {
        status: "malformed",
        source_path: relativeTo(config.experiment_root, candidatePath),
        source_kind: sourceKind,
      }),
      warning: sourceKind === "legacy_mapped"
        ? `Legacy filename mapped for ${variant.packet_id} ${provider}: ${relativeTo(config.experiment_root, candidatePath)}`
        : "",
      data_quality: {
        packet_id: variant.packet_id,
        provider,
        status: "malformed",
        notes: parsed.error,
      },
    };
  }

  const versionStatus = evaluateVersionStatus(config, variant, packetMeta, candidatePath);
  return {
    record: {
      ...baseRecord(config, variant, provider, packetMeta, {
        status: "ok",
        source_path: relativeTo(config.experiment_root, candidatePath),
        source_kind: sourceKind,
      }),
      response: parsed.data,
      version_status: versionStatus.status,
      version_note: versionStatus.note,
      included_in_primary: versionStatus.include,
    },
    warning: sourceKind === "legacy_mapped"
      ? `Legacy filename mapped for ${variant.packet_id} ${provider}: ${relativeTo(config.experiment_root, candidatePath)}`
      : "",
    data_quality: versionStatus.status !== "verified"
      ? {
          packet_id: variant.packet_id,
          provider,
          status: versionStatus.status,
          notes: versionStatus.note,
        }
      : null,
  };
}

function baseRecord(config, variant, provider, packetMeta, details) {
  return {
    ecr_id: config.ecr_id,
    experiment_id: config.experiment_id,
    packet_id: variant.packet_id,
    variant_id: variant.variant_id,
    variant_order: variant.variant_order,
    provider,
    packet_version: packetMeta.packet_version || "",
    packet_file: packetMeta.file_path ? relativeTo(config.experiment_root, packetMeta.file_path) : "",
    ...details,
    response: null,
    version_status: "not_applicable",
    version_note: "",
    included_in_primary: details.status === "ok",
  };
}

async function discoverLegacyCandidate(providerDir, variant) {
  let entries = [];
  try {
    entries = await readdir(providerDir, { withFileTypes: true });
  } catch {
    return null;
  }

  const matches = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const fullPath = path.join(providerDir, entry.name);
    const raw = await readFile(fullPath, "utf8");
    const parsed = parseResponseText(raw);
    if (!parsed.ok) continue;
    const packetId = parsed.data?.packet_id || "";
    const variantId = parsed.data?.variant_id || "";
    if (packetId === variant.packet_id || variantId === variant.variant_id) {
      matches.push({ path: fullPath, raw });
    }
  }
  return matches.length === 1 ? matches[0] : null;
}

function evaluateVersionStatus(config, variant, packetMeta, candidatePath) {
  const rule = config.version_rules?.[variant.variant_id];
  if (!rule) {
    return { status: "not_applicable", note: "", include: true };
  }
  if (!packetMeta.packet_version) {
    return {
      status: "version_unclear",
      note: "Packet version could not be verified from packet metadata.",
      include: false,
    };
  }
  if (packetMeta.packet_version !== rule.required_packet_version) {
    return {
      status: "excluded_wrong_version",
      note: `Required packet version ${rule.required_packet_version}; found ${packetMeta.packet_version}.`,
      include: false,
    };
  }
  if (candidatePath.includes(`${path.sep}pre-fix${path.sep}`)) {
    return {
      status: "excluded_pre_fix",
      note: "Pre-fix response excluded from primary comparison.",
      include: false,
    };
  }
  return {
    status: "verified",
    note: `Packet version ${packetMeta.packet_version} verified.`,
    include: true,
  };
}
