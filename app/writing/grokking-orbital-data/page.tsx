import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/Nav';
import ContactModalProvider from '@/components/ContactModalProvider';

export const metadata: Metadata = {
  title: 'Grokking on real astronomical data · Ish Sitotombe',
  description:
    'Does delayed generalization survive contact with real, noisy measurements? A tiny transformer trained on real planetary orbits, two confounds diagnosed and fixed, and a 100-seed check that the honest answer is: sometimes.',
  openGraph: {
    title: 'Grokking on real astronomical data',
    description:
      'A tiny transformer, real orbital data, a genuine 24,000-step delay between memorizing and generalizing, and a 100-seed test of how often that actually happens.',
    images: ['/research/grokking-curve.png'],
    type: 'article',
  },
};

const P: React.CSSProperties = { color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '20px' };
const H2: React.CSSProperties = { fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '52px 0 18px', color: 'var(--text)' };
const FIG: React.CSSProperties = { width: '100%', height: 'auto', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)' };
const CAP: React.CSSProperties = { color: 'var(--faint)', fontSize: '0.82rem', lineHeight: 1.6, textAlign: 'center', margin: '10px 0 0' };
const EM: React.CSSProperties = { color: 'var(--text)', fontWeight: 600 };

export default function GrokkingOrbitalData() {
  return (
    <ContactModalProvider>
      <Nav />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>
        <article style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 32px 100px' }}>

          <Link href="/writing" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>← Writing</Link>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08, margin: '20px 0 16px' }}>
            Grokking on real astronomical data
          </h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--faint)', fontSize: '0.85rem', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span>Ish Sitotombe · Independent, Colchester</span><span>·</span>
            <time dateTime="2026-07-05">5 July 2026</time><span>·</span><span>10 min read</span>
          </div>
          <p style={{ ...P, fontSize: '1.15rem', color: 'var(--text)', margin: '24px 0 8px' }}>
            Grokking, the delayed jump from memorizing to generalizing, has mostly been shown on clean,
            synthetic tasks like modular arithmetic. I wanted to know if it survives contact with real,
            noisy, sparse data. The honest answer took two wrong datasets, one genuine 24,000-step delay,
            and a 100-seed check to get to.
          </p>

          <h2 style={H2}>The question</h2>
          <p style={P}>
            Grokking was first documented on synthetic algorithmic tasks where a &quot;true&quot; underlying
            rule is exact by construction. I wanted to test it somewhere that rule has to be recovered from
            real, imperfect measurements instead. Orbital mechanics is a good testbed because it has direct
            historical precedent: a handful of noisy planetary observations were once enough for scientists
            to infer Newton&apos;s law of gravitation and correctly extrapolate it to bodies never observed
            in that data, the moons of Jupiter. I trained a tiny transformer on real measured orbital data
            (central mass and distance in, orbital period out) and asked whether it could recover Kepler&apos;s
            third law and generalize it the same way, to gravitational systems it never saw in training.
          </p>

          <h2 style={H2}>Two wrong datasets first</h2>
          <p style={P}>
            The first version of this experiment used the 8 planets, all orbiting one central mass, the Sun.
            It looked like a clean failure: the model fit training data but couldn&apos;t generalize to moons
            of the outer planets. That looked like a story about grokking not surviving real data. It wasn&apos;t.
            The central mass never varied anywhere in that training set, so the model had no way to learn how
            the law depended on mass at all, a data identifiability problem, not a learning failure.
          </p>
          <p style={P}>
            Fixing that took two rounds. Adding bodies around a few more central masses fixed the mass-range
            gap but exposed a second confound, a distance-range gap between training and test. The dataset
            that actually worked needed both fixed: <span style={EM}>18 real bodies spanning 5 distinct
            central masses</span> (the 8 planets and Pluto, Earth&apos;s Moon, Mars&apos;s two moons, five of
            Uranus&apos;s major moons, and Charon), trained for 60,000 steps.
          </p>

          <h2 style={H2}>It generalized, and it grokked</h2>
          <p style={P}>
            With both confounds resolved, the model correctly generalized Kepler&apos;s third law to{' '}
            <span style={EM}>12 real, held-out bodies</span> across three gravitational systems it never
            trained on, the moons of Jupiter, Saturn, and Neptune, with errors mostly under 10%. And the run
            didn&apos;t just generalize, it grokked in the textbook sense: training fit converged by roughly
            step 3,600, but held-out accuracy didn&apos;t converge until around step 27,600, a genuine
            ~24,000-step delay between memorizing and generalizing.
          </p>
          <Figure src="/research/grokking-curve.png" w={1200} h={750}
            alt="Training loss on planets vs held-out loss on moons across 60,000 training steps"
            caption="The final 18-body run. Train loss (planets) drops early; held-out loss (moons) stays flat for roughly 20,000 steps before collapsing to match it, the delayed-generalization signature." />
          <p style={P}>
            I also checked this wasn&apos;t just a coincidence of the output numbers. The model&apos;s locally
            estimated mass and distance exponents on the 12 held-out bodies (−0.448 ± 0.026 and
            1.417 ± 0.044) sit close to Kepler&apos;s true values (−0.5 and 1.5) and stay tightly clustered
            across all three unseen systems, so the model recovered something close to the actual physical
            law, not just numbers that happened to work.
          </p>

          <h2 style={H2}>Then I checked if it was luck</h2>
          <p style={P}>
            A second seed replicated the successful generalization and the exponent finding, but took a
            noisier, longer, multi-episode route to get there rather than seed 0&apos;s clean single delay.
            Two seeds isn&apos;t a robustness claim, so I scaled the check to{' '}
            <span style={EM}>100 independent seeds</span> on cloud infrastructure. The 2-seed result turned
            out to be optimistic: only <span style={EM}>29 of 100 seeds (29%)</span> reached successful
            cross-system generalization within the 60,000-step budget. The other 71% never converged to a
            generalizing solution in that time.
          </p>
          <p style={P}>
            The part that kept this from being a purely negative result: among the seeds that did succeed,
            the recovered mechanistic exponents stayed reliably close to the true values (mass
            −0.43 ± 0.04, distance 1.37 ± 0.05 vs. true −0.5/1.5). So when generalization happens, it
            reflects real recovered physics rather than a fluke, it just doesn&apos;t happen most of the time
            at this training budget.
          </p>

          <h2 style={H2}>What I take from it</h2>
          <p style={P}>
            Grokking-style delayed generalization does survive contact with real, noisy, non-synthetic data,
            and when it succeeds, it reflects genuine recovery of the underlying physical law rather than
            memorization dressed up as generalization. But success itself is seed-dependent and happens in a
            minority of random initializations at this training budget, and the exact shape and duration of
            the pre-generalization delay should be treated as noisy, not as a precise, reproducible constant.
            The two dataset failures before the real result are as much a part of the finding as the 29%: a
            single-system training set wasn&apos;t enough for a real model, the same way it historically
            wasn&apos;t enough for the scientists who first inferred this law.
          </p>

          <div style={{ marginTop: '40px', padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              The full paper, every number sourced to a log file, all data sources, and the 100-seed
              methodology, is here:{' '}
              <a href="/papers/grokking-orbital-data.pdf" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                Grokking on Real Astronomical Data (PDF)
              </a>.
            </p>
          </div>

        </article>
      </main>
    </ContactModalProvider>
  );
}

function Figure({ src, w, h, alt, caption }: { src: string; w: number; h: number; alt: string; caption: string }) {
  return (
    <figure style={{ margin: '32px 0' }}>
      <Image src={src} width={w} height={h} alt={alt} style={FIG} sizes="(max-width: 760px) 100vw, 760px" />
      <figcaption style={CAP}>{caption}</figcaption>
    </figure>
  );
}
