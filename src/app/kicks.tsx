import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Ring } from '@/components/ring';
import { Body, Button, Card, ListItem, Screen, SectionTitle, Small, Icon } from '@/components/ui';
import { uid, useKicks } from '@/data/store';
import { space, usePalette } from '@/theme';

const GOAL = 10;

/** Tap for each movement; most babies reach 10 within 2 hours. */
export default function Kicks() {
  const c = usePalette();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [now, setNow] = useState(0);
  const [finished, setFinished] = useState<number | null>(null);
  const [history, setHistory] = useKicks();

  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  const minutes = startedAt ? Math.max(0, Math.floor((now - startedAt) / 60000)) : 0;

  const tap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (!startedAt) {
      const t = Date.now();
      setStartedAt(t);
      setNow(t);
      setCount(1);
      setFinished(null);
      return;
    }
    const next = count + 1;
    setCount(next);
    if (next >= GOAL) {
      const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
      setHistory((h) => [{ id: uid(), startedAt, minutes: mins }, ...h].slice(0, 30));
      setStartedAt(null);
      setFinished(mins);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  };

  return (
    <Screen>
      <View style={{ alignItems: 'center', paddingVertical: space.md }}>
        <Pressable onPress={tap} accessibilityRole="button" accessibilityLabel="Record a movement" style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
          <Ring progress={startedAt ? count / GOAL : finished ? 1 : 0} size={250} stroke={16} color={finished ? c.sage : c.primary} track={c.primarySoft}>
            <View style={{ width: 196, height: 196, borderRadius: 98, backgroundColor: finished ? c.sageSoft : c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              {finished ? (
                <Icon name="checkmark" size={64} color={c.success} />
              ) : (
                <Text style={{ color: c.text, fontSize: 72, fontWeight: '800' }}>{startedAt ? count : 0}</Text>
              )}
              <Text style={{ color: c.muted, fontWeight: '600' }}>{finished ? `${GOAL} in ${finished} min` : startedAt ? `of ${GOAL} · ${minutes} min` : 'Tap for each movement'}</Text>
            </View>
          </Ring>
        </Pressable>
      </View>

      {startedAt ? (
        <Button
          title="Cancel this count"
          variant="secondary"
          onPress={() => {
            setStartedAt(null);
            setCount(0);
          }}
        />
      ) : null}

      <Card>
        <Body muted>
          Count when your baby is usually active, lying on your left side. If you don&apos;t feel {GOAL} movements in 2 hours, or movements feel weaker than usual, contact your health facility today.
        </Body>
      </Card>

      {history.length ? (
        <>
          <SectionTitle>Recent counts</SectionTitle>
          {history.slice(0, 7).map((s) => (
            <ListItem
              key={s.id}
              title={`${GOAL} movements in ${s.minutes} min`}
              subtitle={new Date(s.startedAt).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              leading={<Icon name="pulse-outline" size={22} color={s.minutes > 120 ? c.danger : c.sage} />}
            />
          ))}
          <Small>Longer than 2 hours is shown in orange.</Small>
        </>
      ) : null}
    </Screen>
  );
}
