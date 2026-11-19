import { Redirect } from 'expo-router';

import { useOnboarded, useProfile } from '@/data/store';

export default function Gate() {
  const [onboarded, , a] = useOnboarded();
  const [profile, , b] = useProfile();
  if (!a || !b) return null;
  if (!onboarded) return <Redirect href="/onboarding" />;
  if (!profile) return <Redirect href="/setup" />;
  return <Redirect href="/(tabs)" />;
}
