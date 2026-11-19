import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Body, Button, Card, Field, H1, Screen, Segmented, Small } from '@/components/ui';
import { dueFromLastPeriod, pregnancyWeek, sizeFor } from '@/data/pregnancy';
import { useProfile } from '@/data/store';
import { usePalette } from '@/theme';

/** Name and due date. Also used later from Care → Change due date. */
export default function Setup() {
  const c = usePalette();
  const [profile, setProfile] = useProfile();
  const [name, setName] = useState(profile?.name ?? '');
  const [mode, setMode] = useState<'due' | 'lmp'>('due');
  const [date, setDate] = useState(profile?.due ?? '');
  const [now] = useState(() => Date.now());

  const due = mode === 'due' ? date : dueFromLastPeriod(date) ?? '';
  const info = due ? pregnancyWeek(due, now) : null;

  const save = () => {
    setProfile({ name: name.trim(), due });
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <H1 style={{ fontSize: 28 }}>{profile ? 'Update your dates' : 'Let’s set up CribNest'}</H1>
      <Body muted>Everything stays on your phone.</Body>
      <Field label="Your first name (optional)" value={name} onChangeText={setName} placeholder="e.g. Ada" autoComplete="given-name" />
      <View style={{ gap: 8 }}>
        <Segmented
          value={mode}
          onChange={(m) => {
            setMode(m);
            setDate('');
          }}
          options={[
            { value: 'due', label: 'I know my due date' },
            { value: 'lmp', label: 'Last period' },
          ]}
        />
        <Field
          label={mode === 'due' ? 'Due date' : 'First day of your last period'}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          error={date.length >= 10 && !info ? 'That date doesn’t look right. Use YYYY-MM-DD.' : undefined}
        />
      </View>
      {info ? (
        <Card style={{ backgroundColor: c.primarySoft, borderColor: c.primarySoft }}>
          <Body style={{ fontWeight: '700' }}>
            You&apos;re {info.week} weeks{info.day ? ` and ${info.day} day${info.day === 1 ? '' : 's'}` : ''} along.
          </Body>
          <Small>
            {mode === 'lmp' ? `Estimated due date: ${new Date(`${due}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. ` : ''}
            Baby is about the size of {sizeFor(info.week)}.
          </Small>
        </Card>
      ) : null}
      <Button big title={profile ? 'Save' : 'Start'} icon="checkmark" disabled={!info} onPress={save} />
      <Small>Your midwife or doctor will confirm your dates at your scan. You can change them any time.</Small>
    </Screen>
  );
}
