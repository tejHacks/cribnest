import { Redirect, Tabs } from 'expo-router';

import { tabIcon, tabOptions } from '@/components/tabs';
import { useProfile } from '@/data/store';
import { usePalette } from '@/theme';

export default function TabsLayout() {
  const c = usePalette();
  const [profile, , ready] = useProfile();
  if (!ready) return null;
  if (!profile) return <Redirect href="/" />;
  return (
    <Tabs screenOptions={tabOptions(c)}>
      <Tabs.Screen name="index" options={{ title: 'Today', headerShown: false, tabBarIcon: tabIcon('sunny') }} />
      <Tabs.Screen name="journey" options={{ title: 'Your journey', tabBarLabel: 'Journey', tabBarIcon: tabIcon('trail-sign') }} />
      <Tabs.Screen name="checklist" options={{ title: 'Checklist', tabBarIcon: tabIcon('checkbox') }} />
      <Tabs.Screen name="care" options={{ title: 'Care', tabBarIcon: tabIcon('medkit') }} />
    </Tabs>
  );
}
