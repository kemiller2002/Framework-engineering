# Research Collection Dashboard

## Quick Start

From the ECR root:

```bash
npm run collect:exp003
```

Direct CLI:

```bash
node research/tools/research-collection-dashboard/src/server.js --ecr-root research/evidence-runs/ECR-000003-representation-sensitivity --experiment EXP-003 --port 4310 --host 0.0.0.0
```

## iPhone Workflow

1. Start the dashboard on the Mac.
2. Open the printed LAN URL on the iPhone.
3. Copy the packet prompt.
4. Run the prompt manually in the provider app.
5. Paste the returned JSON into the dashboard.
6. Validate.
7. Save the response.
8. Repeat until the dashboard shows completion.

## After Collection

```bash
npm run normalize:dry
npm run normalize
npm run pipeline
```

## Troubleshooting

- Connection issues: confirm the iPhone and Mac are on the same Wi-Fi and that the terminal is still running.
- Firewall: allow inbound connections for the Node process on the selected port.
- Duplicate responses: the dashboard will not overwrite canonical files; use candidate storage.
- Malformed JSON: validate first; use blocking-warning storage only when necessary.
- Smart quotes: tolerant validation can repair them for parsing, but the saved raw response is unchanged.
- Wrong provider: metadata mismatches block canonical save and require candidate storage.
- Accidental terminal closure: restart the dashboard; progress is recalculated from the filesystem.
