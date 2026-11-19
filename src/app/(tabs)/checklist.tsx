import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card, Icon, Row, Screen, SectionTitle, Small } from '@/components/ui';
import { allChecklistItems, checklist, pregnancyWeek, trimester } from '@/data/pregnancy';
import { useChecks, useProfile } from '@/data/store';
import { radius, usePalette } from '@/theme';

export default function Checklist() {
  const c = usePalette();
  const [profile] = useProfile();
  const [checks, setChecks] = useChecks();
  const [now] = useState(() => Date.now());
  const tri = trimester(profile ? pregnancyWeek(profile.due, now)?.week ?? 1 : 1);
  const done = allChecklistItems.filter((i) => checks[i]).length;
  return (
    <Screen>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={{ color: c.text, fontWeight: '800', fontSize: 18 }}>{done} of {allChecklistItems.length} done</Text>
          <Small>{Math.round((done / allChecklistItems.length) * 100)}%</Small>
        </Row>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: c.chip, overflow: 'hidden' }}>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: c.sage, width: `${(done / allChecklistItems.length) * 100}%` }} />
        </View>
      </Card>
      {checklist.map((g) => (
        <View key={g.trimester} style={{ gap: 8 }}>
          <SectionTitle>{`Trimester ${g.trimester}${g.trimester === tri ? ' · now' : ''}`}</SectionTitle>
          <Card style={{ paddingVertical: 6 }}>
            {g.items.map((item) => {
              const on = !!checks[item];
              return (
                <Pressable key={item} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={item} onPress={() => setChecks((s) => ({ ...s, [item]: !s[item] }))} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
                  <View style={{ width: 26, height: 26, borderRadius: radius.sm - 2, borderWidth: 2, borderColor: on ? c.sage : c.border, backgroundColor: on ? c.sage : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    {on ? <Icon name="checkmark" size={16} color="#fff" /> : null}
                  </View>
                  <Text style={{ color: on ? c.muted : c.text, fontSize: 16, flex: 1, textDecorationLine: on ? 'line-through' : 'none' }}>{item}</Text>
                </Pressable>
              );
            })}
          </Card>
        </View>
      ))}
    </Screen>
  );
}
