import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import ContactModalProvider from '@/components/ContactModalProvider';

export const metadata: Metadata = {
  title: 'HSI: Hierarchical Sparse Intelligence · Ish Sitotombe',
  description:
    'A proof-of-concept multi-agent pipeline where 22 specialist classifiers pre-process every query before an LLM ever sees it, and the honest results of testing it.',
  openGraph: {
    title: 'HSI: Hierarchical Sparse Intelligence',
    description:
      '22 specialist DeBERTa classifiers compress a query into a structured buffer. The LLM reads the buffer, never the raw text.',
    type: 'article',
  },
};

const P: React.CSSProperties = { color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '20px' };
const H2: React.CSSProperties = { fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '52px 0 18px', color: 'var(--text)' };
const EM: React.CSSProperties = { color: 'var(--text)', fontWeight: 600 };

export default function HsiMvp() {
  return (
    <ContactModalProvider>
      <Nav />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>
        <article style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 32px 100px' }}>

          <Link href="/writing" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>← Writing</Link>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08, margin: '20px 0 16px' }}>
            HSI: Hierarchical Sparse Intelligence
          </h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--faint)', fontSize: '0.85rem', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span>Ish Sitotombe · Independent, Colchester</span><span>·</span>
            <time dateTime="2026-07-04">4 July 2026</time><span>·</span><span>6 min read</span>
          </div>
          <p style={{ ...P, fontSize: '1.15rem', color: 'var(--text)', margin: '24px 0 8px' }}>
            A proof-of-concept multi-agent pipeline where 22 specialist classifiers pre-process every
            query before it reaches an LLM, and what happened when I actually built and benchmarked it.
          </p>

          <h2 style={H2}>The idea</h2>
          <p style={P}>
            Most LLM pipelines send raw text straight into one large model. HSI inverts that: a swarm of
            small, fast, domain-specialist classifiers runs first, each trained on a specific aspect of
            language or reasoning, and their outputs are assembled into a typed, structured buffer I
            call the <span style={EM}>Thalamus</span>. The LLM (the &quot;PFC&quot;) reads only the
            Thalamus, never the raw query.
          </p>
          <p style={P}>
            The name borrows from how the human brain actually works: the thalamus relays pre-processed
            sensory information to the prefrontal cortex rather than passing along raw sense data. The
            bet here is the same: offload perception and classification to cheap specialist models, and
            reserve the expensive model for reasoning over a compressed, structured signal instead of
            noisy raw text.
          </p>

          <h2 style={H2}>What I built</h2>
          <p style={P}>
            22 fine-tuned <span style={EM}>DeBERTa-v3-small</span> classifiers (~86M params each),
            organised into layers. Layer 1 handles text-level perception: format, language, encoding
            quality, routing. Layer 2 splits into a language swarm (syntax, intent, sentiment, entities)
            and a math swarm (arithmetic, algebra, statistics, logic). Layer 3 adds geometry, causal
            inference, constraint satisfaction, coreference, and discourse structure. Every agent writes
            into a typed slot in the Thalamus. A query never reaches the LLM without first passing
            through this swarm. The LLM itself is any Ollama-compatible model.
          </p>
          <p style={P}>
            <span style={EM}>Sparse activation</span> is the point: a simple factual question only
            activates the language agents, a math problem only activates the math agents, and both fire
            together for a mixed query. Each agent is independent, so any specialist can be swapped or
            retrained without touching the rest of the system.
          </p>

          <h2 style={H2}>Benchmark results</h2>
          <p style={P}>
            Tested with <span style={EM}>qwen2.5:3b-instruct</span> on Apple Silicon (MPS). All five test
            queries produced correct, relevant responses:
          </p>
          <div style={{ overflowX: 'auto', margin: '24px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr>
                {['category', 'query', 'latency'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--border-2)', color: 'var(--faint)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[
                  ['Language', 'Metaphor vs. simile?', '20.6s'],
                  ['Math', '347 × 28?', '11.8s'],
                  ['Mixed', 'Why is 120mi/2hr = 60mph?', '11.4s'],
                  ['Code', 'Explain this fib() function', '19.3s'],
                  ['Social', 'Help me understand something', '36.3s'],
                ].map(([c, q, l]) => (
                  <tr key={c as string}>
                    <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{c}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{q}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={P}>
            Average latency across the suite: <span style={EM}>19.9 seconds</span>, dominated almost
            entirely by the Ollama LLM inference step on CPU/MPS. A GPU would bring this down roughly
            3–5x.
          </p>

          <h2 style={H2}>Where it falls short</h2>
          <p style={P}>
            A few of the specialists, <span style={EM}>format_detector</span>,{' '}
            <span style={EM}>encoding_quality</span>, and <span style={EM}>text_input_router</span>,
            were trained on synthetic feature strings rather than raw text, so their predictions on real
            input are noisy. The routing layer currently compensates with a rule-based override rather
            than a clean learned signal. And the math specialists classify the <em>type</em> of operation
            (arithmetic, algebra, and so on) but don&apos;t compute a result themselves. The LLM still
            does the actual arithmetic. The sparse-perception layer is real and working; full numeric
            reasoning inside the swarm isn&apos;t there yet.
          </p>

          <h2 style={H2}>What this is and isn&apos;t</h2>
          <p style={P}>
            This is a proof-of-concept, not a finished system. It was built as a closed research project
            to test one specific idea, that structured, pre-processed perception can replace raw text as
            an LLM&apos;s input, and the architecture is the contribution here, not the specific model
            weights. The benchmarks above are real numbers from a real run, and the limitations above are
            the honest state of it, not a polished summary.
          </p>
          <p style={P}>
            The MVP was scoped down from a larger internal architecture plan, a &quot;v1.0&quot; covering
            eight cognitive domains and roughly 71 models, including vision, audio, memory, and an
            agentic tool-use layer. None of that was built. What&apos;s here is the first slice of it:
            text input, language, and math: 22 models, tested honestly, nothing more claimed.
          </p>

          <div style={{ marginTop: '40px', padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              Full architecture, training data, and the local runner are on GitHub:{' '}
              <a href="https://github.com/reverendish/hsi-mvp" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                reverendish/hsi-mvp
              </a>.
            </p>
          </div>

        </article>
      </main>
    </ContactModalProvider>
  );
}
