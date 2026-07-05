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
    slug: 'grokking-orbital-data',
    title: 'Grokking on real astronomical data',
    date: '2026-07-05',
    blurb:
      'Grokking has mostly been shown on clean, synthetic tasks. I trained a tiny transformer on real planetary orbits, diagnosed two dataset confounds that produced a fake negative result, got a genuine 24,000-step delayed generalization once they were fixed, then ran 100 seeds to check how often that actually happens.',
    tags: ['Grokking', 'Research', 'Built in public'],
    readingTime: '10 min read',
  },
  {
    slug: 'hsi-mvp',
    title: 'HSI: Hierarchical Sparse Intelligence',
    date: '2026-07-04',
    blurb:
      'A proof-of-concept multi-agent pipeline where 22 specialist classifiers pre-process every query before it reaches an LLM, and what happened when I actually built and benchmarked it.',
    tags: ['Multi-agent', 'Research', 'Built in public'],
    readingTime: '6 min read',
  },
  {
    slug: 'flow-vs-fisher',
    title: 'Testing a slime-mould idea against Fisher information',
    date: '2026-06-23',
    blurb:
      'I bet a biology-inspired importance signal could beat the standard method at stopping a neural network from forgetting. On the easy benchmark it did, then it failed on the hard one. Here is the honest arc, and the mechanism that explains both.',
    tags: ['Continual learning', 'Research', 'Built in public'],
    readingTime: '8 min read',
  },
];
