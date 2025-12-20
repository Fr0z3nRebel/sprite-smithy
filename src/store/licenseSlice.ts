import { StateCreator } from 'zustand';
import { LicenseState } from '@/types/license';

export interface LicenseSlice {
  license: LicenseState;
  setLicense: (key: string, isValid: boolean) => void;
  clearLicense: () => void;
}

const initialLicenseState: LicenseState = {
  key: null,
  isValid: false,
  tier: 'free',
};

export const createLicenseSlice: StateCreator<LicenseSlice> = (set) => ({
  license: initialLicenseState,

  setLicense: (key, isValid) =>
    set({
      license: {
        key,
        isValid,
        tier: isValid ? 'paid' : 'free',
      },
    }),

  clearLicense: () =>
    set({
      license: initialLicenseState,
    }),
});
