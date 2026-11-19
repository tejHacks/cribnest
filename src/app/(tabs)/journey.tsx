import { useState } from 'react';
import { Text, View } from 'react-native';

import { Badge, Card, Row, Screen, Small } from '@/components/ui';
import { milestones, pregnancyWeek, sizeFor } from '@/data/pregnancy';
import { useProfile } from '@/data/store';
import { usePalette } from '@/theme';

export default function Journey() {
  const c = usePalette();
  const [profile] = useProfile();
  const [now] = useState(() => Date.now());
  const week = profile ? pregnancyWeek(profile.due, now)?.week ?? 1 : 1;
  return (
    <Screen>
      {milestones.map((m) => {
        const current = week >= m.from && week <= m.to;
        const past = week > m.to;
        return (
          <Row key={m.from} style={{ alignItems: 'stretch', gap: 14 }}>
            <View style={{ alignItems: 'center', width: 18 }}>
              <View style={{ width: 14, height: 14, borderRadius: 7, marginTop: 20, backgroundColor: current ? c.primary : past ? c.sage : c.chip, borderWidth: current ? 3 : 0, borderColor: c.primarySoft }} />
              <View style={{ flex: 1, width: 2, backgroundColor: c.border }} />
            </View>
            <Card style={{ flex: 1, opacity: past ? 0.7 : 1, borderColor: current ? c.primary : c.border }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: c.text, fontWeight: '800', fontSize: 16 }}>Weeks {m.from}–{m.to}</Text>
                {current ? <Badge tone="info">You are here</Badge> : past ? <Badge tone="ok" icon="checkmark">Done</Badge> : null}
              </Row>
              <Small>Baby: {m.baby}</Small>
              <Small>You: {m.you}</Small>
              {m.to >= 4 ? <Small style={{ color: c.primary }}>Size by week {Math.min(m.to, 40)}: {sizeFor(m.to)}</Small> : null}
            </Card>
          </Row>
        );
      })}
    </Screen>
  );
}
