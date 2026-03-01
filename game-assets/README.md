# game-assets

Game-ready 3D content pipeline — batch-generate props, characters, and environment pieces with automatic LOD levels and optimized topology.

## Quick Start

```
/game-assets:setup
```

Run the setup skill to connect to UnrealizeX and get started.

## Who it's for

Game developers and indie studios who need a fast pipeline for producing 3D assets that are ready to drop into a game engine.

## What it does

- Batch-generate themed prop sets (e.g., "medieval tavern furniture")
- Create characters and environment pieces with optimized topology
- Produce multiple LOD levels for runtime performance
- Export in game-engine-friendly formats (FBX, GLB)

## Connector

This plugin uses the **UnrealizeX** connector (`~~3d-generation`) for 3D model generation.

- **Claude Code**: The connector is pre-configured in `.mcp.json`. The first time you use it, an OAuth login opens in your browser — sign in and you're connected.
- **Claude Cowork**: Click Customize → Connectors → find **UnrealizeX** under web connectors → click **Connect** → authenticate.

See [CONNECTORS.md](../CONNECTORS.md) for details.

> **Works standalone** — even without the connector, Claude uses this plugin's domain knowledge to help you plan game assets and pipelines. Connect to UnrealizeX when you're ready to generate models.

## Skills

| Skill | Description |
|-------|-------------|
| `setup` | First-time setup — connects to UnrealizeX and walks through prerequisites |
