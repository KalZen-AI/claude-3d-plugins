# interior-design

3D interior design — generate furniture, decor, and fixtures, then compose them into room visualizations for architects and designers.

## Quick Start

```
/interior-design:setup
```

Run the setup skill to connect to UnrealizeX and get started.

## Who it's for

Architects, interior designers, and real estate professionals who need quick 3D visualizations of spaces and furnishings.

## What it does

- Generate individual furniture and decor pieces from text descriptions
- Create room compositions with multiple coordinated pieces
- Explore style variations (modern, rustic, minimalist, etc.)
- Export assets for architectural visualization tools

## Connector

This plugin uses the **UnrealizeX** connector (`~~3d-generation`) for 3D model generation.

- **Claude Code**: The connector is pre-configured in `.mcp.json`. The first time you use it, an OAuth login opens in your browser — sign in and you're connected.
- **Claude Cowork**: Go to Settings → Connectors → Add custom connector → paste `https://unrealizex.com/mcp/` → authenticate.

See [CONNECTORS.md](../CONNECTORS.md) for details.

> **Works standalone** — even without the connector, Claude uses this plugin's domain knowledge to help you plan interior designs and compositions. Connect to UnrealizeX when you're ready to generate models.

## Skills

| Skill | Description |
|-------|-------------|
| `setup` | First-time setup — connects to UnrealizeX and walks through prerequisites |
