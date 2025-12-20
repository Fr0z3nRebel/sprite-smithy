'use client';

import { useEffect, useRef } from 'react';

export type BackgroundType = 'checkerboard' | 'dark' | 'light';

interface CanvasPreviewProps {
  imageData: ImageData | null;
  width?: number;
  height?: number;
  showGrid?: boolean;
  backgroundColor?: BackgroundType;
  label?: string;
}

export default function CanvasPreview({
  imageData,
  width = 256,
  height = 256,
  showGrid = true,
  backgroundColor = 'checkerboard',
  label,
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background based on type
    if (showGrid || backgroundColor !== 'checkerboard') {
      drawBackground(ctx, width, height, backgroundColor);
    }

    // Calculate scaling to fit imageData in canvas while preserving aspect ratio
    const scale = Math.min(
      width / imageData.width,
      height / imageData.height
    );

    const scaledWidth = imageData.width * scale;
    const scaledHeight = imageData.height * scale;

    // Center the image
    const x = (width - scaledWidth) / 2;
    const y = (height - scaledHeight) / 2;

    // Create temporary canvas for the imageData
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.putImageData(imageData, 0, 0);

    // Draw scaled image
    ctx.drawImage(tempCanvas, x, y, scaledWidth, scaledHeight);
  }, [imageData, width, height, showGrid, backgroundColor]);

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full border border-border rounded-lg bg-muted"
          style={{ imageRendering: 'pixelated' }}
        />
        {!imageData && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Draw background based on type
 */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  type: BackgroundType
) {
  if (type === 'dark') {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
  } else if (type === 'light') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else {
    // Checkerboard
    const squareSize = 16;
    const lightColor = '#ffffff';
    const darkColor = '#e0e0e0';

    for (let y = 0; y < height; y += squareSize) {
      for (let x = 0; x < width; x += squareSize) {
        const isLight = ((x / squareSize) % 2 === 0) !== ((y / squareSize) % 2 === 0);
        ctx.fillStyle = isLight ? lightColor : darkColor;
        ctx.fillRect(x, y, squareSize, squareSize);
      }
    }
  }
}
