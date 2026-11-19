/**
 * CribNest's look: soft and calm. Dusty rose for warmth, sage for reassurance,
 * on warm cream. Nothing loud.
 */
import { useColorScheme } from 'react-native';

import { brand } from './brand';

const palettes = {
  light: {
    bg: '#FBF7F3',
    card: '#FFFFFF',
    chip: '#F3ECE6',
    border: '#EDE4DC',
    text: '#2B2024',
    muted: '#6B5B60',
    subtle: '#A3959A',
    primarySoft: '#F6E4E8',
    sage: '#7FA38A',
    sageSoft: '#E5EFE8',
    danger: '#C2410C',
    dangerBg: '#FDEBDD',
    warn: '#B45309',
    warnBg: '#FEF3C7',
    success: '#4E7D5E',
    successBg: '#E5EFE8',
  },
  dark: {
    bg: '#161214',
    card: '#1F1A1C',
    chip: '#2A2326',
    border: '#332A2E',
    text: '#F6EEF0',
    muted: '#C2B3B8',
    subtle: '#8A7C81',
    primarySoft: '#3A2229',
    sage: '#9CC3A7',
    sageSoft: '#1E2D23',
    danger: '#FB923C',
    dangerBg: '#3A1F0F',
    warn: '#FBBF24',
    warnBg: '#3A2C08',
    success: '#9CC3A7',
    successBg: '#1E2D23',
  },
} as const;

export type Palette = Record<keyof (typeof palettes)['light'], string> & { primary: string; primaryText: string; accent: string };

export function usePalette(): Palette {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { ...palettes[scheme], ...brand.colors, ...(scheme === 'dark' ? { primary: '#E58FA3', primaryText: '#2B1219' } : null) };
}

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
