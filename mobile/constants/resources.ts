export interface HotlineEntry {
  name: string;
  number: string;
  note?: string;
  region: string;
}

export interface ResourceArticle {
  title: string;
  summary: string;
  url: string;
  tag: string;
}

export const HOTLINES: HotlineEntry[] = [
  // ── India ────────────────────────────────────────────────────────────────
  {
    name:   'iCall',
    number: '9152987821',
    note:   'Mon–Sat, 8 am–10 pm IST',
    region: 'India',
  },
  {
    name:   'Vandrevala Foundation',
    number: '1860-2662-345',
    note:   '24/7',
    region: 'India',
  },
  {
    name:   'AASRA',
    number: '9820466627',
    note:   '24/7',
    region: 'India',
  },
  {
    name:   'iMind',
    number: '080-46110007',
    region: 'India',
  },
  // ── USA ──────────────────────────────────────────────────────────────────
  {
    name:   '988 Suicide & Crisis Lifeline',
    number: '988',
    note:   'Call or text, 24/7',
    region: 'USA',
  },
  {
    name:   'Crisis Text Line',
    number: 'Text HOME to 741741',
    note:   '24/7',
    region: 'USA',
  },
  {
    name:   'SAMHSA Helpline',
    number: '1-800-662-4357',
    note:   'Mental health & substance use, 24/7',
    region: 'USA',
  },
  // ── UK ───────────────────────────────────────────────────────────────────
  {
    name:   'Samaritans',
    number: '116 123',
    note:   '24/7',
    region: 'UK',
  },
  // ── Canada ───────────────────────────────────────────────────────────────
  {
    name:   'Crisis Services Canada',
    number: '1-833-456-4566',
    note:   '24/7',
    region: 'Canada',
  },
  // ── Australia ────────────────────────────────────────────────────────────
  {
    name:   'Lifeline',
    number: '13 11 14',
    note:   '24/7',
    region: 'Australia',
  },
];

export const ARTICLES: ResourceArticle[] = [
  {
    title:   'Dealing with Academic Pressure as an International Student',
    summary: 'Practical strategies to manage grade anxiety, imposter syndrome, and the fear of disappointing your family.',
    url:     'https://www.usnews.com/education/blogs/international-student-counsel/articles/how-to-cope-with-stress-as-an-international-student',
    tag:     'Academic Pressure',
  },
  {
    title:   'Navigating Cultural Identity When You Study Abroad',
    summary: 'How to hold space for both your roots and your evolving self without guilt.',
    url:     'https://www.psychologytoday.com/us/blog/culturally-speaking/201610/third-culture-kids-who-are-they',
    tag:     'Cultural Identity',
  },
  {
    title:   'Understanding Homesickness and How to Cope',
    summary: 'Why homesickness hits hardest at celebrations — and what actually helps.',
    url:     'https://www.verywellmind.com/what-is-homesickness-5209523',
    tag:     'Homesickness',
  },
  {
    title:   'Visa Anxiety: When Immigration Stress Affects Mental Health',
    summary: "You're not alone if visa uncertainty keeps you up at night. Here's what to do.",
    url:     'https://www.migrationpolicy.org/article/mental-health-international-students',
    tag:     'Immigration Stress',
  },
  {
    title:   'Setting Healthy Boundaries with Family While Living Abroad',
    summary: 'Staying connected without letting every call feel like a performance review.',
    url:     'https://www.psychologytoday.com/us/blog/the-borderline-personality-disorder/201805/setting-boundaries-with-family',
    tag:     'Family Pressure',
  },
  {
    title:   'When to Seek Professional Help (And How to Find It Abroad)',
    summary: 'A practical guide to finding therapists, counsellors, and university services as an Indian student abroad.',
    url:     'https://www.mentalhealthamerica.net/finding-help',
    tag:     'Professional Help',
  },
];

export const ORGANIZATIONS = [
  {
    name:    'The Live Love Laugh Foundation',
    url:     'https://www.thelivelovelaughfoundation.org',
    tagline: "India's leading mental health NGO",
  },
  {
    name:    'iCall — TISS',
    url:     'https://icallhelpline.org',
    tagline: 'Free counselling for young adults',
  },
  {
    name:    'Vandrevala Foundation',
    url:     'https://www.vandrevalafoundation.com',
    tagline: '24/7 helpline + therapy referrals',
  },
  {
    name:    'NIMHANS',
    url:     'https://nimhans.ac.in',
    tagline: 'National Institute of Mental Health and Neuro Sciences',
  },
];
