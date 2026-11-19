import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';

import { Body, Button, Card, Icon, ListItem, Row, Screen, SectionTitle, Small } from '@/components/ui';
import { dangerSigns, toIso } from '@/data/pregnancy';
import { upcoming, useAppointments } from '@/data/store';
import { usePalette } from '@/theme';

export default function Care() {
  const c = usePalette();
  const [appointments, setAppointments] = useAppointments();
  const [today] = useState(() => toIso(Date.now()));
  const next = upcoming(appointments, today);
  return (
    <Screen>
      <SectionTitle action={<Button title="Add" icon="add" variant="ghost" style={{ minHeight: 32, paddingHorizontal: 8 }} onPress={() => router.push('/appointment')} />}>Appointments</SectionTitle>
      {next.length === 0 ? (
        <Card>
          <Small>No upcoming appointments. Add your next antenatal visit, scan or test so you don&apos;t miss it.</Small>
        </Card>
      ) : (
        next.map((a) => (
          <ListItem
            key={a.id}
            title={a.title}
            subtitle={`${new Date(`${a.date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${a.time}${a.place ? ` · ${a.place}` : ''}`}
            leading={<Icon name="calendar-outline" size={24} color={c.primary} />}
            trailing={<Button title="Done" variant="secondary" style={{ minHeight: 34, paddingHorizontal: 12 }} onPress={() => setAppointments((l) => l.map((x) => (x.id === a.id ? { ...x, done: true } : x)))} />}
          />
        ))
      )}

      <SectionTitle>Danger signs</SectionTitle>
      <Card style={{ borderColor: c.danger, backgroundColor: c.dangerBg }}>
        <Row>
          <Icon name="warning" size={20} color={c.danger} />
          <Body style={{ fontWeight: '800', color: c.danger }}>Go to a health facility now if you have:</Body>
        </Row>
        {dangerSigns.map((s) => (
          <Row key={s} style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.danger, marginTop: 9 }} />
            <Body style={{ flex: 1 }}>{s}</Body>
          </Row>
        ))}
        <Button title="Call 112" icon="call" variant="danger" onPress={() => Linking.openURL('tel:112')} />
      </Card>

      <SectionTitle>Your dates</SectionTitle>
      <ListItem title="Change due date or name" leading={<Icon name="create-outline" size={22} color={c.primary} />} onPress={() => router.push('/setup')} />
      <Small>CribNest offers general information and is not a substitute for care from your midwife or doctor.</Small>
    </Screen>
  );
}
