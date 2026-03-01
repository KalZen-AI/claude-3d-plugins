# 3d-websites

Build interactive 3D web experiences — landing pages, product showcases, and portfolio sites powered by Three.js and AI-generated 3D models.

## Quick Start

```
/3d-websites:setup
```

Run the setup skill to connect to UnrealizeX and get started.

## Who it's for

Web developers, founders, and marketers who want to add 3D content to their websites without learning 3D modeling tools.

## What it does

- Generate 3D models from text descriptions via UnrealizeX
- Export web-optimized assets (GLB/GLTF) for Three.js scenes
- Scaffold interactive 3D landing pages and product showcases
- Create animated 3D hero sections and portfolio pieces

## Connector

This plugin uses the **UnrealizeX** connector (`~~3d-generation`) for 3D model generation.

- **Claude Code**: The connector is pre-configured in `.mcp.json`. The first time you use it, an OAuth login opens in your browser — sign in and you're connected.
- **Claude Cowork**: Go to Settings → Connectors → Add custom connector → paste `https://unrealizex.com/mcp/` → authenticate.

See [CONNECTORS.md](../CONNECTORS.md) for details.

> **Works standalone** — even without the connector, Claude uses this plugin's domain knowledge to help you plan 3D web experiences. Connect to UnrealizeX when you're ready to generate models.

## Skills

| Skill | Description |
|-------|-------------|
| `setup` | First-time setup — connects to UnrealizeX and walks through prerequisites |
