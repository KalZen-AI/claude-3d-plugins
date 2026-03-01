---
description: First-time setup for game-assets. Guides through UnrealizeX account creation and connector setup. Use when the user first installs the plugin or asks about setup.
---

# game-assets setup

Welcome! The **game-assets** plugin is a game-ready 3D content pipeline — batch-generate props, characters, and environment pieces with automatic LOD levels and optimized topology.

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

## Step 3: You're all set

The game-assets plugin is ready to use. Here's what you can do:

- **Batch-generate themed prop sets** (e.g., "medieval tavern furniture")
- **Create characters and environment pieces** with optimized topology
- **Produce multiple LOD levels** for runtime performance
- **Export in game-engine formats** (FBX, GLB)

**Try it out** — ask Claude to generate a set of props for your game, or create a character model ready for your engine.
