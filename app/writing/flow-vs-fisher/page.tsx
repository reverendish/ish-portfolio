import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/Nav';
import ContactModalProvider from '@/components/ContactModalProvider';

export const metadata: Metadata = {
  title: 'Testing a slime-mould idea against Fisher information — Ish Sitotombe',
  description:
    'A biology-inspired importance signal beat the standard method at preventing catastrophic forgetting on an easy benchmark, then failed on a harder one. The honest arc, and the mechanism behind both.',
  openGraph: {
    title: 'Testing a slime-mould idea against Fisher information',
    description:
      'It won on the easy benchmark, lost on the hard one, and the reason why turned out to be measurable.',
    images: ['/research/pareto-mnist.png'],
    type: 'article',
  },
};

const P: React.CSSProperties = { color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '20px' };
const H2: React.CSSProperties = { fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '52px 0 18px', color: 'var(--text)' };
const FIG: React.CSSProperties = { width: '100%', height: 'auto', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)' };
const CAP: React.CSSProperties = { color: 'var(--faint)', fontSize: '0.82rem', lineHeight: 1.6, textAlign: 'center', margin: '10px 0 0' };
const EM: React.CSSProperties = { color: 'var(--text)', fontWeight: 600 };

function Figure({ src, w, h, alt, caption }: { src: string; w: number; h: number; alt: string; caption: string }) {
  return (
    <figure style={{ margin: '32px 0' }}>
      <Image src={src} width={w} height={h} alt={alt} style={FIG} sizes="(max-width: 760px) 100vw, 760px" />
      <figcaption style={CAP}>{caption}</figcaption>
    </figure>
  );
}

