import { defineBrand } from './lib/brand-type';

export const brand = defineBrand({
  name: 'CribNest',
  colors: { primary: '#B4536A', primaryText: '#FFFFFF', accent: '#7FA38A' },
  // Routes are declared in src/app/_layout.tsx.
  screens: [],
});
