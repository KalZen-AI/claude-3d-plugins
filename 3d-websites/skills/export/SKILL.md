---
description: Download 3D models from UnrealizeX to your local project. Use when the user has generated a model and wants to use it in their website.
---

# 3d-websites export

Download models from UnrealizeX to your local project with web-friendly naming and automatic project structure detection.

## Pre-flight

1. **Check connector** — call `get_credit_balance` to verify the connection. If it fails, run `/3d-websites:setup`.
2. **Identify the project root** — look for `package.json`, `index.html`, or the current working directory.

## Gather requirements

Ask the user:

- **Which model?** — if they just generated one, use that timeline. Otherwise, list their timelines.
- **Download location** (optional) — auto-detect if not specified.

## List available models

Call `get_user_timelines` to show the user their timelines. Display as a numbered list:

```
1. ceramic-coffee-mug (created 2 hours ago)
2. gaming-headset-v2 (created yesterday)
3. succulent-planter (created 3 days ago)
```

Ask the user which timeline(s) to export.

## Browse timeline assets

For the selected timeline, call `list_timeline_assets` with the `timeline_id`.

Show the available assets — typically the final textured GLB from the last completed stage. If multiple assets exist (e.g., untextured mesh + textured GLB), recommend the final textured version for web use.

## Download the model

1. Call `request_asset_download` with the `timeline_id` and `asset_id` to get a download URL.
2. Use `curl` to download the file to the appropriate project directory.

### Auto-detect project type

Check the project structure to determine the correct download path:

| Project Type | Detection | Download Path |
|-------------|-----------|---------------|
| Next.js | `next.config.*` exists | `public/models/` |
| Vite / React (CRA) | `vite.config.*` or `react-scripts` in package.json | `public/models/` |
| Astro | `astro.config.*` exists | `public/models/` |
| Plain HTML | `index.html` in root, no framework config | `assets/models/` |
| Unknown | No detection match | `models/` (project root) |

Create the directory if it doesn't exist.

### Web-friendly naming

Rename the downloaded file to a clean slug derived from the timeline name:

- Lowercase
- Replace spaces and special characters with hyphens
- Add `.glb` extension if not present

Examples:
- "Ceramic Coffee Mug" → `ceramic-coffee-mug.glb`
- "Gaming Headset V2" → `gaming-headset-v2.glb`

```bash
curl -L -o <output-path>/<slug>.glb "<download-url>"
```

## Batch download

If the user wants to export multiple models:

1. List all timelines with `get_user_timelines`
2. Let the user pick multiple
3. Download each one sequentially to the same directory

## Optional: Generate a model manifest

For projects that load models dynamically, offer to create a `models/manifest.json`:

```json
{
  "models": [
    {
      "id": "ceramic-coffee-mug",
      "file": "ceramic-coffee-mug.glb",
      "name": "Ceramic Coffee Mug",
      "timeline_id": "tl_abc123"
    }
  ]
}
```

This is useful for galleries, configurators, or any page that loads models from a list.

## After export

Tell the user the file path and suggest next steps:

- **`/3d-websites:viewer`** — create an interactive viewer for the exported model
- **`/3d-websites:3d-scene`** — compose multiple exported models into a scene
- **`/3d-websites:landing-page`** — build a page around the model
- **`/3d-websites:configurator`** — build a product configurator with the model
