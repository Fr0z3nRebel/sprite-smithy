import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Getting Started - Sprite Smithy',
  description:
    'Step-by-step guide to transforming AI-generated videos into production-ready sprite sheets: upload, loop, extract, chroma key, auto-crop, halo removal, and export.',
};

const STEP_IMAGES = [
  { src: '/assets/guide/step-1.png', alt: 'Step 1: Upload your video', caption: 'Drag and drop or click to browse. With ?guide=1 you can load the sample video for this guide.' },
  { src: '/assets/guide/step-2.png', alt: 'Step 2: Loop selection', caption: 'Scrub the timeline and set start/end frames for a seamless loop.' },
  { src: '/assets/guide/step-3.png', alt: 'Step 3: Frame extraction', caption: 'Extract individual frames from your selected range.' },
  { src: '/assets/guide/step-4.png', alt: 'Step 4: Background removal', caption: 'Chroma key color picker and threshold for clean transparency.' },
  { src: '/assets/guide/step-5.png', alt: 'Step 5: Auto-crop & normalize', caption: 'Consistent bounding box and size across all frames.' },
  { src: '/assets/guide/step-6.png', alt: 'Step 6: Halo remover', caption: 'Remove AI halo and soften edges for game-ready sprites.' },
  { src: '/assets/guide/step-7.png', alt: 'Step 7: Export', caption: 'Download sprite sheet, PNGs, and JSON metadata.' },
] as const;

