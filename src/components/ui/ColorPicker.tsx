'use client';

import { useState, useRef, useEffect } from 'react';
import { RGB } from '@/types/processing';
import { rgbToHex, hexToRgb, COMMON_CHROMA_COLORS } from '@/utils/color';

interface ColorPickerProps {
  color: RGB;
  onChange: (color: RGB) => void;
  label?: string;
  showPresets?: boolean;
}

export default function ColorPicker({
  color,
  onChange,
  label = 'Color',
  showPresets = true,
}: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(rgbToHex(color));
  const inputRef = useRef<HTMLInputElement>(null);

  // Update hex when RGB changes externally
  useEffect(() => {
    setHexValue(rgbToHex(color));
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHexValue(hex);

    const rgb = hexToRgb(hex);
    if (rgb) {
      onChange(rgb);
    }
  };

  const handlePresetClick = (presetColor: RGB) => {
    onChange(presetColor);
    setHexValue(rgbToHex(presetColor));
  };

  const handlePickerClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {/* Color Display & Picker */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePickerClick}
          className="w-16 h-16 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer overflow-hidden"
          style={{ backgroundColor: hexValue }}
          title="Click to pick color"
        >
          <input
            ref={inputRef}
            type="color"
            value={hexValue}
            onChange={handleColorChange}
            className="sr-only"
          />
        </button>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={hexValue.toUpperCase()}
              onChange={(e) => {
                setHexValue(e.target.value);
                const rgb = hexToRgb(e.target.value);
                if (rgb) onChange(rgb);
              }}
              className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm font-mono"
              placeholder="#00FF00"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">R:</span>
              <span className="ml-1 font-medium">{color.r}</span>
            </div>
            <div>
              <span className="text-muted-foreground">G:</span>
              <span className="ml-1 font-medium">{color.g}</span>
            </div>
            <div>
              <span className="text-muted-foreground">B:</span>
              <span className="ml-1 font-medium">{color.b}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Presets */}
      {showPresets && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Common Chroma Colors:
          </p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handlePresetClick(COMMON_CHROMA_COLORS.green)}
              className="aspect-square rounded border-2 border-border hover:border-primary transition-colors"
              style={{ backgroundColor: rgbToHex(COMMON_CHROMA_COLORS.green) }}
              title="Green Screen"
            />
            <button
              onClick={() => handlePresetClick(COMMON_CHROMA_COLORS.blue)}
              className="aspect-square rounded border-2 border-border hover:border-primary transition-colors"
              style={{ backgroundColor: rgbToHex(COMMON_CHROMA_COLORS.blue) }}
              title="Blue Screen"
            />
            <button
              onClick={() => handlePresetClick(COMMON_CHROMA_COLORS.white)}
              className="aspect-square rounded border-2 border-border hover:border-primary transition-colors"
              style={{ backgroundColor: rgbToHex(COMMON_CHROMA_COLORS.white) }}
              title="White"
            />
            <button
              onClick={() => handlePresetClick(COMMON_CHROMA_COLORS.black)}
              className="aspect-square rounded border-2 border-border hover:border-primary transition-colors"
              style={{ backgroundColor: rgbToHex(COMMON_CHROMA_COLORS.black) }}
              title="Black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
