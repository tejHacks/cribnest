import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, Button, Card, Field, H1, H2, Label, Screen } from '@/components/ui';
import { dangerSigns, defaultChecklist, pregnancyWeek, sizeFor, trimester, trimesterTips } from '@/data/pregnancy';
import { useStoredState } from '@/lib/storage';
import { usePalette } from '@/theme';

export default function Home() {
  const c = usePalette();
  const [due, setDue, ready] = useStoredState('due-date', '');
  const [checks, setChecks] = useStoredState<Record<string, boolean>>('checklist', {});
  const [editing, setEditing] = useState(false);
  const [now] = useState(() => Date.now());

  if (!ready) return <Screen>{null}</Screen>;
  const info = due ? pregnancyWeek(due, now) : null;
  if (!info || editing) return <DueDateForm initial={due} onSave={(d) => { setDue(d); setEditing(false); }} />;

  const tri = trimester(info.week);

  return (
    <Screen>
      <View style={[styles.hero, { backgroundColor: c.primary }]}>
        <Text style={styles.heroKicker}>Week {info.week} · Trimester {tri}</Text>
        <Text style={styles.heroTitle}>Baby is about the size of {sizeFor(info.week)}.</Text>
        <Text style={styles.heroSub}>{info.daysToGo} days to go</Text>
      </View>

      <Card>
        <Label>This trimester</Label>
        {trimesterTips[tri].map((t) => (
          <Body key={t}>• {t}</Body>
        ))}
      </Card>

      {info.week >= 28 ? <Button title="Count baby's kicks" onPress={() => router.push('/kicks')} /> : null}

      <Card>
        <Label>Checklist</Label>
        {defaultChecklist.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: !!checks[item] }}
            onPress={() => setChecks((s) => ({ ...s, [item]: !s[item] }))}
            style={styles.check}>
            <View style={[styles.box, { borderColor: c.primary, backgroundColor: checks[item] ? c.primary : 'transparent' }]}>
              {checks[item] ? <Text style={{ color: '#fff', fontWeight: '800' }}>✓</Text> : null}
            </View>
            <Text style={{ color: c.text, fontSize: 16, flex: 1 }}>{item}</Text>
          </Pressable>
        ))}
      </Card>

      <Card style={{ borderColor: c.danger }}>
        <Label style={{ color: c.danger }}>Go to a health facility now if you have</Label>
        {dangerSigns.map((s) => (
          <Body key={s}>• {s}</Body>
        ))}
      </Card>

      <Button title="Change due date" variant="secondary" onPress={() => setEditing(true)} />
      <Body muted style={{ fontSize: 13 }}>CribNest offers general information and is not a substitute for care from your midwife or doctor.</Body>
    </Screen>
  );
}

function DueDateForm({ initial, onSave }: { initial: string; onSave: (d: string) => void }) {
  const [value, setValue] = useState(initial);
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
  return (
    <Screen>
      <H1>Welcome to CribNest</H1>
      <Body muted>A calm companion for your pregnancy. Everything stays on your phone.</Body>
      <H2>When is your baby due?</H2>
      <Field label="Due date (YYYY-MM-DD)" value={value} onChangeText={setValue} placeholder="2027-05-14" keyboardType="numbers-and-punctuation" />
      <Button title="Continue" disabled={!valid} onPress={() => onSave(value)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 28, padding: 24, gap: 6 },
  heroKicker: { color: '#FCE7F3', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', fontSize: 12 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  heroSub: { color: '#FCE7F3', fontSize: 16 },
  check: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  box: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
