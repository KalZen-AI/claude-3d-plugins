# Generate — Pipeline Parameter Reference

Complete parameter reference for each UnrealizeX pipeline stage.

## create_timeline

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | yes | Descriptive name for the timeline (e.g., "ceramic-mug-v2") |

Returns: `timeline_id` (string)

## conceptualize_image

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `timeline_id` | string | yes | — | Timeline to add the concept to |
| `prompt` | string | yes | — | Text description of the object |
| `num_variants` | number | no | 4 | Number of concept variants to generate (1-4) |

Returns: `state_id`, concept image URLs in `output_assets`

### Prompt structure guide

```
[object] + [material/finish] + [style] + [notable features]

Examples:
"a ceramic coffee mug with a matte white glaze and rounded handle"
"a futuristic gaming headset, brushed aluminum with RGB accents, cyberpunk style"
"a potted succulent in a terracotta planter, photorealistic"
"a low-poly medieval shield with hand-painted wood and iron texture"
```

## confirm_stage_selection

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeline_id` | string | yes | Timeline ID |
| `state_id` | string | yes | The state_id of the chosen concept variant |

## create_shape

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `timeline_id` | string | yes | — | Timeline ID |
| `mode` | string | no | `"light"` | `"light"` (faster, ~1 min) or `"detailed"` (higher fidelity, ~3 min) |

**When to use each mode:**
- `light` — most web objects, props, simple products, icons
- `detailed` — hero models with complex geometry, organic shapes, characters

Returns: `state_id`. Poll `get_state` for completion.

## start_retopology

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `timeline_id` | string | yes | — | Timeline ID |
| `target_face_count` | number | no | 5000 | Target polygon count for the retopologized mesh |

**Face count guidelines for web:**

| Use Case | Target Faces | File Size (approx) |
|----------|-------------|-------------------|
| Background prop | 1,000-3,000 | < 500KB |
| Standard web model | 3,000-5,000 | 500KB-1.5MB |
| Hero / product model | 5,000-8,000 | 1-3MB |
| High-detail showcase | 8,000-15,000 | 3-5MB |

Higher counts = more detail but larger files and slower rendering. For web, 5K faces is the sweet spot.

Returns: `state_id`. Poll `get_state` for completion.

## start_uv_unwrapping

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `timeline_id` | string | yes | — | Timeline ID |

Returns: `state_id`. Poll `get_state` for completion.

## start_texturing

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `timeline_id` | string | yes | — | Timeline ID |

Returns: `state_id`. Poll `get_state` for completion. Output includes the final GLB file URL.

## get_state

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state_id` | string | yes | State ID returned from a pipeline stage |

Returns: state object with `status`, `output_assets` (array of URLs when complete), and error info if failed.

**Completion check:** if `output_assets` is non-empty, the stage is done.

## get_credit_balance

No parameters. Returns the user's current credit balance.

## get_user_timelines

No parameters. Returns all timelines for the authenticated user.

## list_timeline_assets

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeline_id` | string | yes | Timeline to list assets for |

Returns: all assets across all stages for the given timeline.

## request_asset_download

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeline_id` | string | yes | Timeline ID |
| `asset_id` | string | yes | Specific asset to download |

Returns: a download URL (time-limited).
