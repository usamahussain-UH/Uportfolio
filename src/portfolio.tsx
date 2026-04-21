import { motion } from 'framer-motion'
import { Bot, Dices, Download, Laugh, LinkIcon, Mail, MessageSquarePlus, Moon, Send, Shield, Sparkles, Sun, User } from 'lucide-react'
import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import './portfolio.css'
import './index.css'

type Theme = 'dark' | 'light'

const styles = `

`

function scrollToId(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

type Role = 'user' | 'assistant'
type Msg = { id: string; role: Role; content: string }

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function demoBrain(prompt: string) {
  const p = prompt.trim().toLowerCase()
  if (!p) return "Ask me anything—projects, skills, or how this portfolio was built."
  if (p.includes('project'))
    return 'Projects: AI Resume Analyzer • Neural Notes • Smart Portfolio Assistant. Want a detailed breakdown of one?'
  if (p.includes('tech') || p.includes('stack'))
    return 'Stack: React + TypeScript + Vite, glass UI, motion animations. Live LLM can be added via a secure backend endpoint.'
  if (p.includes('contact')) return 'You can contact me via the Contact Me section. Add email/LinkedIn/GitHub there.'
  return `Demo reply (offline): I understood: "${prompt}". If you enable the live model, I can answer with real reasoning + up-to-date responses.`
}

function AiPlayground() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo')
  const [busy, setBusy] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    {
      id: uid(),
      role: 'assistant',
      content:
        "Welcome to the AI Playground. Demo mode works instantly. Live mode is a hook for your backend so API keys stay private.",
    },
  ])

  const canLive = useMemo(() => Boolean(import.meta.env.VITE_LIVE_CHAT === '1'), [])
  const listRef = useRef<HTMLDivElement | null>(null)

  async function send() {
    const text = input.trim()
    if (!text || busy) return

    setInput('')
    setBusy(true)
    const next: Msg[] = [...msgs, { id: uid(), role: 'user' as const, content: text }]
    setMsgs(next)

    try {
      if (mode === 'demo' || !canLive) {
        const reply = demoBrain(text)
        const final: Msg[] = [...next, { id: uid(), role: 'assistant' as const, content: reply }]
        setMsgs(final)
        return
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = (await res.json()) as { content?: string }
      const final: Msg[] = [...next, { id: uid(), role: 'assistant' as const, content: data.content ?? 'No response.' }]
      setMsgs(final)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setMsgs((m) => [...m, { id: uid(), role: 'assistant', content: `Live chat error: ${msg}` }])
    } finally {
      setBusy(false)
      queueMicrotask(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }))
    }
  }

  return (
    <div className="card glass">
      <div className="row between wrap gap">
        <div>
          <div className="card-title">Chat</div>
          <div className="muted">
            <span className="chip-inline">
              <Shield size={14} /> Keys stay private (via backend)
            </span>
          </div>
        </div>

        <div className="seg">
          <button type="button" className={mode === 'demo' ? 'seg-on' : 'seg-off'} onClick={() => setMode('demo')}>
            Demo
          </button>
          <button
            type="button"
            className={mode === 'live' ? 'seg-on' : 'seg-off'}
            onClick={() => setMode('live')}
            disabled={!canLive}
            title={!canLive ? 'Enable with VITE_LIVE_CHAT=1 and /api/chat backend' : undefined}
          >
            Live
          </button>
        </div>
      </div>

      <div className="chat" ref={listRef}>
        {msgs.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'chat-row chat-row-user' : 'chat-row chat-row-bot'}>
            <div className="chat-avatar">{m.role === 'user' ? <User size={16} /> : <Bot size={16} />}</div>
            <div className="chat-bubble">
              <div className="chat-role">{m.role === 'user' ? 'You' : 'AI'}</div>
              <div className="chat-text">{m.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' ? send() : undefined)}
          placeholder={mode === 'live' && canLive ? 'Ask the live model…' : 'Ask the demo brain…'}
          disabled={busy}
        />
        <button type="button" className="btn btn-primary" onClick={send} disabled={busy || !input.trim()}>
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  )
}

// ===== Fun Zone (single-file) =====
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function yearsFromDob(dob: string) {
  const dt = new Date(dob)
  if (Number.isNaN(dt.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - dt.getFullYear()
  const m = now.getMonth() - dt.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < dt.getDate())) age--
  return clamp(age, 0, 140)
}

