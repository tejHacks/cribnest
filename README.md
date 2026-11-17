# CribNest

> A calm companion for pregnant moms.

## What's built

- Due date → **week, trimester, days to go**, and a weekly baby-size comparison
- Trimester tips, antenatal **checklist**, and WHO-style **danger signs**
- **Kick counter** (third trimester) with session history

## Before release

All health wording must be reviewed by a midwife or obstetrician and localised. Add local reminders with expo-notifications.

## Run it

```bash
npm install          # already done once after scaffolding
npx expo start       # then press i (iOS), a (Android) or w (web)
npm run typecheck
npx expo lint
```

Built on **Expo SDK 58** (React Native 0.88, React 19.3), Expo Router, TypeScript.
Everything is stored on-device with AsyncStorage (`src/lib/storage.ts`); there is no backend yet.

## Structure

- `src/app/` — screens (Expo Router; every file is a route)
- `src/brand.ts` — app name, brand colours, screen titles
- `src/theme.ts` — light/dark design tokens
- `src/components/ui.tsx` — shared UI primitives
