# product-studio

Virtual product photography and prototyping — generate photorealistic 3D mockups, explore colorways, and render turntable shots without a physical studio.

## Quick Start

```
/product-studio:setup
```

Run the setup skill to connect to UnrealizeX and get started.

## Who it's for

Product designers, e-commerce teams, and brand teams who need high-quality product visuals without physical photography setups.

## What it does

- Generate 3D product mockups from descriptions or reference images
- Explore material variants and colorways on the same model
- Render turntable animations for product pages
- Create lifestyle mockups with staged environments

## Connector

This plugin uses the **UnrealizeX** connector (`~~3d-generation`) for 3D model generation.

- **Claude Code**: The connector is pre-configured in `.mcp.json`. The first time you use it, an OAuth login opens in your browser — sign in and you're connected.
- **Claude Cowork**: Go to Settings → Connectors → Add custom connector → paste `https://unrealizex.com/mcp/` → authenticate.

See [CONNECTORS.md](../CONNECTORS.md) for details.

> **Works standalone** — even without the connector, Claude uses this plugin's domain knowledge to help you plan product shoots and mockups. Connect to UnrealizeX when you're ready to generate models.

## Skills

| Skill | Description |
|-------|-------------|
| `setup` | First-time setup — connects to UnrealizeX and walks through prerequisites |
