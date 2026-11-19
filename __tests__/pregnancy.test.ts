import { DAY, dueFromLastPeriod, milestoneFor, pregnancyWeek, sizeFor, toIso, trimester } from '@/data/pregnancy';

const NOW = new Date(2026, 10, 19, 12).getTime();

describe('pregnancy maths', () => {
  it('due date is 280 days after the last period', () => {
    expect(dueFromLastPeriod('2026-01-01')).toBe('2026-10-08');
    expect(dueFromLastPeriod('not a date')).toBeNull();
  });

  it('works out the week and days to go', () => {
    const due = toIso(NOW + 100 * DAY); // 180 days pregnant
    const w = pregnancyWeek(due, NOW)!;
    expect(w.week).toBe(26);
    expect(w.day).toBe(5);
    expect(w.daysToGo).toBe(100);
    expect(w.progress).toBeCloseTo(180 / 280, 2);
  });

  it('rejects dates that make no sense', () => {
    expect(pregnancyWeek('2030-01-01', NOW)).toBeNull(); // more than 40 weeks away
    expect(pregnancyWeek('2025-01-01', NOW)).toBeNull(); // long past
    expect(pregnancyWeek('19/11/2026', NOW)).toBeNull();
  });

  it('trimesters, sizes and milestones line up', () => {
    expect([trimester(13), trimester(14), trimester(27), trimester(28)]).toEqual([1, 2, 2, 3]);
    expect(sizeFor(2)).toBe('a poppy seed');
    expect(sizeFor(20)).toBe('a banana');
    expect(sizeFor(41)).toBe('a watermelon');
    for (let w = 1; w <= 42; w++) expect(milestoneFor(w)).toBeTruthy();
    expect(milestoneFor(30).from).toBe(28);
  });
});
