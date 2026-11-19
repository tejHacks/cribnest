import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { Body, Button, H1, Icon, Screen, type IconName } from '@/components/ui';
import { useOnboarded } from '@/data/store';
import { radius, space, usePalette } from '@/theme';

const slides: { icon: IconName; title: string; body: string }[] = [
  { icon: 'heart-outline', title: 'A calm companion for your pregnancy', body: 'See your week, how your baby is growing, and what to expect next, all in one gentle place.' },
  { icon: 'calendar-outline', title: 'Never miss what matters', body: 'Keep your antenatal visits and scans in one list, and tick off what to prepare each trimester.' },
  { icon: 'pulse-outline', title: 'Know your baby’s rhythm', body: 'From week 28, count your baby’s kicks and spot changes early. Danger signs are always one tap away.' },
];

export default function Onboarding() {
  const c = usePalette();
  const { width } = useWindowDimensions();
  const [, setOnboarded] = useOnboarded();
  const [page, setPage] = useState(0);
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const go = (i: number) => {
    scroller.current?.scrollTo({ x: i * width, animated: true });
    setPage(i);
  };
  const done = () => {
    setOnboarded(true);
    router.replace('/setup');
  };
  const last = page === slides.length - 1;

  return (
    <Screen scroll={false} edges={['top', 'bottom']} style={{ paddingHorizontal: 0 }}>
      <View style={{ alignItems: 'flex-end', paddingHorizontal: space.md }}>
        <Pressable accessibilityRole="button" onPress={done} hitSlop={10}>
          <Text style={{ color: c.muted, fontWeight: '700', fontSize: 15 }}>Skip</Text>
        </Pressable>
      </View>
      <ScrollView ref={scroller} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}>
        {slides.map((s) => (
          <View key={s.title} style={{ width, paddingHorizontal: space.lg, justifyContent: 'center', gap: space.lg }}>
            <View style={{ alignSelf: 'center', width: 230, height: 230, borderRadius: 115, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center', shadowColor: c.primary, shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } }}>
                <Icon name={s.icon} size={64} color={c.primary} />
              </View>
              <View style={{ position: 'absolute', left: 28, bottom: 34, width: 34, height: 34, borderRadius: 17, backgroundColor: c.sageSoft }} />
              <View style={{ position: 'absolute', right: 34, top: 30, width: 20, height: 20, borderRadius: 10, backgroundColor: c.sage }} />
            </View>
            <H1 style={{ textAlign: 'center', fontSize: 28 }}>{s.title}</H1>
            <Body muted style={{ textAlign: 'center', fontSize: 17, lineHeight: 25 }}>
              {s.body}
            </Body>
          </View>
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: space.lg, gap: space.md, paddingBottom: space.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          {slides.map((s, i) => (
            <View key={s.title} style={{ width: i === page ? 24 : 8, height: 8, borderRadius: radius.pill, backgroundColor: i === page ? c.primary : c.chip }} />
          ))}
        </View>
        <Button big title={last ? 'Get started' : 'Next'} icon={last ? 'checkmark' : 'arrow-forward'} onPress={() => (last ? done() : go(page + 1))} />
      </View>
    </Screen>
  );
}