export default function FlowVsFisher() {
  return (
    <ContactModalProvider>
      <Nav />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>
        <article style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 32px 100px' }}>

          <Link href="/writing" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>← Writing</Link>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08, margin: '20px 0 16px' }}>
            Testing a slime-mould idea against Fisher information
          </h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--faint)', fontSize: '0.85rem', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span>Ish Sitotombe · Independent, Colchester</span><span>·</span>
            <time dateTime="2026-06-23">23 June 2026</time><span>·</span><span>8 min read</span>
          </div>
          <p style={{ ...P, fontSize: '1.15rem', color: 'var(--text)', margin: '24px 0 8px' }}>
            I had a hypothesis. I ran the experiment properly. The hypothesis was wrong — and the way it
            was wrong turned out to be more interesting than if it had worked.
          </p>

          <h2 style={H2}>The problem</h2>
          <p style={P}>
            Train a neural network on task A, then train it on task B, and it tends to forget A almost
            entirely. This is called <span style={EM}>catastrophic forgetting</span>, and it&apos;s one of
            the reasons models are retrained from scratch rather than taught new things incrementally.
          </p>
          <p style={P}>
            One family of fixes works by deciding which weights matter for the old task and gently
            anchoring those in place while the new task is learned. The whole game is the importance
            estimate: <span style={EM}>which weights do you protect?</span> The standard answer is Fisher
            information (the method called EWC) — roughly, how sensitive the model&apos;s output is to each
            weight. It works, but it needs an extra gradient computation.
          </p>

          <h2 style={H2}>The bet</h2>
          <p style={P}>
            I wanted to try a different signal, borrowed from biology. <span style={EM}>Physarum</span>, the
            slime mould, solves mazes and designs efficient networks with no brain: tubes that carry a lot
            of flow thicken, tubes that carry little flow wither away. The surviving network <em>is</em> the
            solution. The analogue for a neural network: protect the connections that carry the most signal
            during training — measure &quot;flow&quot; on the forward pass, no extra gradient needed.
          </p>
          <p style={P}>
            To keep it a fair test I held everything constant except the importance estimate — same model,
            same anchor penalty, same tasks — and only swapped which signal decides what to protect:
            naive (no protection), Fisher/EWC, Synaptic Intelligence, and two flow variants. I wrote down my
            prediction in advance: the flow signal that most resembles the literal slime-mould reading
            (flow weighted by connection strength) would win.
          </p>

          <h2 style={H2}>It worked — on the easy benchmark</h2>
          <p style={P}>
            On Permuted MNIST (a deliberately gentle continual-learning benchmark), a flow signal did beat
            Fisher. But not the one I predicted. The winner was <span style={EM}>flow-frequency</span> — how
            often a unit fires, independent of weight strength — while the literal slime-mould version
            (flow-magnitude) was the <em>worst</em> method of the lot. My pre-registered guess was falsified
            in the most useful way: the variant that won was the one that <em>couldn&apos;t</em> be explained
            away as just protecting big weights.
          </p>
          <div style={{ overflowX: 'auto', margin: '24px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr>
                {['method', 'stability', 'plasticity', 'avg acc'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--border-2)', color: 'var(--faint)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[
                  ['flow-frequency', '0.974', '0.951', '0.962', true],
                  ['Fisher (EWC)', '0.949', '0.949', '0.949', false],
                  ['naive', '0.922', '0.973', '0.947', false],
                  ['flow-magnitude', '0.973', '0.897', '0.935', false],
                ].map(([m, s, p, a, win]) => (
                  <tr key={m as string} style={{ background: win ? 'var(--accent-soft)' : 'transparent' }}>
                    <td style={{ padding: '8px 12px', color: win ? 'var(--text)' : 'var(--muted)', fontWeight: win ? 700 : 400 }}>{m}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{s}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{p}</td>
                    <td style={{ padding: '8px 12px', color: win ? 'var(--text)' : 'var(--muted)', fontWeight: win ? 700 : 400 }}>{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Figure src="/research/pareto-mnist.png" w={910} h={780} alt="Stability vs plasticity frontier on Permuted MNIST"
            caption="Permuted MNIST: flow-frequency (top-right) holds onto the old task and learns the new one better than Fisher." />

          <h2 style={H2}>Then the hard benchmark broke it</h2>
          <p style={P}>
            Permuted MNIST is known to be too easy. The real test was Split-CIFAR-10 — genuinely different
            classes per task, a convolutional network. Here the result <span style={EM}>reversed completely</span>.
            Flow-frequency dropped to the bottom of the pack: it was statistically indistinguishable from a
            uniform anchor (protecting everything equally), and it lost to a properly-tuned Fisher in every
            paired run.
          </p>
          <div style={{ overflowX: 'auto', margin: '24px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr>
                {['method', 'avg acc', ''].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--border-2)', color: 'var(--faint)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[
                  ['Fisher (EWC)', '0.822', 'wins'],
                  ['Synaptic Intelligence', '0.763', ''],
                  ['naive', '0.743', ''],
                  ['flow-magnitude', '0.736', ''],
                  ['flow-frequency', '0.696', 'ties "uniform"'],
                  ['uniform anchor', '0.695', ''],
                ].map(([m, a, note]) => (
                  <tr key={m}>
                    <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{m}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{a}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--faint)', fontSize: '0.82rem' }}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Figure src="/research/pareto-cifar.png" w={910} h={780} alt="Stability vs plasticity frontier on Split-CIFAR-10"
            caption="Split-CIFAR-10: Fisher&apos;s frontier sits clearly above the flow methods. The easy-benchmark win did not survive." />

          <h2 style={H2}>Why — and this is the good part</h2>
          <p style={P}>
            Flow-frequency protects a unit in proportion to how often it fires. That only carries
            information when firing rates <span style={EM}>differ</span> across units. MNIST&apos;s input
            pixels are wildly uneven — border pixels almost never fire, central ones often — so the signal
            is rich. A convolutional network&apos;s channels fire much more uniformly, so the same signal
            flattens into a constant: it becomes the uniform anchor, which is exactly what the CIFAR numbers
            showed.
          </p>
          <Figure src="/research/heterogeneity.png" w={1040} h={650} alt="Per-layer firing-rate coefficient of variation, MNIST vs CIFAR"
            caption="Heterogeneity of firing rates per layer. MNIST&apos;s input layer is extreme (CV 1.24); CIFAR&apos;s first conv layer is nearly flat (CV 0.06)." />
          <p style={P}>
            To check this was the actual cause and not a coincidence, I ran a controlled test: take the
            <em>same</em> MNIST task and whiten the inputs, which flattens the pixel firing rates without
            changing the labels. The input heterogeneity collapsed — and on that same task, flow-frequency&apos;s
            edge over Fisher reversed, from <span style={EM}>+0.02 ahead to −0.21 behind</span>. Homogenise
            the input and you reproduce the CIFAR failure on MNIST. (The honest caveat: whitening also lowers
            accuracy across the board, so it&apos;s strong corroboration, not an airtight single-variable proof.)
          </p>
          <Figure src="/research/cv-vs-benefit.png" w={1560} h={650} alt="Firing-rate heterogeneity vs flow benefit across configurations"
            caption="Across datasets, flow&apos;s benefit tracks input heterogeneity — though this correlation is partly confounded by dataset, which is why the controlled whitening test matters more." />

          <h2 style={H2}>What I take from it</h2>
          <p style={P}>
            The strong claim — &quot;this biology-inspired signal beats Fisher&quot; — is false. The honest,
            bounded claim that replaced it: forward-pass participation-frequency is a real importance signal,
            competitive with or better than Fisher <em>when unit firing rates are heterogeneous</em>, and
            degenerate when they aren&apos;t. That&apos;s a smaller result than I set out to find, and a more
            trustworthy one.
          </p>
          <p style={P}>
            I&apos;m writing this up the way it actually went — wrong prediction included — because that&apos;s
            the part most write-ups quietly delete, and it&apos;s the part that decides whether you can trust
            the rest. The same instinct goes into the software I build: pre-register what you expect, test it
            fairly, and report what happened.
          </p>

          <div style={{ marginTop: '40px', padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              The full write-up (method, all five runs, references) and the code to reproduce every number
              are on GitHub:{' '}
              <a href="https://github.com/reverendish/flow-engram" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                reverendish/flow-engram
              </a>. {/* TODO: make repo public + add paper PDF/Zenodo link */}
            </p>
          </div>

        </article>
      </main>
    </ContactModalProvider>
  );
}
