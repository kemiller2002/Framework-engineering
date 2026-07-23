import fs from "node:fs/promises";
import path from "node:path";

const publisherFile = path.resolve(
  "node_modules/research-publisher/src/metadata/normalize.mjs"
);

const original = `  const slug = frontmatter.slug ? String(frontmatter.slug).trim() : slugify(id ? \`${"${id}-${title}"}\` : title);`;
const pathOnlyReplacement = `  // Legacy repositories commonly reuse headings such as "Evidence" and "Notes".
  // Use the source path when no canonical ID or explicit slug exists so every
  // document receives a deterministic, collision-free URL.
  const inferredPathSlug = slugify(parsed.relativePath.replace(/\\.[^.]+$/, ""));
  const slug = frontmatter.slug ? String(frontmatter.slug).trim() : slugify(id ? \`${"${id}-${title}"}\` : inferredPathSlug);`;
const replacement = `  // Legacy repositories commonly reuse headings such as "Evidence" and "Notes".
  // Combine the source path with a stable hash when no canonical ID or explicit
  // slug exists so repeated headings and case-only paths cannot collide.
  const pathHash = crypto.createHash("sha256").update(parsed.relativePath).digest("hex").slice(0, 8);
  const inferredPathSlug = \`${"${slugify(parsed.relativePath.replace(/\\.[^.]+$/, \"\"))}-${pathHash}"}\`;
  const slug = frontmatter.slug ? String(frontmatter.slug).trim() : slugify(id ? \`${"${id}-${title}"}\` : inferredPathSlug);`;

const source = await fs.readFile(publisherFile, "utf8");

if (source.includes(replacement)) {
  process.stdout.write("research-publisher legacy slug patch already applied.\n");
} else if (source.includes(original)) {
  await fs.writeFile(publisherFile, source.replace(original, replacement));
  process.stdout.write("Applied research-publisher legacy slug compatibility patch.\n");
} else if (source.includes(pathOnlyReplacement)) {
  await fs.writeFile(publisherFile, source.replace(pathOnlyReplacement, replacement));
  process.stdout.write("Updated research-publisher legacy slug compatibility patch.\n");
} else {
  throw new Error(
    "Unsupported research-publisher normalize.mjs; review the legacy slug patch for the installed revision."
  );
}
