import { defineBrand } from './lib/brand-type';

export const brand = defineBrand({
  name: 'CribNest',
  colors: { primary: '#C026D3', primaryText: '#FFFFFF', accent: '#F472B6' },
  screens: [
    { name: 'index', title: 'CribNest' },
    { name: 'kicks', title: 'Kick counter' },
  ],
});
