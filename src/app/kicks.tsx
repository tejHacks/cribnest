import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Body, Button, Card, Label, Screen } from '@/components/ui';
import { uid, useStoredState } from '@/lib/storage';
import { usePalette } from '@/theme';

const GOAL = 10;

interface KickSession {
  id: string;
  startedAt: number;
  minutes: number;
}

/** Tap for each movement; most babies reach 10 within 2 hours. */
export default function Kicks() {
  const c = usePalette();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [now, setNow] = useState(0);
  const [history, setHistory] = useStoredState<KickSession[]>('kick-sessions', []);

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
      return;
    }
    const next = count + 1;
    setCount(next);
    if (next >= GOAL) {
      setHistory((h) => [{ id: uid(), startedAt, minutes: Math.max(1, Math.round((Date.now() - startedAt) / 60000)) }, ...h].slice(0, 30));
      setStartedAt(null);
    }
  };

  return (
    <Screen>
      <Pressable onPress={tap} accessibilityRole="button" accessibilityLabel="Record a movement" style={[styles.big, { backgroundColor: c.primary }]}>
        <Text style={styles.count}>{startedAt ? count : count >= GOAL ? '✓' : 0}</Text>
        <Text style={styles.sub}>{startedAt ? `of ${GOAL} · ${minutes} min` : count >= GOAL ? 'Done — well done!' : 'Tap for each movement'}</Text>
      </Pressable>

      {startedAt ? <Button title="Cancel" variant="secondary" onPress={() => { setStartedAt(null); setCount(0); }} /> : null}

      <Body muted>Count when your baby is usually active. If you don&apos;t feel {GOAL} movements in 2 hours, or movements feel weaker than usual, contact your health facility.</Body>

      {history.length ? (
        <Card>
          <Label>Recent sessions</Label>
          {history.slice(0, 7).map((s) => (
            <Body key={s.id}>
              {new Date(s.startedAt).toLocaleDateString()} — {GOAL} movements in {s.minutes} min
            </Body>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  big: { height: 260, borderRadius: 130, alignItems: 'center', justifyContent: 'center', marginHorizontal: 24 },
  count: { color: '#fff', fontSize: 80, fontWeight: '800' },
  sub: { color: '#FCE7F3', fontSize: 16, fontWeight: '600' },
});
