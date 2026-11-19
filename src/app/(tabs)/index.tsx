import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Ring } from '@/components/ring';
import { Card, H1, Icon, ListItem, Row, Screen, SectionTitle, Small } from '@/components/ui';
import { allChecklistItems, milestoneFor, pregnancyWeek, sizeFor, toIso, trimester } from '@/data/pregnancy';
import { upcoming, useAppointments, useChecks, useProfile } from '@/data/store';
import { space, usePalette } from '@/theme';

export default function Today() {
  const c = usePalette();
  const [profile] = useProfile();
  const [checks] = useChecks();
  const [appointments] = useAppointments();
  const [now] = useState(() => Date.now());
  const info = profile ? pregnancyWeek(profile.due, now) : null;
  if (!profile || !info) return null;

  const m = milestoneFor(info.week);
  const next = upcoming(appointments, toIso(now))[0];
  const done = allChecklistItems.filter((i) => checks[i]).length;
  const hour = new Date(now).getHours();

  return (
    <Screen edges={['top', 'left', 'right']}>
      <View style={{ gap: 2 }}>
        <Small>{hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'}</Small>
        <H1 style={{ fontSize: 26 }}>{profile.name ? `Hi, ${profile.name}` : 'Hi there'}</H1>
      </View>

      <Card style={{ alignItems: 'center', paddingVertical: space.lg, gap: space.md }}>
        <Ring progress={info.progress} color={c.primary} track={c.primarySoft}>
          <Text style={{ color: c.muted, fontWeight: '700', fontSize: 13, letterSpacing: 1 }}>WEEK</Text>
          <Text style={{ color: c.text, fontSize: 64, fontWeight: '800', lineHeight: 70 }}>{info.week}</Text>
          <Text style={{ color: c.muted, fontSize: 13 }}>Trimester {trimester(info.week)}</Text>
        </Ring>
        <Text style={{ color: c.text, fontSize: 18, fontWeight: '700', textAlign: 'center' }}>Baby is about the size of {sizeFor(info.week)}</Text>
        <Row style={{ gap: 6 }}>
          <Icon name="hourglass-outline" size={16} color={c.sage} />
          <Small>{info.daysToGo === 0 ? 'Your due date is today' : `${info.daysToGo} days to go`}</Small>
        </Row>
      </Card>

      <SectionTitle>This week</SectionTitle>
      <Row style={{ gap: space.sm, alignItems: 'stretch' }}>
        <Card style={{ flex: 1, backgroundColor: c.primarySoft, borderColor: c.primarySoft }}>
          <Icon name="happy-outline" size={22} color={c.primary} />
          <Text style={{ color: c.text, fontWeight: '800' }}>Baby</Text>
          <Small>{m.baby}</Small>
        </Card>
        <Card style={{ flex: 1, backgroundColor: c.sageSoft, borderColor: c.sageSoft }}>
          <Icon name="flower-outline" size={22} color={c.success} />
          <Text style={{ color: c.text, fontWeight: '800' }}>You</Text>
          <Small>{m.you}</Small>
        </Card>
      </Row>

      <SectionTitle>Quick actions</SectionTitle>
      <ListItem
        title="Kick counter"
        subtitle={info.week >= 28 ? 'Count 10 movements' : 'Most useful from week 28'}
        leading={<Icon name="pulse-outline" size={24} color={c.primary} />}
        onPress={() => router.push('/kicks')}
      />
      <ListItem
        title={next ? next.title : 'Add an appointment'}
        subtitle={next ? `${new Date(`${next.date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${next.time}${next.place ? ` · ${next.place}` : ''}` : 'Antenatal visits, scans and tests'}
        leading={<Icon name="calendar-outline" size={24} color={c.primary} />}
        onPress={() => router.push(next ? '/(tabs)/care' : '/appointment')}
      />
      <ListItem
        title="Checklist"
        subtitle={`${done} of ${allChecklistItems.length} done`}
        leading={<Icon name="checkbox-outline" size={24} color={c.primary} />}
        onPress={() => router.push('/(tabs)/checklist')}
      />
    </Screen>
  );
}
