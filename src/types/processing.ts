export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ChromaKeySettings {
  color: RGB;
  threshold: number;
  feathering: number;
}

export interface SizingSettings {
  targetSize: number;
  paddingReduction: number;
  anchor: 'center-bottom' | 'center' | 'top-left';
}

export interface HaloRemovalSettings {
  strength: number; // 0-5 pixels
}

export interface ProcessingSettings {
  chromaKey: ChromaKeySettings;
  sizing: SizingSettings;
  haloRemoval: HaloRemovalSettings;
}