function FunZone() {
  const reveal = useMemo(() => ({ age: 21, siblings: 2 }), [])
  const [guessAge, setGuessAge] = useState('')
  const [guessSib, setGuessSib] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const [dob, setDob] = useState('')
  const computedAge = yearsFromDob(dob)

  const [lucky, setLucky] = useState<number | null>(null)
  const [fact, setFact] = useState<string | null>(null)

  const funFacts = useMemo(
    () => [
      'Your brain generates enough electricity to power a small light bulb.',
      'Octopuses have three hearts—so you can love coding three times more.',
      'Honey never spoils. Neither should your Git history.',
      'Bananas are berries. Strawberries are not.',
      'A day on Venus is longer than its year.',
    ],
    [],
  )

  function checkGuess() {
    const a = Number(guessAge)
    const s = Number(guessSib)
    if (!Number.isFinite(a) || !Number.isFinite(s)) {
      setResult('Enter valid numbers for age and siblings.')
      return
    }
    const ageDiff = Math.abs(a - reveal.age)
    const sibDiff = Math.abs(s - reveal.siblings)
    if (ageDiff === 0 && sibDiff === 0) setResult('Perfect guess. You have strong AI intuition.')
    else if (ageDiff <= 2 && sibDiff <= 1) setResult('Very close. Your prediction engine is warm.')
    else setResult('Not quite. Try again—your model will improve with more data.')
  }

  function rollLucky() {
    setLucky(1 + Math.floor(Math.random() * 99))
  }

  function nextFact() {
    setFact(funFacts[Math.floor(Math.random() * funFacts.length)] ?? null)
  }

  return (
    <div className="grid-3">
      <div className="card glass hover-lift">
        <div className="card-title">
          <Sparkles size={18} /> Guess my profile
        </div>
        <div className="muted">Try to guess my age and number of siblings (edit in code later).</div>
        <div className="form">
          <label>
            Age guess
            <input value={guessAge} onChange={(e) => setGuessAge(e.target.value)} placeholder="Age" />
          </label>
          <label>
            Siblings guess
            <input value={guessSib} onChange={(e) => setGuessSib(e.target.value)} placeholder="My Siblings" />
          </label>
          <button className="btn btn-primary" type="button" onClick={checkGuess}>
            Check
          </button>
          {result ? <div className="note">{result}</div> : null}
          <details className="muted">
            <summary>Reveal (for testing)</summary>
            Age: {reveal.age} • Siblings: {reveal.siblings}
          </details>
        </div>
      </div>

      <div className="card glass hover-lift">
        <div className="card-title">
          <Laugh size={18} /> Age calculator
        </div>
        <div className="muted">Pick your date of birth and I’ll calculate your age.</div>
        <div className="form">
          <label>
            Date of birth
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </label>
          <div className="note">{computedAge === null ? 'Select a valid date.' : `Your age is ${computedAge}.`}</div>
        </div>
      </div>

      <div className="card glass hover-lift">
        <div className="card-title">
          <Dices size={18} /> Fun generator
        </div>
        <div className="muted">Instant entertainment: lucky number + fun fact.</div>
        <div className="form">
          <button className="btn btn-ghost" type="button" onClick={rollLucky}>
            Lucky number
          </button>
          <div className="note">{lucky === null ? '—' : `Your lucky number is ${lucky}.`}</div>

          <button className="btn btn-ghost" type="button" onClick={nextFact}>
            Fun fact
          </button>
          <div className="note">{fact ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}

// ===== Guest Book (single-file) =====
type Entry = { id: string; name: string; remark: string; createdAt: number }
const STORAGE_KEY = 'guestbook_entries_v1'

function GuestBook() {
  const [name, setName] = useState('')
  const [remark, setRemark] = useState('')
  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Entry[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const sorted = useMemo(() => [...entries].sort((a, b) => b.createdAt - a.createdAt), [entries])

  function add() {
    const n = name.trim() || 'Anonymous'
    const r = remark.trim()
    if (!r) return
    setEntries((e) => [{ id: uid(), name: n, remark: r, createdAt: Date.now() }, ...e].slice(0, 50))
    setRemark('')
  }

  return (
    <div className="card glass">
      <div className="row between wrap gap">
        <div>
          <div className="card-title">
            <MessageSquarePlus size={18} /> Guest Book
          </div>
          <div className="muted">Leave a remark. (Saved locally for now; can be upgraded to Supabase.)</div>
        </div>
        <div className="muted">{sorted.length} remarks</div>
      </div>

      <div className="form">
        <label>
          Your name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Usama" />
        </label>
        <label>
          Remark
          <input value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Write something awesome…" />
        </label>
        <button className="btn btn-primary" type="button" onClick={add} disabled={!remark.trim()}>
          <Send size={16} /> Submit
        </button>
      </div>

      <div className="remarks">
        {sorted.length === 0 ? (
          <div className="muted">No remarks yet. Be the first.</div>
        ) : (
          sorted.map((e) => (
            <div key={e.id} className="remark glass">
              <div className="remark-top">
                <div className="remark-name">{e.name}</div>
                <div className="remark-time">{new Date(e.createdAt).toLocaleString()}</div>
              </div>
              <div className="remark-text">{e.remark}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const nav = useMemo(
    () => [
      { id: 'projects', label: 'Projects' },
      { id: 'education', label: 'Education' },
      { id: 'contact', label: 'Contact Me' },
      { id: 'about', label: 'About Me' },
    ],
    [],
  )

  return (
    <div className="app">
      <style>{styles}</style>

      <div className="bg">
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-scanlines" />
      </div>

      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => scrollToId('top')} type="button">
            <span className="brand-dot" />
            <span className="brand-text">AI Futuristic Portfolio</span>
            <span className="pill">
              <Sparkles size={14} /> Live
            </span>
          </button>

          <nav className="nav">
            {nav.map((x) => (
              <button key={x.id} type="button" className="nav-link" onClick={() => scrollToId(x.id)}>
                {x.label}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <a className="btn btn-ghost" href="/cv.pdf" download>
              <Download size={16} />
              Download CV
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle dark/light"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </header>

      <main className="main" id="top">
        <section className="hero container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-card glass"
          >
            <div className="hero-kicker">Next-gen • AI-first • Welcome to Future</div>
            <h1 className="hero-title">
              I build <span className="grad">AI-powered</span> products and experiences.
            </h1>
            <p className="hero-sub">
              A portfolio designed like a cockpit: interactive LLM playground, fun neural games, achievements,
              guestbook, and a clean professional profile—wrapped in glass + motion.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" type="button" onClick={() => scrollToId('ai')}>
                Launch AI Playground
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => scrollToId('projects')}>
                View Projects
              </button>
            </div>

            <div className="hero-stats">
              {[
                { k: 'Focus', v: 'AI + Web' },
                { k: 'Style', v: 'Futuristic' },
                { k: 'Mode', v: theme === 'dark' ? 'Night' : 'Day' },
              ].map((s) => (
                <div key={s.k} className={clsx('stat', 'glass')}>
                  <div className="stat-k">{s.k}</div>
                  <div className="stat-v">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
        

        <section className="container section" id="ai">
          <div className="section-head">
            <h2 className="section-title">AI Playground (Live LLM + Demos)</h2>
            <p className="section-sub">
              Chat with a live model (optional setup) or use the built-in demo brain. Coming next: voice, code
              explain, and real-time tools.
            </p>
          </div>
          <div className="grid-2">
            <AiPlayground />
            <div className="card glass">
              <div className="card-title">Other “Live Things”</div>
              <div className="muted">
                Status, animated background, dynamic cards, and interactive panels—more live modules (visitor stats,
                mini-visualizers) will be added.
              </div>
              <div className="chip-row">
                <span className="chip">Particles</span>
                <span className="chip">Scanlines</span>
                <span className="chip">Glow</span>
              </div>
            </div>
          </div>
        </section>

        <section className="container section" id="projects">
          <div className="section-head">
            <h2 className="section-title">Projects</h2>
            <p className="section-sub">Add your best 4–6 projects here (AI, web apps, automation, etc.).</p>
          </div>
         
        <div className="grid-3">
  {[
    { title: 'AI Resume Analyzer', img: '/1st.jpg' },
    { title: 'Neural Notes', img: '/2nd.jpg' },
    { title: 'Smart Portfolio Assistant', img: '/3rd.jpg' },
    { title: 'Realtime Dashboard', img: '/4th.jpg' },
    { title: 'Vision Demo', img: '/5th.jpg' },
    { title: 'Automation Bot', img: '/6th.jpg' },
    {title: 'Automated Robort', img: '/6th.jpg' },
  ].map((project) => (
    <div key={project.title} className="card glass hover-lift">
      <div className="card-title">{project.title}</div>

      <div className="card-img">
        <img src={project.img} alt={project.title} />
      </div>

      <div className="muted">
        Short punchy description. Tech stack. One impact metric.
      </div>

      <div className="chip-row">
        <span className="chip">React</span>
        <span className="chip">AI</span>
        <span className="chip">TypeScript</span>
      </div>
    </div>
  ))}
</div>

        </section>

        <section className="container section" id="cv">
          <div className="section-head">
            <h2 className="section-title">CV / Resume</h2>
            <p className="section-sub">Download my latest CV (replace `public/cv.pdf`).</p>
          </div>
          <div className="grid-2">
            <div className="card glass">
              <div className="card-title">Quick summary</div>
              <div className="muted">
                Add a sharp 5–7 line summary: roles, strengths, best projects, and what you’re looking for.
              </div>
              <div className="chip-row">
                <span className="chip">React</span>
                <span className="chip">AI</span>
                <span className="chip">Full-stack</span>
              </div>
              <div className="hero-cta">
                <a className="btn btn-primary" href="/cv.pdf" download>
                  <Download size={16} /> Download CV
                </a>
                <a className="btn btn-ghost" href="/cv.pdf" target="_blank" rel="noreferrer">
                  Open
                </a>
              </div>
            </div>
            <div className="card glass">
              <div className="card-title">Highlights</div>
              <div className="muted">Skills • Tools • Impact metrics • Certifications.</div>
            </div>
          </div>
        </section>

        <section className="container section" id="fun">
          <div className="section-head">
            <h2 className="section-title">Fun & Entertainment</h2>
            <p className="section-sub">Neural games and playful widgets to keep visitors engaged.</p>
          </div>
          <FunZone />
        </section>

        <section className="container section" id="education">
          <div className="section-head">
            <h2 className="section-title">Education</h2>
            <p className="section-sub">Your degree, institute, and relevant coursework.</p>
          </div>
          <div className="card glass">
            <div className="card-title">Your Degree / Program</div>
            <div className="muted">Institute • Year • Highlights • GPA (optional)</div>
          </div>
        </section>

        <section className="container section" id="achievements">
          <div className="section-head">
            <h2 className="section-title">Achievements</h2>
            <p className="section-sub">Certifications, awards, milestones, and proud moments.</p>
          </div>
          <div className="grid-3">
            {[
              { t: 'Hackathon finalist', d: 'Top 10 finish out of 400+ teams.' },
              { t: 'Certification', d: 'AI / Cloud / Web Dev (add yours).' },
              { t: 'Open-source', d: 'Contributions and community work.' },
            ].map((x) => (
              <div key={x.t} className="card glass hover-lift">
                <div className="card-title">{x.t}</div>
                <div className="muted">{x.d}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="container section" id="about">
          <div className="section-head">
            <h2 className="section-title">About Me</h2>
            <p className="section-sub">A crisp intro + strengths + what you’re building next.</p>
          </div>
          <div className="grid-2">
            <div className="card glass">
              <div className="card-title">Profile</div>
              <div className="muted">Replace this with your story: who you are, what you love building, and what roles you want.</div>
            </div>
            <div className="card glass">
              <div className="card-title">Hobbies</div>
              <div className="chip-row">
                {['Coding', 'AI experiments', 'Gaming', 'Design', 'Reading', 'Music'].map((x) => (
                  <span key={x} className="chip">{x}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container section" id="contact">
          <div className="section-head">
            <h2 className="section-title">Contact Me</h2>
            <p className="section-sub">Add your email, social links, and a contact form.</p>
          </div>
          <div className="grid-2">
            <div className="card glass">
              <div className="card-title">Links</div>
              <div className="muted">Email • GitHub • LinkedIn • X • Instagram • WhatsApp</div>
            </div>
            <div className="card glass">
              <div className="card-title">Message</div>
              <div className="muted">Add a contact form here with validation.</div>
            </div>
          </div>
        </section>

        <section className="container section" id="guestbook">
          <div className="section-head">
            <h2 className="section-title">Guest Book</h2>
            <p className="section-sub">Visitors can leave remarks and feedback.</p>
          </div>
          <GuestBook />
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top" />
        <div className="container footer-inner2">
          <div className="footer-left">
            <div className="footer-brand">
              <span className="brand-dot" />
              <div>
                <div className="footer-title">AI Futuristic Portfolio</div>
                <div className="muted">Building fast, beautiful, AI-first experiences.</div>
              </div>
            </div>

            <div className="footer-social">
              <a className="btn btn-ghost" href="mailto:your@email.com">
                <Mail size={16} /> Email
              </a>
              <a className="btn btn-ghost" href="https://github.com/" target="_blank" rel="noreferrer">
                <LinkIcon size={16} /> GitHub
              </a>
              <a className="btn btn-ghost" href="https://linkedin.com/" target="_blank" rel="noreferrer">
                <LinkIcon size={16} /> LinkedIn
              </a>
            </div>
          </div>

          <div className="footer-right">
            <img className="footer-art" src="/ai-footer.svg" alt="" />
            <div className="footer-links">
              {[
                { id: 'ai', label: 'AI Playground' },
                { id: 'projects', label: 'Projects' },
                { id: 'cv', label: 'CV' },
                { id: 'guestbook', label: 'Guest Book' },
                { id: 'contact', label: 'Contact' },
              ].map((x) => (
                <button key={x.id} type="button" className="footer-link" onClick={() => scrollToId(x.id)}>
                  {x.label}
                </button>
              ))}
            </div>
            <div className="footer-bottom">
              <div className="muted">© {new Date().getFullYear()} • React • Vite • Futuristic AI Theme</div>
              <button type="button" className="btn btn-ghost" onClick={() => scrollToId('top')}>
                Back to top
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

