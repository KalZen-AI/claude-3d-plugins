---
description: First-time setup for 3d-websites. Guides through UnrealizeX account creation and connector setup. Use when the user first installs the plugin or asks about setup.
---

# 3d-websites setup

Welcome! The **3d-websites** plugin helps you build interactive 3D web experiences — landing pages, product showcases, and portfolio sites powered by Three.js and AI-generated 3D models.

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

The 3d-websites plugin is ready to use. Here's what you can do:

- **Generate 3D models** from text descriptions, optimized for the web (GLB/GLTF)
- **Scaffold Three.js scenes** with interactive 3D landing pages and product showcases
- **Create animated hero sections** with 3D content for portfolio sites

**Try it out** — ask Claude to create a 3D landing page with an interactive product model, or generate a 3D asset for your next web project.
