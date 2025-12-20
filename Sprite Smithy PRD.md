# PRD — AI Video → 2D Sprite Sheet Generator

*(Spritely-style Web App)*

---

## 1. Product Overview

**Product Name (working):** SpriteSmithy (renameable)
**Inspiration:** Spritely
**Platform:** Web (client-first, WASM where possible)
**Pricing Model:**

* Free trial (watermark / frame limit)
* One-time lifetime license (no subscription)

### Purpose

Enable game developers to:

1. Generate **AI-animated characters as videos**
2. Upload those videos
3. Extract **clean, loopable, properly sized 2D sprite sheets**
4. Eliminate backgrounds, halos, and inconsistent sizing
5. Export game-ready assets in minutes

---

## 2. Target Users

* Indie game developers (Godot, Unity 2D, Phaser)
* Pixel-art game creators
* Hobbyist devs using AI art/video tools
* Rapid prototypers / game jam developers

---

## 3. Supported Input Sources (Non-Integrated)

Users generate video externally using:

* AI image generators (OpenArt, etc.)
* AI video generators (Grok Imagine, Kling, Runway, etc.)

⚠️ **No direct API integrations required** — upload-only keeps scope clean and legal.

---

## 4. Core User Workflow (Golden Path)

![Image](https://komiko.app/images/examples/playground/ai-sprite-sheet-generator/girl-output.webp?utm_source=chatgpt.com)

![Image](https://i.vimeocdn.com/video/1703011963-85170cd28b80b2046e7d2916baf8d1883ecf789ec40014d157629a22f57239b1-d?f=webp\&utm_source=chatgpt.com)

![Image](https://assets.promptbase.com/DALLE_IMAGES%2Fo8AYlIidopVAaGWc3Eed%2Fresized%2F1679876628388_1000x1000.webp?alt=media\&token=5b53b045-1253-47a4-9c48-74c745f3b479\&utm_source=chatgpt.com)

![Image](https://zerofactiongames.com/wp-content/uploads/2015/07/spritesheet.png?w=512\&utm_source=chatgpt.com)

### Step 1 — Upload Video

* Accepted formats: MP4, WebM
* Max duration: configurable (default 10s)
* FPS auto-detected

---

### Step 2 — Loop Selection

**Goal:** Extract a perfect animation loop

**UI**

* Timeline scrubber
* Frame-by-frame stepping
* “Preview Loop” button
* Start Frame selector
* End Frame selector

**Behavior**

* Loop playback preview
* User adjusts start/end until animation is seamless

---

### Step 3 — Frame Extraction

* Extract all frames between selected range
* Display frame grid
* FPS preview control

**Controls**

* Select / deselect frames
* “Every Nth frame” toggle
* Reorder frames (optional)

---

### Step 4 — Background Removal (Chroma Key)

**Inputs**

* Color picker (green / blue / black / custom)
* Threshold slider
* Feathering slider

**Output**

* Transparent PNG frames

**Algorithm**

* Per-pixel chroma distance
* Alpha mask generation
* Optional soft edge smoothing

---

### Step 5 — Auto Crop + Intelligent Sizing (Critical Feature)

**Problem Solved**
AI videos contain massive inconsistent padding.

**Solution**
For each frame:

1. Detect **non-transparent bounding box**
2. Track max width/height across all frames
3. Normalize all frames to a consistent canvas

**User Controls**

* Target sizes:

  * 24×24
  * 32×32
  * 64×64
  * 128×128
  * 256×256
  * 512×512
* “Reduce padding” slider (px)
* Anchor alignment (center-bottom default)

**Guarantee**
Every frame:

* Same canvas size
* Same character scale
* Stable animation alignment

---

### Step 6 — Halo Remover (Edge Transparency Fix)

**Purpose**
Remove green/blue color bleed halos AI tools leave behind.

**Mechanism**

* Identify transparent regions
* Erode edges inward by N pixels
* Apply uniformly to internal transparency islands (e.g., between legs)

**Control**

* Halo removal strength (1–5 pixels)

---

### Step 7 — Export

**Export Options**

* ✅ Sprite Sheet (PNG)
* ✅ Individual Frames (ZIP)
* ✅ JSON metadata (optional)

**Sprite Sheet Rules**

* Uniform tile size
* Row-based layout
* Power-of-two friendly

---

## 5. Functional Requirements

### FR-01 Video Upload

* Drag-and-drop
* Client-side decoding preferred

### FR-02 Frame Accurate Timeline

* Frame-by-frame stepping
* Deterministic frame indexing

### FR-03 Background Removal

* Deterministic chroma key
* No AI dependency

### FR-04 Intelligent Auto-Crop

* Character-based bounding detection
* Cross-frame normalization

### FR-05 Halo Removal

* Edge erosion based on transparency adjacency

### FR-06 Export Engine

* Sprite sheet compositor
* ZIP archive builder

---

## 6. Non-Functional Requirements

| Area        | Requirement              |
| ----------- | ------------------------ |
| Performance | Handle 300–500 frames    |
| Determinism | Same input = same output |
| Privacy     | No server storage        |
| Offline     | Optional PWA support     |
| Licensing   | Client-side license key  |

---

## 7. Technical Architecture

### Frontend

* React / Next.js
* Canvas API
* Web Workers
* WASM (ffmpeg.wasm or custom)

### Image Processing

* RGBA pixel buffers
* Typed arrays
* GPU acceleration (optional WebGL)

### Video Decoding

* ffmpeg.wasm OR WebCodecs API

### Export

* JSZip
* PNG encoder

---

## 8. Key Algorithms (For Claude Code)

### Bounding Box Detection

```
For each frame:
  For each pixel:
    If alpha > threshold:
      Update minX, maxX, minY, maxY
```

### Normalized Canvas

```
globalWidth  = max(all frame widths)
globalHeight = max(all frame heights)
Place each frame centered bottom-aligned
```

### Halo Removal

```
For each transparent pixel:
  If adjacent pixel is opaque:
    Remove N layers inward
```

---

## 9. UI Layout

**Left Panel**

* Upload
* Loop controls
* Chroma settings

**Center**

* Live preview
* Playback loop

**Right Panel**

* Frame grid
* Crop + sizing
* Halo remover
* Export

---

## 10. Licensing & Monetization

* Free:

  * Watermark
  * Limited resolution
* Paid:

  * Unlimited exports
  * All resolutions
  * Lifetime updates

**License enforcement**

* Local license key
* No account required

---

## 11. Out of Scope (Explicit)

* No AI generation
* No character design tools
* No animation creation
* No cloud rendering

---

## 12. Success Metrics

* Time from upload → sprite < 5 minutes
* Zero manual pixel editing required
* Game-ready output without external cleanup

---

## 13. Handoff Prompt for Claude Code

> “Build a client-side web application that converts AI-generated character videos into perfectly aligned, loopable 2D sprite sheets using deterministic image processing as defined in the PRD. Prioritize correctness, determinism, and performance over AI usage.”
