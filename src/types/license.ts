export type LicenseTier = 'free' | 'paid';

export interface LicenseState {
  key: string | null;
  isValid: boolean;
  tier: LicenseTier;
}
