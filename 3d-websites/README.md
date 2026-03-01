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
- Export web-optimized GLB assets to your project
- Build interactive 3D viewers, scenes, and landing pages
- Create scroll-driven 3D storytelling experiences
- Build product configurators with real-time color/material switching

## Connector

This plugin uses the **UnrealizeX** connector (`~~3d-generation`) for 3D model generation.

- **Claude Code**: The connector is pre-configured in `.mcp.json`. The first time you use it, an OAuth login opens in your browser — sign in and you're connected.
- **Claude Cowork**: Click Customize → Connectors → find **UnrealizeX** under web connectors → click **Connect** → authenticate.

See [CONNECTORS.md](../CONNECTORS.md) for details.

> **Works standalone** — even without the connector, Claude uses this plugin's domain knowledge to help you plan 3D web experiences. Connect to UnrealizeX when you're ready to generate models.

## Skills

| Skill | Description |
|-------|-------------|
| `setup` | First-time setup — connects to UnrealizeX and walks through prerequisites |
| `generate` | Generate 3D — create a web-optimized 3D model from a text description via the full UnrealizeX pipeline |
| `export` | Download models from UnrealizeX to your local project with auto-detected paths |
| `viewer` | Create an interactive 3D model viewer — vanilla Three.js, React Three Fiber, or `<model-viewer>` |
| `scene` | 3D Scene — compose multiple models into an interactive scene with lighting and camera systems |
| `landing-page` | Build a complete 3D landing page with hero section, copy, CTAs, and responsive layout |
| `scroll-scene` | Create scroll-driven 3D storytelling — camera fly-throughs, model reveals, scroll animations |
| `configurator` | Build a 3D product configurator with real-time color, material, and variant switching |

## Workflow

```
                     setup
                       │
                       ▼
                    generate ──────────────┐
                       │                   │
                       ▼                   │
                     export          (user has model)
                       │                   │
          ┌────────────┼───────────────────┤
          ▼            ▼            ▼      ▼
       viewer        scene     landing   scroll     configurator
                               -page     -scene
```

**Typical paths:**

- **Product launch**: `generate` → `export` → `landing-page`
- **Product showcase**: `generate` → `export` → `configurator`
- **Portfolio piece**: `generate` → `export` → `scroll-scene`
- **Model gallery**: `generate` (multiple) → `export` → `scene`
- **Quick embed**: `generate` → `export` → `viewer`
