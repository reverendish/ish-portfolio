// Single source of truth for blog posts. Add a new entry here + a page at
// app/writing/<slug>/page.tsx to publish. The index reads from this list.

export interface Post {
  slug: string;
  title: string;
  date: string;        // ISO yyyy-mm-dd
  blurb: string;
  tags: string[];
  readingTime: string;
}

export const posts: Post[] = [
  {
    slug: 'flow-vs-fisher',
    title: 'Testing a slime-mould idea against Fisher information',
    date: '2026-06-23',
    blurb:
      'I bet a biology-inspired importance signal could beat the standard method at stopping a neural network from forgetting. On the easy benchmark it did — then it failed on the hard one. Here is the honest arc, and the mechanism that explains both.',
    tags: ['Continual learning', 'Research', 'Built in public'],
    readingTime: '8 min read',
  },
];
