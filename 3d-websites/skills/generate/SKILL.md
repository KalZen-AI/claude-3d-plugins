---
description: Generate a web-optimized 3D model via UnrealizeX. Use when the user wants to create a 3D asset from a text description for use on a website.
---

# Generate 3D

Generate a 3D model through the full UnrealizeX pipeline, optimized for web delivery.

## Pre-flight checks

1. **Check credits** — call `get_credit_balance`. If the balance is zero, tell the user they need credits at [unrealizex.com](https://unrealizex.com).
2. **Check connector** — if the tool call fails, run `/3d-websites:setup` first.

## Gather requirements

Ask the user:

- **What to generate** — a short description of the object (e.g., "a ceramic coffee mug with a matte glaze")
- **Art style** (optional) — realistic, stylized, low-poly, hand-painted, etc.
- **Intended use** — hero model, product shot, scene prop, configurator base (affects polygon budget)

## Prompt engineering tips

Share these with the user to get better results:

- **Single object per prompt** — "a wooden chair" not "a dining room set"
- **Describe materials and finish** — "brushed aluminum with anodized edges" beats "metal thing"
- **Include style keywords** — "photorealistic", "stylized cartoon", "hand-painted fantasy"
- **Mention proportions if unusual** — "tall and narrow", "squat and wide"
- **Avoid negatives in the prompt** — describe what it IS, not what it isn't

## Web-optimized pipeline defaults

Use these defaults unless the user requests otherwise:

| Stage | Parameter | Web Default | Notes |
|-------|-----------|-------------|-------|
| Shape | mode | `light` | Faster, sufficient for most web models |
| Retopology | target faces | 5,000 | Good balance of detail vs performance. Range: 3K (props) to 8K (hero) |
| UV Unwrap | algorithm | `angle_based` | Best for organic shapes. Use `smart_uv` for hard-surface |
| Texture | resolution | 768 | Keeps file size under 2MB. Use 1024 only for hero models |

See [reference.md](reference.md) for all parameters and advanced options.

## Pipeline execution

Execute each stage in order. Wait for completion before proceeding to the next stage.

### Step 1: Create a timeline

Call `create_timeline` with a descriptive name (e.g., "ceramic-coffee-mug").

Save the returned `timeline_id` — you'll need it for every subsequent call.

### Step 2: Conceptualize

Call `conceptualize_image` with:
- `timeline_id` from step 1
- `prompt` — the user's description, enhanced with the tips above
- `num_variants` — generate 4 variants so the user can choose

**Show the concept images to the user and ask which variant to proceed with.**

Call `confirm_stage_selection` with the chosen variant's `state_id`.

### Step 3: Shape generation

Call `create_shape` with:
- `timeline_id`
- `mode`: `"light"` (default) or `"detailed"` for complex geometry

Poll `get_state` with the returned `state_id` until `output_assets` contains URLs. This stage takes 1-3 minutes.

### Step 4: Retopology

Call `start_retopology` with:
- `timeline_id`
- `target_face_count`: 5000 (default)

Poll `get_state` until complete. This produces a clean quad mesh.

### Step 5: UV unwrapping

Call `start_uv_unwrapping` with:
- `timeline_id`

Poll `get_state` until complete.

### Step 6: Texturing

Call `start_texturing` with:
- `timeline_id`

Poll `get_state` until complete. The output includes the final textured GLB file.

### Polling pattern

For steps 3-6, poll `get_state` with the returned `state_id`:
- Wait ~15 seconds between polls
- Check if `output_assets` contains URLs — if yes, the stage is done
- If an error is returned, tell the user and suggest re-running the stage or adjusting the prompt

## After generation

Tell the user their model is ready in UnrealizeX and suggest next steps:

- **`/3d-websites:export`** — download the GLB to your project
- **`/3d-websites:viewer`** — create an interactive viewer for the model
- **`/3d-websites:landing-page`** — build a full page around the model
- **`/3d-websites:configurator`** — if they want color/material variants, generate additional textures

## Error handling

| Error | Action |
|-------|--------|
| Insufficient credits | Direct user to [unrealizex.com](https://unrealizex.com) to add credits |
| Concept images look wrong | Refine the prompt — add more detail about shape, material, or style |
| Shape generation fails | Try `mode: "detailed"` or simplify the prompt to a single clear object |
| Retopology produces artifacts | Lower `target_face_count` or re-run shape with `"detailed"` mode |
| Texture looks off | Re-run texturing — results vary. Or adjust the original concept prompt |
