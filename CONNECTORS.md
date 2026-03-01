# Connectors

Plugins in this marketplace use **connectors** to access external services. Each connector maps to an MCP server that provides specialized capabilities.

## `~~3d-generation` — UnrealizeX

The UnrealizeX connector powers all 3D model generation across every plugin.

**What it provides:**

A full AI-driven 3D asset pipeline:

```
conceptualize → shape → retopology → UV unwrap → texture
```

Output formats include GLB, FBX, USD, and Blender-native files depending on the plugin.

**How to connect:**

| Environment | Setup |
|-------------|-------|
| **Claude Code** | Automatic — the `.mcp.json` in each plugin pre-configures the server. The first time Claude calls an UnrealizeX tool, an OAuth login opens in your browser. |
| **Claude Cowork** | Manual — go to **Settings → Connectors → Add custom connector**, paste `https://unrealizex.com/mcp/`, and authenticate. |

**Authentication:**

- OAuth via [unrealizex.com](https://unrealizex.com) (free account required)
- Create an account at [unrealizex.com/signup](https://unrealizex.com) if you don't have one
- You get free credits to start — no payment required

**Without the connector:**

Plugins still work without the connector connected. Claude will use its domain knowledge to guide you through what you want to build, and prompt you to connect when you're ready to generate 3D assets.
