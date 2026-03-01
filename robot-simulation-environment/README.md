# robot-simulation-environment

Generate 3D environments for robotic simulation — create workspace props, export to Blender/OpenUSD, and prepare scenes for Isaac Lab.

## Quick Start

```
/robot-simulation-environment:setup
```

Run the setup skill to connect to UnrealizeX, check for Blender, and get started.

## Who it's for

Roboticists and automation engineers who need realistic 3D environments for training and testing robotic systems in simulation.

## What it does

- Generate workspace props (tables, shelves, bins, tools) from descriptions
- Export to Blender (.blend) for scene composition
- Convert to OpenUSD format for simulation pipelines
- Prepare scenes compatible with NVIDIA Isaac Lab

## Prerequisites

This plugin's workflows may require external software:

- **Blender** — used for scene composition and OpenUSD export. Free at [blender.org/download](https://www.blender.org/download/).
- **NVIDIA Isaac Lab** (optional) — for simulation pipeline integration.

The setup skill checks for these and guides installation.

## Connector

This plugin uses the **UnrealizeX** connector (`~~3d-generation`) for 3D model generation.

- **Claude Code**: The connector is pre-configured in `.mcp.json`. The first time you use it, an OAuth login opens in your browser — sign in and you're connected.
- **Claude Cowork**: Go to Settings → Connectors → Add custom connector → paste `https://unrealizex.com/mcp/` → authenticate.

See [CONNECTORS.md](../CONNECTORS.md) for details.

> **Works standalone** — even without the connector, Claude uses this plugin's domain knowledge to help you plan simulation environments. Connect to UnrealizeX when you're ready to generate models.

## Skills

| Skill | Description |
|-------|-------------|
| `setup` | First-time setup — connects to UnrealizeX, checks for Blender, walks through prerequisites |
