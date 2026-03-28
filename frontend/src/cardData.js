export const STORAGE_KEYS = {
  cards: 'thilinomice_cards',
  submissions: 'thilinomice_submissions',
};

export const DEFAULT_CARDS = [
  {
    id: 1,
    title: 'Session Alpha',
    description: 'Explore the foundations of innovation and creative thinking.',
    synopsis: 'A deep dive into the building blocks of creative thinking and modern innovation frameworks that drive breakthrough ideas.',
    image: null,
  },
  {
    id: 2,
    title: 'Session Beta',
    description: 'Master the art of strategic communication and influence.',
    synopsis: 'Learn how to craft compelling narratives, deliver impactful presentations, and inspire action through the power of words.',
    image: null,
  },
  {
    id: 3,
    title: 'Session Gamma',
    description: 'Unlock the power of data-driven decisions and analytics.',
    synopsis: 'Transform raw data into actionable insights using modern analytics tools and visualization techniques for smarter outcomes.',
    image: null,
  },
  {
    id: 4,
    title: 'Session Delta',
    description: 'Build resilient, high-performance teams in the digital era.',
    synopsis: 'Discover proven frameworks for building cohesive teams that thrive in remote, hybrid, and fast-paced environments.',
    image: null,
  },
  {
    id: 5,
    title: 'Session Epsilon',
    description: 'Navigate emerging technology trends shaping the future.',
    synopsis: 'An immersive exploration of AI, blockchain, and next-gen tech reshaping industries and creating new opportunities.',
    image: null,
  },
  {
    id: 6,
    title: 'Session Zeta',
    description: 'Create lasting impact through purpose-led leadership.',
    synopsis: 'How visionary leaders inspire transformative change, build cultures of excellence, and leave a lasting legacy.',
    image: null,
  },
];

export function loadCards() {
  const saved = localStorage.getItem(STORAGE_KEYS.cards);
  if (!saved) return DEFAULT_CARDS;
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_CARDS;
  }
}
