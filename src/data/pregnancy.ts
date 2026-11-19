/**
 * Pregnancy helpers and general (non-medical) content.
 * Review all wording with a midwife or clinician before release.
 */
export const DAY = 86_400_000;
export const FULL_TERM_DAYS = 280;

const parse = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return NaN;
  return Date.parse(`${iso}T00:00:00`);
};
export const toIso = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Naegele's rule: due date is 280 days after the first day of the last period. */
export function dueFromLastPeriod(lmp: string) {
  const t = parse(lmp);
  return Number.isNaN(t) ? null : toIso(t + FULL_TERM_DAYS * DAY);
}

/** Week of pregnancy (1–42) from an estimated due date (40 weeks), or null if the date makes no sense. */
export function pregnancyWeek(dueDate: string, now: number) {
  const due = parse(dueDate);
  if (Number.isNaN(due)) return null;
  const daysToGo = Math.ceil((due - now) / DAY);
  const daysPregnant = FULL_TERM_DAYS - daysToGo;
  if (daysPregnant < 0 || daysPregnant > 44 * 7) return null;
  const week = Math.floor(daysPregnant / 7) + 1;
  return {
    week: Math.min(Math.max(week, 1), 42),
    day: ((daysPregnant % 7) + 7) % 7,
    daysToGo: Math.max(0, daysToGo),
    /** 0–1 through a 40-week pregnancy. */
    progress: Math.min(1, Math.max(0, daysPregnant / FULL_TERM_DAYS)),
  };
}

export type Trimester = 1 | 2 | 3;
export const trimester = (week: number): Trimester => (week <= 13 ? 1 : week <= 27 ? 2 : 3);

/** Commonly used fruit and vegetable size comparisons by week. */
export const sizeByWeek: Record<number, string> = {
  4: 'a poppy seed', 5: 'a sesame seed', 6: 'a lentil', 7: 'a blueberry', 8: 'a raspberry', 9: 'a cherry', 10: 'a strawberry',
  11: 'a fig', 12: 'a lime', 13: 'a lemon', 14: 'a nectarine', 15: 'an apple', 16: 'an avocado', 17: 'a pear', 18: 'a bell pepper',
  19: 'a mango', 20: 'a banana', 21: 'a carrot', 22: 'a pawpaw', 23: 'a grapefruit', 24: 'an ear of corn', 25: 'a cauliflower',
  26: 'a lettuce', 27: 'a cabbage', 28: 'an aubergine', 29: 'a butternut squash', 30: 'a large cucumber', 31: 'a coconut',
  32: 'a squash', 33: 'a pineapple', 34: 'a cantaloupe', 35: 'a honeydew melon', 36: 'a big pawpaw', 37: 'a bunch of plantain',
  38: 'a pumpkin', 39: 'a small watermelon', 40: 'a watermelon',
};
export const sizeFor = (week: number) => sizeByWeek[Math.min(Math.max(week, 4), 40)];

/** What's generally happening, in a few words, for each stretch of weeks. */
export const milestones: { from: number; to: number; baby: string; you: string }[] = [
  { from: 1, to: 4, baby: 'The fertilised egg settles into the womb.', you: 'You may not feel anything yet. A missed period is often the first sign.' },
  { from: 5, to: 8, baby: 'The heart starts beating and tiny limbs begin to form.', you: 'Tiredness, nausea and tender breasts are common.' },
  { from: 9, to: 13, baby: 'All the major organs are forming. Baby can make small movements.', you: 'Nausea often eases towards the end of this trimester.' },
  { from: 14, to: 17, baby: 'Baby can make faces and starts to hear sounds.', you: 'Many people feel more energy now.' },
  { from: 18, to: 22, baby: 'Baby is moving a lot. You may feel the first flutters.', you: 'Your bump is showing. The anatomy scan usually happens around now.' },
  { from: 23, to: 27, baby: 'Baby practises breathing movements and responds to your voice.', you: 'Back ache and swollen ankles are common. Rest with your feet up.' },
  { from: 28, to: 32, baby: 'Baby opens their eyes and puts on weight fast.', you: 'Start learning your baby’s movement pattern. Count kicks daily.' },
  { from: 33, to: 36, baby: 'Lungs are maturing. Baby usually turns head-down.', you: 'Pack your hospital bag and plan your journey to the facility.' },
  { from: 37, to: 42, baby: 'Baby is ready to be born any day now.', you: 'Know the signs of labour, and keep your health worker’s number handy.' },
];
export const milestoneFor = (week: number) => milestones.find((m) => week >= m.from && week <= m.to) ?? milestones[milestones.length - 1];

export const dangerSigns = [
  'Vaginal bleeding',
  'Severe headache or blurred vision',
  'Swelling of the face or hands',
  'Fever or chills',
  'Severe pain in the belly',
  'Fluid leaking before 37 weeks',
  'Baby moving less than usual',
  'Fits or convulsions',
];

export const checklist: { trimester: Trimester; items: string[] }[] = [
  { trimester: 1, items: ['First antenatal (ANC) visit', 'Blood tests and screening', 'Ask about folic acid', 'Dating scan'] },
  { trimester: 2, items: ['Anatomy scan (around 20 weeks)', 'Tetanus vaccine as advised', 'Ask about iron and calcium', 'Start a birth plan with your health worker'] },
  { trimester: 3, items: ['Hospital bag packed', 'Transport to the facility arranged', 'Baby clothes and wrappers ready', 'Emergency contacts saved'] },
];
export const allChecklistItems = checklist.flatMap((g) => g.items);