export default function GuidePage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="prose prose-slate dark:prose-invert max-w-none prose-a:text-muted-foreground prose-a:hover:text-foreground prose-a:no-underline prose-a:transition">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Getting Started with Sprite Smithy
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Transforming your AI-generated videos into production-ready assets is
            a streamlined 7-step process. Follow this guide to create your first
            sprite sheet.
          </p>
          <p className="text-muted-foreground mb-4">
            This guide is for game developers, pixel artists, and anyone who
            wants to turn character animations from AI video tools (e.g.
            Runway, Pika, Kling) into clean, loopable sprite sheets for engines
            like GDevelop, Unity, Godot, or GameMaker. You&apos;ll learn the
            full workflow from upload to export, plus troubleshooting and best
            practices so your sprites look sharp and animate smoothly in-game.
          </p>
          <p className="text-muted-foreground mb-0">
            No account or payment is required. All processing runs in your
            browser—your video never leaves your device.
          </p>
        </header>

        <section className="mb-12" aria-labelledby="overview">
          <h2 id="overview" className="text-2xl font-semibold mb-6 scroll-mt-8">
            Overview
          </h2>
          <p className="mb-4">
            Sprite Smithy runs entirely in your browser. You upload a video,
            define a loop, extract frames, remove the background, normalize
            size, clean edges, and export. No account required—your files never
            leave your device.
          </p>
          <p className="mb-4">
            The tool is built for the way AI video generators work: short clips
            (often a few seconds), single characters on a solid or green-screen
            background. By the end of the pipeline you have a sprite sheet
            (one image with all frames in a grid), optional individual PNGs, and
            a metadata JSON file that records dimensions and frame count for easy
            import into your game engine or animation system.
          </p>
          <p className="mb-4">
            Each step is shown in the left sidebar of the tool. You can move
            forward and back between steps; your work is kept in memory until you
            refresh or close the tab. The right panel shows a live preview of
            your frames so you can spot issues early.
          </p>
          <figure className="my-8 rounded-xl border border-border bg-muted/30 overflow-hidden">
            <Image
              src="/assets/guide/home.png"
              alt="Sprite Smithy home page"
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
            />
            <figcaption className="px-4 py-3 text-sm text-muted-foreground">
              Start at the Sprite Smithy home page, then open the tool to begin.
            </figcaption>
          </figure>
        </section>

        <section className="mb-12" aria-labelledby="before-start">
          <h2 id="before-start" className="text-2xl font-semibold mb-6 scroll-mt-8">
            Before You Start
          </h2>
          <p className="mb-4">
            For the smoothest experience, use a video that meets these
            guidelines: MP4, WebM, or MOV format; under 100MB file size; and
            ideally under 10 seconds so frame extraction stays fast. If your AI
            tool can export with a solid green or blue background, use that—it
            makes background removal in Step 4 much cleaner than trying to key
            out complex or noisy backgrounds.
          </p>
          <p className="mb-0">
            Sprite Smithy works best in modern Chrome, Firefox, or Edge. All
            processing is done locally with the Canvas API; no video is sent to
            any server, so your assets stay private.
          </p>
        </section>

        <section className="mb-12" aria-labelledby="seven-steps">
          <h2
            id="seven-steps"
            className="text-2xl font-semibold mb-6 scroll-mt-8"
          >
            The 7-Step Process
          </h2>

          <ol className="list-none space-y-8 pl-0">
            <li>
              <h3 className="text-xl font-semibold mb-6">
                1. Upload Your Video
              </h3>
              <p className="mb-4">
                Start by dragging and dropping your character video into the
                tool. We support MP4, WebM, and MOV files up to 100MB. You can
                also click the upload area to open a file picker. Once the file
                is loaded, the tool reads its duration, frame rate, and
                dimensions and shows a short preview so you can confirm it&apos;s
                the right clip before moving on.
              </p>
              <figure className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                <Image
                  src={STEP_IMAGES[0].src}
                  alt={STEP_IMAGES[0].alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                  {STEP_IMAGES[0].caption}
                </figcaption>
              </figure>
            </li>

            <li>
              <h3 className="text-xl font-semibold mb-6">
                2. Define the Loop
              </h3>
              <p className="mb-4">
                Use the timeline to scrub through your video. Select the exact
                start and end frames to ensure your animation cycle (like a walk
                or idle) is perfectly seamless. The tool shows the current frame
                number and total frames; use the -1 / +1 and -10 / +10 buttons
                to nudge the range, and Play Loop to preview how the loop will
                look. You can also set a frame skip (e.g. every 2nd frame) to
                reduce the number of exported frames and get a snappier animation
                if your source has a high frame rate.
              </p>
              <figure className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                <Image
                  src={STEP_IMAGES[1].src}
                  alt={STEP_IMAGES[1].alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                  {STEP_IMAGES[1].caption}
                </figcaption>
              </figure>
            </li>

            <li>
              <h3 className="text-xl font-semibold mb-6">
                3. Extract Frames
              </h3>
              <p className="mb-4">
                Click the extraction button. Our system uses the Canvas API to
                pull individual high-quality frames from your video. Extraction
                runs entirely in the browser—no upload to a server—and a
                progress indicator shows how many frames have been processed.
                When it&apos;s done, you&apos;ll see a grid of thumbnails in the
                right panel and a summary (frame count, size). If the count or
                range looks wrong, go back to Step 2 and adjust the loop or
                frame skip before re-extracting.
              </p>
              <figure className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                <Image
                  src={STEP_IMAGES[2].src}
                  alt={STEP_IMAGES[2].alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                  {STEP_IMAGES[2].caption}
                </figcaption>
              </figure>
            </li>

            <li>
              <h3 className="text-xl font-semibold mb-6">
                4. Remove Background
              </h3>
              <p className="mb-4">
                Select your background color using the Chroma Key tool. Click the
                color swatch or use the hex field to match your video&apos;s
                background (e.g. bright green #00FF00); there are also quick
                presets for common green, blue, white, and black. Adjust the
                Threshold slider until the background disappears completely
                without cutting into your character. Use the Before/After
                preview to compare; a small amount of Feathering can soften the
                edge between character and transparency. If the background
                isn&apos;t a solid color, chroma keying will be less effective—when
                possible, re-export from your AI tool with a solid backdrop.
              </p>
              <figure className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                <Image
                  src={STEP_IMAGES[3].src}
                  alt={STEP_IMAGES[3].alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                  {STEP_IMAGES[3].caption}
                </figcaption>
              </figure>
            </li>

            <li>
              <h3 className="text-xl font-semibold mb-6">
                5. Auto-Crop & Normalize
              </h3>
              <p className="mb-4">
                Let the tool automatically detect the character&apos;s bounding
                box. This ensures every frame is centered and the same size,
                preventing &quot;jitter&quot; in your game engine. You can choose a
                target size (e.g. 256×256 or 128×128) from presets or use a
                custom value; the tool scales and centers each frame within that
                canvas. Padding and alignment options let you fine-tune where the
                character sits in the frame. Consistent dimensions across all
                frames are essential for sprite sheets—without this step, small
                shifts in the AI output can make the animation bounce or drift
                on screen.
              </p>
              <figure className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                <Image
                  src={STEP_IMAGES[4].src}
                  alt={STEP_IMAGES[4].alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                  {STEP_IMAGES[4].caption}
                </figcaption>
              </figure>
            </li>

            <li>
              <h3 className="text-xl font-semibold mb-6">
                6. Clean Up Edges
              </h3>
              <p className="mb-4">
                Apply the Halo Removal post-processing to eliminate any leftover
                AI artifacts or color bleeding around the edges of your sprite.
                Many AI videos leave a faint outline or &quot;halo&quot; where the
                background was removed. The Halo Remover erodes a small number
                of edge pixels (you control the strength in pixels) to trim that
                away. Use the preview and impact analysis to see how much will
                be removed; start with a low value and increase if edges still
                look soft. You can skip this step if your chroma key result
                already looks clean.
              </p>
              <figure className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                <Image
                  src={STEP_IMAGES[5].src}
                  alt={STEP_IMAGES[5].alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                  {STEP_IMAGES[5].caption}
                </figcaption>
              </figure>
            </li>

            <li>
              <h3 className="text-xl font-semibold mb-6">
                7. Export Your Assets
              </h3>
              <p className="mb-4">
                Download your final Batch Export. You&apos;ll receive a ZIP file
                containing your sprite sheet (all frames in one image, laid out
                in a grid), optional individual PNG frames, and a JSON metadata
                file that records frame count, dimensions, and processing
                settings for easy integration into GDevelop, Unity, Godot, or
                other engines. You can choose PNG (recommended for compatibility)
                or WebP for smaller file size. The metadata file is useful for
                scripting import or reproducing the same sprite sheet later.
              </p>
              <figure className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                <Image
                  src={STEP_IMAGES[6].src}
                  alt={STEP_IMAGES[6].alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                  {STEP_IMAGES[6].caption}
                </figcaption>
              </figure>
            </li>
          </ol>
        </section>

        <section className="mb-12" aria-labelledby="troubleshooting">
          <h2
            id="troubleshooting"
            className="text-2xl font-semibold mb-6 scroll-mt-8"
          >
            Troubleshooting & Tips
          </h2>

          <div className="space-y-8">
            <article
              className="rounded-lg border border-border bg-muted/30 p-5"
              aria-labelledby="trouble-background"
            >
              <h3
                id="trouble-background"
                className="text-lg font-semibold mb-2 text-foreground"
              >
                Background removal isn&apos;t clean
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Contrast is key:</strong> For the best results with
                  Chroma Keying, try to generate your AI videos with a
                  high-contrast background (like bright green or blue) that
                  doesn&apos;t match any colors on your character. The more
                  uniform and saturated the background, the cleaner the key.
                </li>
                <li>
                  <strong>Adjust threshold:</strong> If parts of your character
                  are disappearing, lower the threshold. If pieces of the
                  background remain, increase it slightly. Use the live preview
                  to find the sweet spot where the background is gone but the
                  character edges stay intact.
                </li>
              </ul>
            </article>

            <article
              className="rounded-lg border border-border bg-muted/30 p-5"
              aria-labelledby="trouble-jittery"
            >
              <h3
                id="trouble-jittery"
                className="text-lg font-semibold mb-2 text-foreground"
              >
                My animation looks &quot;jittery&quot;
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Use Auto-Crop:</strong> Ensure Auto-Crop & Normalize
                  is active. This tool fixes inconsistencies where the AI might
                  have shifted the character&apos;s position slightly between
                  frames by detecting the bounding box per frame and centering
                  consistently.
                </li>
                <li>
                  <strong>Check your loop:</strong> Go back to the Loop
                  Selection step and ensure your first and last frames transition
                  smoothly into one another. A visible jump at the loop point
                  will look like a stutter in-game.
                </li>
              </ul>
            </article>

            <article
              className="rounded-lg border border-border bg-muted/30 p-5"
              aria-labelledby="trouble-fuzzy"
            >
              <h3
                id="trouble-fuzzy"
                className="text-lg font-semibold mb-2 text-foreground"
              >
                The edges of my sprite look &quot;fuzzy&quot; or &quot;ghosted&quot;
              </h3>
              <p className="text-muted-foreground mb-0">
                <strong>Halo Removal:</strong> AI video generators often leave a
                soft &quot;halo&quot; around subjects. Use the Halo Remover tool
                specifically designed to sharpen these edges for game-ready
                transparency. Start with a low strength (1–2 pixels) and
                increase only if needed to avoid over-eroding thin details like
                hair or accessories.
              </p>
            </article>

            <article
              className="rounded-lg border border-border bg-muted/30 p-5"
              aria-labelledby="trouble-upload"
            >
              <h3
                id="trouble-upload"
                className="text-lg font-semibold mb-2 text-foreground"
              >
                The video won&apos;t upload
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Check format:</strong> Verify your file is MP4, WebM,
                  or MOV. Some screen recorders or phones use other codecs that
                  may not be supported.
                </li>
                <li>
                  <strong>Check size:</strong> Ensure the file size is under
                  100MB. For short clips (a few seconds), this is rarely an
                  issue.
                </li>
                <li>
                  <strong>Browser support:</strong> Since Sprite Smithy
                  processes everything locally in your browser, use a modern
                  version of Chrome, Firefox, or Edge for the best performance.
                  Disable browser extensions that might block or alter file
                  access if uploads fail unexpectedly.
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="best-practices">
          <h2
            id="best-practices"
            className="text-2xl font-semibold mb-6 scroll-mt-8"
          >
            Best Practices
          </h2>
          <p className="mb-4 text-muted-foreground">
            Keep loop lengths short (one to three seconds) for walk cycles,
            idles, or attacks—most game animations don&apos;t need long clips,
            and shorter loops mean fewer frames to process and smaller exports.
            Use frame skip in Step 2 if your source is 24fps or higher and you
            want a lighter sprite sheet; exporting every second frame often
            still looks smooth for pixel-art style.
          </p>
          <p className="mb-4 text-muted-foreground">
            When generating AI video, prompt for a single character on a solid
            background and, if the tool allows, request minimal camera or
            character movement so the loop lines up cleanly. After export, keep
            the metadata JSON with your project so you can document or recreate
            the same settings later. For game engines that expect a fixed grid
            (e.g. N×M frames), the export summary in Step 7 shows the exact
            dimensions and frame count to configure your animation.
          </p>
          <p className="mb-0 text-muted-foreground">
            If you run into a case the tool doesn&apos;t handle well—for example
            multiple characters or a very noisy background—consider pre-processing
            the video in an editor to isolate one character on a solid color,
            then run it through Sprite Smithy for the best result.
          </p>
        </section>

        <section className="mb-8" aria-labelledby="more-info">
          <h2 id="more-info" className="text-2xl font-semibold mb-4 scroll-mt-8">
            Learn More
          </h2>
          <p className="text-muted-foreground mb-0">
            Visit{' '}
            <a href="/#features" className="text-muted-foreground hover:text-foreground no-underline transition">
              Features
            </a>{' '}
            and{' '}
            <a href="/#how-it-works" className="text-muted-foreground hover:text-foreground no-underline transition">
              How It Works
            </a>{' '}
            for a high-level overview, or head to the{' '}
            <a href="/faq" className="text-muted-foreground hover:text-foreground no-underline transition">
              FAQ
            </a>{' '}
            for common questions. Ready to start? Open the{' '}
            <a href="/tool" className="text-muted-foreground hover:text-foreground no-underline transition">
              Sprite Smithy tool
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
