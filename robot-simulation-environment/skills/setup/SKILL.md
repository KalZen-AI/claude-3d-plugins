---
description: First-time setup for robot-simulation-environment. Guides through UnrealizeX account creation, connector setup, and Blender installation check. Use when the user first installs the plugin or asks about setup.
---

# robot-simulation-environment setup

Welcome! The **robot-simulation-environment** plugin generates 3D workspace props and environments for robotic simulation — export to Blender, OpenUSD, and prepare scenes for NVIDIA Isaac Lab.

## Step 1: Check connector status

Try calling the `get_credit_balance` tool from the UnrealizeX MCP server.

- **If it succeeds** → The connector is already set up. Skip to Step 3.
- **If it fails or the tool isn't available** → Continue to Step 2.

## Step 2: Connect to UnrealizeX

The plugin generates 3D models through UnrealizeX. You need to connect once, then it works automatically.

**Claude Code users:**

The MCP server is already pre-configured in the plugin's `.mcp.json` — no manual setup needed. Just try using any UnrealizeX tool and an OAuth login will open in your browser. Sign in or create a free account at [unrealizex.com](https://unrealizex.com) and you're done.

**Claude Cowork users:**

1. Click **Customize** in the left sidebar
2. Go to **Connectors**
3. Find **UnrealizeX** under web connectors
4. Click on **UnrealizeX**, then click **Connect**
5. Authenticate with your UnrealizeX account

If you don't have an account yet, create a free one at [unrealizex.com](https://unrealizex.com). You get free credits to start.

## Step 3: Check prerequisites

This plugin's workflows use external software. Check if Blender is installed:

```bash
blender --version
```

- **If Blender is found** → You're good. Continue to Step 4.
- **If not installed** → Install Blender from [blender.org/download](https://www.blender.org/download/). Blender is free and open-source. The plugin uses it for scene composition and OpenUSD export.

Optional: If you plan to use NVIDIA Isaac Lab, ensure it's installed and configured separately per [Isaac Lab docs](https://isaac-sim.github.io/IsaacLab/).

## Step 4: You're all set

The robot-simulation-environment plugin is ready to use. Here's what you can do:

- **Generate workspace props** (tables, shelves, bins, tools) from descriptions
- **Export to Blender** (.blend) for scene composition
- **Convert to OpenUSD** format for simulation pipelines
- **Prepare scenes** compatible with NVIDIA Isaac Lab

**Try it out** — ask Claude to generate a robotic workspace with props, or create an environment for your simulation pipeline.
