import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import { DAY, toIso } from '@/data/pregnancy';
import { resetStoredStateCache } from '@/lib/storage';

const APP = './src/app';
async function open(url: string) {
  await renderRouter(APP, { initialUrl: url });
  jest.useRealTimers();
}
const seed = async (daysPregnant: number) =>
  AsyncStorage.multiSet([
    ['onboarded', 'true'],
    ['profile', JSON.stringify({ name: 'Ada', due: toIso(Date.now() + (280 - daysPregnant) * DAY) })],
  ]);

beforeEach(async () => {
  await AsyncStorage.clear();
  resetStoredStateCache();
});

it('onboarding, then setup from the last period, lands on Today', async () => {
  await open('/');
  expect(await screen.findByText('A calm companion for your pregnancy')).toBeOnTheScreen();
  await fireEvent.press(screen.getByText('Skip'));
  await fireEvent.changeText(await screen.findByLabelText('Your first name (optional)'), 'Ada');
  await fireEvent.press(screen.getByText('Last period'));
  await fireEvent.changeText(screen.getByLabelText('First day of your last period'), toIso(Date.now() - 140 * DAY));
  expect(await screen.findByText(/You're 21 weeks/)).toBeOnTheScreen();
  await fireEvent.press(screen.getByText('Start'));
  expect(await screen.findByText('Hi, Ada')).toBeOnTheScreen();
  expect(screen.getByText('Baby is about the size of a carrot')).toBeOnTheScreen();
});

it('the checklist ticks items and shows progress', async () => {
  await seed(100);
  await open('/(tabs)/checklist');
  expect(await screen.findByText('0 of 12 done')).toBeOnTheScreen();
  await fireEvent.press(screen.getByLabelText('First antenatal (ANC) visit'));
  expect(await screen.findByText('1 of 12 done')).toBeOnTheScreen();
});

it('adds an appointment and shows it under Care', async () => {
  await seed(150);
  await open('/appointment');
  await fireEvent.press(await screen.findByText('Ultrasound scan'));
  await fireEvent.changeText(screen.getByLabelText('Where (optional)'), 'Adeoyo Maternity');
  await fireEvent.press(screen.getByText('Save appointment'));
  await open('/(tabs)/care');
  expect(await screen.findByText('Ultrasound scan')).toBeOnTheScreen();
  expect(screen.getByText(/Adeoyo Maternity/)).toBeOnTheScreen();
});

it('the kick counter records a full session of 10', async () => {
  await seed(210);
  await open('/kicks');
  const button = await screen.findByLabelText('Record a movement');
  for (let i = 0; i < 10; i++) await fireEvent.press(button);
  expect(await screen.findByText(/10 in \d+ min/)).toBeOnTheScreen();
  expect(JSON.parse((await AsyncStorage.getItem('kick-sessions'))!)).toHaveLength(1);
});
