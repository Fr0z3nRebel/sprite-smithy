'use client';

import { useState } from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Video } from '@remotion/media';

const FPS = 30;

// 70-second full walkthrough: intro + 7 steps + outro
const DURATION_SEC = 70;
const SCENES = {
  intro: { start: 0, duration: 4 },
  step1: { start: 4, duration: 7 },
  step2: { start: 11, duration: 7 },
  step3: { start: 18, duration: 7 },
  step4: { start: 25, duration: 7 },
  step5: { start: 32, duration: 7 },
  step6: { start: 39, duration: 7 },
  step7: { start: 46, duration: 19 },
  outro: { start: 65, duration: 5 },
} as const;

const STEP_TITLES = [
  'Upload Video',
  'Loop Selection',
  'Frame Extraction',
  'Background Removal',
  'Auto-Crop & Sizing',
  'Halo Remover',
  'Export',
] as const;

const SAMPLE_VIDEO = 'https://remotion.media/BigBuckBunny.mp4';

function useSceneProgress(
  frame: number,
  sceneStartSec: number,
  sceneDurationSec: number
) {
  const startF = sceneStartSec * FPS;
  const endF = startF + sceneDurationSec * FPS;
  const localFrame = frame - startF;
  const progress = interpolate(
    frame,
    [startF, startF + 0.3 * FPS, endF - 0.3 * FPS, endF],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return { progress, localFrame, isActive: frame >= startF && frame < endF };
}

export const SpriteDemo = () => {
  const [videoError, setVideoError] = useState(false);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = useSceneProgress(frame, SCENES.intro.start, SCENES.intro.duration);
  const s1 = useSceneProgress(frame, SCENES.step1.start, SCENES.step1.duration);
  const s2 = useSceneProgress(frame, SCENES.step2.start, SCENES.step2.duration);
  const s3 = useSceneProgress(frame, SCENES.step3.start, SCENES.step3.duration);
  const s4 = useSceneProgress(frame, SCENES.step4.start, SCENES.step4.duration);
  const s5 = useSceneProgress(frame, SCENES.step5.start, SCENES.step5.duration);
  const s6 = useSceneProgress(frame, SCENES.step6.start, SCENES.step6.duration);
  const s7 = useSceneProgress(frame, SCENES.step7.start, SCENES.step7.duration);
  const outro = useSceneProgress(frame, SCENES.outro.start, SCENES.outro.duration);

  const springIn = (localFrame: number, delayFrames = 0) =>
    spring({
      frame: localFrame - delayFrames,
      fps,
      config: { damping: 22, stiffness: 120 },
    });

  const bg = 'linear-gradient(180deg, #0f0f12 0%, #1a1a22 100%)';
  const cardBg = 'rgba(255,255,255,0.06)';
  const border = '1px solid rgba(255,255,255,0.08)';

  return (
    <AbsoluteFill
      style={{
        background: bg,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ---------- INTRO ---------- */}
      {intro.isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: intro.progress,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 64,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              transform: `scale(${springIn(intro.localFrame)})`,
              textShadow: '0 4px 30px rgba(0,0,0,0.4)',
            }}
          >
            Sprite Smithy
          </h1>
          <p
            style={{
              marginTop: 16,
              fontSize: 24,
              color: 'rgba(255,255,255,0.7)',
              transform: `scale(${springIn(intro.localFrame, 8)})`,
            }}
          >
            Video to Sprite Sheet Converter
          </p>
        </div>
      )}

      {/* ---------- STEP 1: Upload ---------- */}
      {s1.isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 60,
            opacity: s1.progress,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              transform: `scale(${springIn(s1.localFrame)})`,
            }}
          >
            {STEP_TITLES[0]}
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
            Drop your video or click to browse
          </p>
          <div
            style={{
              width: 'min(100%, 640px)',
              aspectRatio: '16/9',
              maxHeight: 360,
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              transform: `scale(${springIn(s1.localFrame, 12)})`,
              border: border,
              background: '#1a1a22',
            }}
          >
            {videoError ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 18,
                }}
              >
                Sample video
              </div>
            ) : (
              <Video
                src={SAMPLE_VIDEO}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                volume={0}
                loop
                onError={() => setVideoError(true)}
              />
            )}
          </div>
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            MP4, WebM, MOV · up to 100MB
          </p>
        </div>
      )}

      {/* ---------- STEP 2: Loop Selection ---------- */}
      {s2.isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 60,
            opacity: s2.progress,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              transform: `scale(${springIn(s2.localFrame)})`,
            }}
          >
            {STEP_TITLES[1]}
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
            Set start and end frame for your loop
          </p>
          <div
            style={{
              width: 'min(100%, 700px)',
              transform: `scale(${springIn(s2.localFrame, 10)})`,
            }}
          >
            <div
              style={{
                height: 56,
                background: cardBg,
                borderRadius: 12,
                border,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '15%',
                  top: 8,
                  bottom: 8,
                  right: '35%',
                  background: 'rgba(99, 102, 241, 0.4)',
                  borderRadius: 8,
                  border: '2px solid rgba(99, 102, 241, 0.8)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  background: `repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.06) 20px)`,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
              <span>Frame 0</span>
              <span>Start: 24 · End: 72</span>
              <span>Frame 120</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------- STEP 3: Frame Extraction ---------- */}
      {s3.isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 60,
            opacity: s3.progress,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              transform: `scale(${springIn(s3.localFrame)})`,
            }}
          >
            {STEP_TITLES[2]}
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
            Extract frames from your selection
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 8,
              width: 'min(100%, 480px)',
              transform: `scale(${springIn(s3.localFrame, 8)})`,
            }}
          >
            {Array.from({ length: 18 }, (_, i) => {
              const cellProgress = spring({
                frame: s3.localFrame - i * 2,
                fps,
                config: { damping: 18, stiffness: 150 },
              });
              const hue = (i * 20 + 200) % 360;
              return (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    background: `linear-gradient(135deg, hsl(${hue}, 40%, 26%) 0%, hsl(${hue}, 35%, 16%) 100%)`,
                    borderRadius: 8,
                    transform: `scale(${cellProgress})`,
                    opacity: cellProgress,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                />
              );
            })}
          </div>
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            18 frames extracted
          </p>
        </div>
      )}

      {/* ---------- STEP 4: Background Removal ---------- */}
      {s4.isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 60,
            opacity: s4.progress,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              transform: `scale(${springIn(s4.localFrame)})`,
            }}
          >
            {STEP_TITLES[3]}
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
            Chroma key · pick color and threshold
          </p>
          <div
            style={{
              display: 'flex',
              gap: 32,
              alignItems: 'center',
              transform: `scale(${springIn(s4.localFrame, 10)})`,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: 8,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
              <p style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Before</p>
            </div>
            <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.4)' }}>→</span>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 12,
                  background: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
                  backgroundColor: '#222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: 8,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
              <p style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>After (transparent)</p>
            </div>
          </div>
        </div>
      )}

      {/* ---------- STEP 5: Auto-Crop ---------- */}
      {s5.isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 60,
            opacity: s5.progress,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              transform: `scale(${springIn(s5.localFrame)})`,
            }}
          >
            {STEP_TITLES[4]}
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
            Crop and normalize to consistent size
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              width: 'min(100%, 380px)',
              transform: `scale(${springIn(s5.localFrame, 8)})`,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  background: cardBg,
                  borderRadius: 10,
                  border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${springIn(s5.localFrame, 12 + i * 3)})`,
                }}
              >
                <div
                  style={{
                    width: '70%',
                    height: '70%',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 6,
                  }}
                />
              </div>
            ))}
          </div>
          <p style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            256×256px · same bounds for all frames
          </p>
        </div>
      )}

      {/* ---------- STEP 6: Halo Remover ---------- */}
      {s6.isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 60,
            opacity: s6.progress,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              transform: `scale(${springIn(s6.localFrame)})`,
            }}
          >
            {STEP_TITLES[5]}
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
            Clean up edge halos for crisp sprites
          </p>
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 12,
              background: cardBg,
              border,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${springIn(s6.localFrame, 10)})`,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 8,
                boxShadow: '0 0 0 2px rgba(255,255,255,0.1)',
              }}
            />
          </div>
          <p style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            Strength slider · preview in real time
          </p>
        </div>
      )}

      {/* ---------- STEP 7: Export ---------- */}
      {s7.isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 60,
            opacity: s7.progress,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              transform: `scale(${springIn(s7.localFrame)})`,
            }}
          >
            {STEP_TITLES[6]}
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
            Sprite sheet + frames + metadata in one ZIP
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: 4,
              width: 'min(100%, 520px)',
              aspectRatio: '2/1',
              maxHeight: 260,
              background: '#0d0d10',
              borderRadius: 12,
              padding: 12,
              border,
              transform: `scale(${springIn(s7.localFrame, 8)})`,
            }}
          >
            {Array.from({ length: 18 }, (_, i) => {
              const progress = spring({
                frame: s7.localFrame - 3 - i * 2,
                fps,
                config: { damping: 20, stiffness: 140 },
              });
              const hue = (i * 18 + 220) % 360;
              return (
                <div
                  key={i}
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue}, 38%, 28%) 0%, hsl(${hue}, 32%, 18%) 100%)`,
                    borderRadius: 4,
                    transform: `scale(${progress})`,
                    opacity: progress,
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              marginTop: 24,
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
              borderRadius: 10,
              color: '#fff',
              fontSize: 18,
              fontWeight: 600,
              transform: `scale(${springIn(s7.localFrame, 60)})`,
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
            }}
          >
            Download ZIP
          </div>
        </div>
      )}

      {/* ---------- OUTRO ---------- */}
      {outro.isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: outro.progress,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              transform: `scale(${springIn(outro.localFrame)})`,
              textShadow: '0 4px 40px rgba(0,0,0,0.5)',
            }}
          >
            Finished
          </span>
          <p
            style={{
              marginTop: 20,
              fontSize: 22,
              color: 'rgba(255,255,255,0.6)',
              transform: `scale(${springIn(outro.localFrame, 8)})`,
            }}
          >
            Try it at spritesmithy.com
          </p>
        </div>
      )}

      {/* Step indicator (visible during steps) */}
      {(s1.isActive || s2.isActive || s3.isActive || s4.isActive || s5.isActive || s6.isActive || s7.isActive) && (() => {
        const steps = [SCENES.step1, SCENES.step2, SCENES.step3, SCENES.step4, SCENES.step5, SCENES.step6, SCENES.step7];
        const currentStep = steps.findIndex(
          (s) => frame >= s.start * FPS && frame < (s.start + s.duration) * FPS
        );
        const stepNum = currentStep >= 0 ? currentStep + 1 : 1;
        return (
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '8px 20px',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: 999,
              fontSize: 15,
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
            }}
          >
            Step {stepNum} of 7 · {STEP_TITLES[stepNum - 1]}
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
