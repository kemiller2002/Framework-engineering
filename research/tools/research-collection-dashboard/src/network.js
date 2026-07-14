import os from "node:os";

export function discoverNetworkUrls(host, port, token) {
  const localUrl = `http://localhost:${port}/?token=${token}`;
  const lanUrls = [];
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const entry of addresses || []) {
      if (entry.family !== "IPv4" || entry.internal) continue;
      lanUrls.push(`http://${entry.address}:${port}/?token=${token}`);
    }
  }
  return { localUrl, lanUrls };
}
