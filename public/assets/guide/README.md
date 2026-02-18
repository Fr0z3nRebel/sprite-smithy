# Guide assets

- **home.png** – Marketing home page.
- **tool.png** – Tool overview (upload step).
- **step-1.png … step-7.png** – Screenshot for each of the 7 tool steps.

## Capturing step screenshots (steps 2–7)

1. Run the app: `npm run dev`.
2. Open **http://localhost:3000/tool?guide=1**.
3. Click **“Load sample video (for guide screenshots)”** and wait for the sample to load.
4. For each step 2–7, go to that step in the left sidebar (or follow the flow: Loop → Extract → Background removal → Auto-crop → Halo remover → Export). Apply any required action (e.g. Extract Frames, Apply Chroma Key) so the step’s UI is visible.
5. Take a full-page screenshot and save it as `step-N.png` in this folder (e.g. `step-2.png` for Loop Selection).

Sample video file: `grok-video-86f78a20-1cee-47ca-abd2-f5f4948f7aee.mp4` (same directory).
