import { useStoredState } from '@/lib/storage';

export interface Profile {
  name: string;
  due: string; // YYYY-MM-DD
}
export interface KickSession {
  id: string;
  startedAt: number;
  minutes: number;
}
export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  title: string;
  place: string;
  done: boolean;
}

export const useOnboarded = () => useStoredState<boolean>('onboarded', false);
export const useProfile = () => useStoredState<Profile | null>('profile', null);
export const useChecks = () => useStoredState<Record<string, boolean>>('checklist', {});
export const useKicks = () => useStoredState<KickSession[]>('kick-sessions', []);
export const useAppointments = () => useStoredState<Appointment[]>('appointments', []);

export const upcoming = (list: Appointment[], today: string) => list.filter((a) => !a.done && a.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
export { uid } from '@/lib/storage';
