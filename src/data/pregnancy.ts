/**
 * Pregnancy helpers and general (non-medical) weekly content.
 * Review all wording with a midwife/clinician before release.
 */
export const DAY = 86_400_000;

/** Week of pregnancy (1–42) from an estimated due date (40 weeks). */
export function pregnancyWeek(dueDate: string, now: number) {
  const due = Date.parse(dueDate);
  if (Number.isNaN(due)) return null;
  const daysPregnant = 280 - Math.ceil((due - now) / DAY);
  const week = Math.floor(daysPregnant / 7) + 1;
  return { week: Math.min(Math.max(week, 1), 42), daysToGo: Math.max(0, Math.ceil((due - now) / DAY)), dayOfWeek: ((daysPregnant % 7) + 7) % 7 };
}

export const trimester = (week: number) => (week <= 13 ? 1 : week <= 27 ? 2 : 3);

/** Commonly used fruit/veg size comparisons by week. */
export const sizeByWeek: Record<number, string> = {
  4: 'a poppy seed', 5: 'a sesame seed', 6: 'a lentil', 7: 'a blueberry', 8: 'a raspberry', 9: 'a cherry', 10: 'a strawberry',
  11: 'a fig', 12: 'a lime', 13: 'a lemon', 14: 'a nectarine', 15: 'an apple', 16: 'an avocado', 17: 'a pear', 18: 'a bell pepper',
  19: 'a mango', 20: 'a banana', 21: 'a carrot', 22: 'a papaya', 23: 'a grapefruit', 24: 'an ear of corn', 25: 'a cauliflower',
  26: 'a lettuce', 27: 'a cabbage', 28: 'an aubergine', 29: 'a butternut squash', 30: 'a large cucumber', 31: 'a coconut',
  32: 'a squash', 33: 'a pineapple', 34: 'a cantaloupe', 35: 'a honeydew melon', 36: 'a papaya', 37: 'a bunch of chard',
  38: 'a pumpkin', 39: 'a small watermelon', 40: 'a watermelon',
};

export const sizeFor = (week: number) => sizeByWeek[Math.min(Math.max(week, 4), 40)];

export const trimesterTips: Record<1 | 2 | 3, string[]> = {
  1: ['Book your first antenatal (ANC) visit.', 'Ask your health worker about folic acid.', 'Rest when you can — tiredness is common.'],
  2: ['Keep up with antenatal visits.', 'Ask about iron and calcium supplements.', 'Gentle exercise like walking helps.'],
  3: ['Learn your baby’s movement pattern.', 'Plan how you’ll get to the facility for birth.', 'Pack your hospital bag.'],
};

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

export const defaultChecklist = [
  'First antenatal visit',
  'Blood tests and screening',
  'Anatomy scan (around 20 weeks)',
  'Birth plan discussed with health worker',
  'Hospital bag packed',
  'Transport to the facility arranged',
];
