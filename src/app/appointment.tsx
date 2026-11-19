import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Field, Label, Pill, Row, Screen } from '@/components/ui';
import { toIso } from '@/data/pregnancy';
import { uid, useAppointments } from '@/data/store';

const TITLES = ['Antenatal visit', 'Ultrasound scan', 'Blood test', 'Vaccination'];
const TIMES = ['08:00', '09:00', '10:00', '11:00', '13:00', '15:00'];

export default function NewAppointment() {
  const [, setAppointments] = useAppointments();
  const [days] = useState(() => Array.from({ length: 21 }, (_, i) => Date.now() + i * 86_400_000));
  const [title, setTitle] = useState(TITLES[0]);
  const [date, setDate] = useState(() => toIso(days[1]));
  const [time, setTime] = useState('09:00');
  const [place, setPlace] = useState('');

  const save = () => {
    setAppointments((l) => [...l, { id: uid(), title: title.trim(), date, time, place: place.trim(), done: false }]);
    router.back();
  };

  return (
    <Screen>
      <View style={{ gap: 6 }}>
        <Label>What</Label>
        <Row style={{ flexWrap: 'wrap' }}>
          {TITLES.map((t) => (
            <Pill key={t} active={title === t} onPress={() => setTitle(t)}>{t}</Pill>
          ))}
        </Row>
      </View>
      <Field label="Or type it" value={title} onChangeText={setTitle} />
      <View style={{ gap: 6 }}>
        <Label>Day</Label>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {days.map((d, i) => (
            <Pill key={d} active={date === toIso(d)} onPress={() => setDate(toIso(d))}>
              {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </Pill>
          ))}
        </ScrollView>
      </View>
      <View style={{ gap: 6 }}>
        <Label>Time</Label>
        <Row style={{ flexWrap: 'wrap' }}>
          {TIMES.map((t) => (
            <Pill key={t} active={time === t} onPress={() => setTime(t)}>{t}</Pill>
          ))}
        </Row>
      </View>
      <Field label="Where (optional)" value={place} onChangeText={setPlace} placeholder="e.g. Adeoyo Maternity, Ibadan" />
      <Button big title="Save appointment" icon="checkmark" disabled={!title.trim()} onPress={save} />
    </Screen>
  );
}
