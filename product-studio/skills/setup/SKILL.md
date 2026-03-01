---
description: First-time setup for product-studio. Guides through UnrealizeX account creation and connector setup. Use when the user first installs the plugin or asks about setup.
---

# product-studio setup

Welcome! The **product-studio** plugin turns text descriptions into photorealistic 3D product mockups — explore colorways, render turntable shots, and create lifestyle scenes without a physical photography setup.

## Step 1: Check connector status

Try calling the `get_credit_balance` tool from the UnrealizeX MCP server.

- **If it succeeds** → The connector is already set up. Skip to Step 3.
- **If it fails or the tool isn't available** → Continue to Step 2.

## Step 2: Connect to UnrealizeX

The plugin generates 3D models through UnrealizeX. You need to connect once, then it works automatically.

**Claude Code users:**

The MCP server is already pre-configured in the plugin's `.mcp.json` — no manual setup needed. Just try using any UnrealizeX tool and an OAuth login will open in your browser. Sign in or create a free account at [unrealizex.com](https://unrealizex.com) and you're done.

**Claude Cowork users:**

1. Go to **Settings → Connectors**
2. Click **Add custom connector**
3. Paste the server URL: `https://unrealizex.com/mcp/`
4. Authenticate with your UnrealizeX account

If you don't have an account yet, create a free one at [unrealizex.com](https://unrealizex.com). You get free credits to start.

## Step 3: You're all set

The product-studio plugin is ready to use. Here's what you can do:

- **Generate 3D product mockups** from text descriptions or reference images
- **Explore material variants** and colorways on the same model
- **Render turntable animations** for product pages and e-commerce
- **Create lifestyle mockups** with staged environments

**Try it out** — ask Claude to create a 3D mockup of your product, or generate a turntable render for your store.
