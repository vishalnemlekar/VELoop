import { useState } from "react";
import BrandMark from "../components/BrandMark";

const navLinks = [
  { href: "#ways-to-earn", label: "Ways to earn" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#spin", label: "Spin" },
  { href: "#rewards", label: "Rewards" },
  { href: "#payouts", label: "Payouts" },
  { href: "#faq", label: "FAQ" },
];

const earnCategories = [
  { icon: "game", title: "Play games", description: "Reach in-game milestones and get rewarded for your progress.", tag: "Games", tone: "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 text-white", box: "lg:col-span-2 lg:row-span-2", big: true },
  { icon: "survey", title: "Take surveys", description: "Share your opinion in short surveys from research partners.", tag: "Surveys", tone: "bg-gradient-to-br from-cyan-300 to-sky-400 text-sky-950" },
  { icon: "play", title: "Watch videos", description: "Pick videos from the activity list and earn when they complete.", tag: "Videos", tone: "bg-gradient-to-br from-rose-400 to-orange-400 text-rose-950" },
  { icon: "tasks", title: "Complete offers", description: "Try apps, sign up for services and finish quick tasks.", tag: "Offers", tone: "bg-gradient-to-br from-yellow-300 to-lime-300 text-neutral-950" },
  { icon: "spin", title: "Spin to win", description: "Use SPIN to try the wheel for a chance at bonus rewards.", tag: "Spin", tone: "bg-gradient-to-br from-indigo-500 to-violet-500 text-white" },
  { icon: "users", title: "Invite friends", description: "Earn a referral credit when someone you invite qualifies.", tag: "Referrals", tone: "bg-gradient-to-r from-emerald-300 to-teal-300 text-emerald-950", box: "sm:col-span-2 lg:col-span-4" },
];

const steps = [
  { icon: "users", title: "Sign up", description: "Create a free VELOop account in a minute." },
  { icon: "game", title: "Pick activities", description: "Browse games, surveys, videos and offers open to you." },
  { icon: "wallet", title: "Collect rewards", description: "Credits land in your wallet and ledger once an activity is confirmed." },
  { icon: "trophy", title: "Cash out", description: "Request a withdrawal when you reach a payout's required VE balance." },
];

const currencies = [
  { code: "VE", note: "Main balance. Used for payout requirements.", tone: "from-yellow-300 to-amber-400 text-neutral-950" },
  { code: "SVE", note: "Secondary reward balance.", tone: "from-cyan-300 to-sky-400 text-sky-950" },
  { code: "GEM", note: "Collectible reward currency.", tone: "from-fuchsia-400 to-pink-500 text-white" },
  { code: "TOKEN", note: "Special activity reward.", tone: "from-emerald-300 to-teal-400 text-emerald-950" },
  { code: "SPIN", note: "Spend on the reward wheel.", tone: "from-violet-500 to-indigo-500 text-white" },
];

const faqs = [
  { question: "Is VELOop free to join?", answer: "Creating an account is free. Activities and rewards available to you are shown after you sign in." },
  { question: "How much can I earn?", answer: "It depends on the activities available to your account and what you complete. No earnings are guaranteed." },
  { question: "How do I get paid?", answer: "Request a withdrawal from an active payout option once you meet its required VE balance. Methods and requirements are shown in the withdrawal flow." },
  { question: "Can I track my withdrawal?", answer: "Yes. Each request shows its status in your withdrawal history, from pending and processing to final." },
  { question: "Are activities always available?", answer: "No. Availability varies by account and changes over time. The categories on this page are informational." },
];

const wheel = [
  { label: "VE", color: "#facc15" },
  { label: "GEM", color: "#ec4899" },
  { label: "SVE", color: "#22d3ee" },
  { label: "TOKEN", color: "#34d399" },
  { label: "SPIN", color: "#8b5cf6" },
  { label: "VE", color: "#fb923c" },
];

const iconArtwork = {
  play: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3z" /></>,
  survey: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  game: <><path d="M6 11h4m-2-2v4m7-1h.01M18 10h.01" /><path d="M6.5 7h11a4 4 0 0 1 3.9 4.9l-1.1 4.4a2 2 0 0 1-3.3 1l-2.1-1.8H9.1L7 17.3a2 2 0 0 1-3.3 1l-1.1-4.4A4 4 0 0 1 6.5 7Z" /></>,
  wallet: <><rect x="3" y="6" width="18" height="15" rx="3" /><path d="M3 10h18M16 15h2" /><path d="M6 6V4a1 1 0 0 1 1-1h11" /></>,
  tasks: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 3 3 5-6" /></>,
  spin: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" /><path d="M12 3v7M12 14v7M3 12h7M14 12h7" /></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  flame: <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9Z" />,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4v1a3 3 0 0 0 4 3M16 6h4v1a3 3 0 0 1-4 3M12 13v4M8 21h8M10 17h4" /></>,
};

function Icon({ name, className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {iconArtwork[name]}
    </svg>
  );
}

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300";
const display = { fontFamily: '"SF Pro Rounded", "Nunito", "Avenir Next Rounded", ui-rounded, "Segoe UI", system-ui, sans-serif' };
const glass = "bg-white/[0.04] ring-1 ring-white/10 backdrop-blur";
const ctaPrimary = `inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-6 text-sm font-extrabold text-neutral-950 shadow-[0_5px_0_0_#b8890b,0_18px_40px_-10px_rgba(250,204,21,0.55)] transition hover:-translate-y-0.5 hover:bg-yellow-200 active:translate-y-1 active:shadow-[0_1px_0_0_#b8890b] ${focus}`;

function SpinDemo() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const spin = () => {
    if (spinning) return;
    const next = rotation + 360 * 4 + Math.floor(Math.random() * 360);
    setSpinning(true);
    setRotation(next);
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      const under = (360 - (next % 360)) % 360;
      setResult(wheel[Math.floor(under / 60)].label);
      setSpinning(false);
    }, reduced ? 0 : 4000);
  };

  const gradient = `conic-gradient(${wheel.map((w, i) => `${w.color} ${i * 60}deg ${(i + 1) * 60}deg`).join(",")})`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-72 w-72 sm:h-80 sm:w-80">
        <div aria-hidden="true" className="absolute -top-3 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[22px] border-x-transparent border-t-white drop-shadow-lg" />
        <div
          className="veloop-wheel relative h-full w-full rounded-full border-[10px] border-white/90 shadow-[0_0_0_6px_rgba(255,255,255,0.08),0_30px_80px_-20px_rgba(236,72,153,0.6)]"
          style={{ background: gradient, transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4s cubic-bezier(.12,.7,.1,1)" : "none" }}
        >
          {wheel.map((w, i) => (
            <span key={i} aria-hidden="true" className="absolute inset-0 flex justify-center pt-6 text-sm font-black text-neutral-950" style={{ transform: `rotate(${i * 60 + 30}deg)` }}>
              {w.label}
            </span>
          ))}
        </div>
        <button onClick={spin} disabled={spinning} aria-label="Spin the demo wheel" className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-950 text-sm font-black text-yellow-300 ring-4 ring-white transition active:scale-95 disabled:opacity-80 ${focus}`}>
          {spinning ? "…" : "SPIN"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-8 min-h-12 max-w-xs text-center text-sm leading-6 text-indigo-100/80">
        {result ? <>The demo wheel landed on <b className="text-yellow-300">{result}</b>. Real spins use your SPIN balance after sign-in.</> : "Tap the center to try a demo spin. Demo only, nothing is awarded."}
      </p>
    </div>
  );
}

function Home() {
  return (
    <div style={display} className="min-h-screen overflow-x-clip bg-[#0c0a1f] text-white antialiased">
      <style>{`
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 80px; }
        @keyframes vl-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes vl-float { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
        @keyframes vl-fill { from { width: 0; } }
        @keyframes vl-shine { to { background-position: 200% center; } }
        .vl-hero > * { animation: vl-rise .6s ease-out both; }
        .vl-hero > *:nth-child(2) { animation-delay: .08s; }
        .vl-hero > *:nth-child(3) { animation-delay: .16s; }
        .vl-hero > *:nth-child(4) { animation-delay: .24s; }
        .vl-float { animation: vl-float 6s ease-in-out infinite; }
        .vl-xp { animation: vl-fill 1.3s .5s cubic-bezier(.2,.8,.2,1) both; }
        .vl-shine { background: linear-gradient(90deg,#fde047,#f472b6,#22d3ee,#fde047); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: vl-shine 6s linear infinite; }
        details > summary::-webkit-details-marker { display: none; }
        @media (prefers-reduced-motion: reduce) { .vl-hero > *, .vl-float, .vl-xp, .vl-shine { animation: none; } .vl-wheel { transition: none !important; } html { scroll-behavior: auto; } }
      `}</style>

      {/* ambient glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-pink-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0a1f]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 lg:px-8">
          <a href="/" className={`flex items-center gap-2 rounded-lg ${focus}`}>
            <BrandMark className="h-9 w-9 rounded-[10px]" />
            <span className="text-xl font-extrabold tracking-tight">VELOop<span className="text-yellow-300">.</span></span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10 lg:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`rounded-full px-3.5 py-2 text-sm font-semibold text-indigo-100/70 transition hover:bg-white/10 hover:text-white ${focus}`}>{l.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="/login" className={`hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-indigo-100/80 hover:text-white sm:block ${focus}`}>Log in</a>
            <a href="/register" className={`rounded-xl bg-yellow-300 px-5 py-2.5 text-sm font-extrabold text-neutral-950 transition hover:bg-yellow-200 active:scale-[0.97] ${focus}`}>Start earning</a>

            <details className="relative lg:hidden">
              <summary aria-label="Open menu" className={`flex h-10 w-10 cursor-pointer list-none flex-col items-center justify-center gap-1.5 rounded-xl bg-white/10 ring-1 ring-white/15 ${focus}`}>
                <span className="block h-0.5 w-4 rounded-sm bg-white" />
                <span className="block h-0.5 w-4 rounded-sm bg-white" />
                <span className="block h-0.5 w-4 rounded-sm bg-white" />
              </summary>
              <nav aria-label="Mobile" className="absolute right-0 top-12 grid w-[min(240px,calc(100vw-32px))] gap-1 rounded-2xl bg-[#17133a] p-2 shadow-2xl ring-1 ring-white/15">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} className="rounded-lg px-3 py-2.5 text-sm text-white hover:bg-white/10">{l.label}</a>
                ))}
                <a href="/login" className="rounded-lg px-3 py-2.5 text-sm font-bold text-yellow-300 hover:bg-white/10">Log in</a>
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section>
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="vl-hero max-w-xl">
              <h1 className="text-5xl font-black leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.5rem]">
                Get paid to <span className="vl-shine">play, survey and explore.</span>
              </h1>
              <p className="mt-6 max-w-md text-[17px] leading-8 text-indigo-100/75">
                Complete games, surveys, videos and offers. Collect rewards in your wallet and cash out when you reach a payout requirement.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="/register" className={ctaPrimary}>Start earning free <Icon name="arrow" className="h-4 w-4" /></a>
                <a href="#how-it-works" className={`inline-flex min-h-12 items-center justify-center rounded-2xl bg-white/5 px-6 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/10 ${focus}`}>See how it works</a>
              </div>
              <p className="mt-8 border-l-2 border-yellow-300 pl-4 text-xs leading-5 text-indigo-100/60">Activity availability varies by account. No earnings are guaranteed.</p>
            </div>

            {/* Player card */}
            <div role="img" aria-label="Illustration of a VELOop player card with level, streak and quests" className="relative mx-auto w-full max-w-[460px]">
              <div className="absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-br from-violet-500/40 via-pink-500/20 to-cyan-400/30 blur-2xl" />
              <div className={`${glass} rounded-[32px] bg-[#15113a]/80 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-400 text-lg font-black text-neutral-950 shadow-[0_4px_0_0_#b45309]">7</span>
                    <div>
                      <p className="text-sm font-extrabold">Level 7 explorer</p>
                      <p className="text-xs text-indigo-200/60">Sample player</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-neutral-950">•••• VE</span>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-[11px] font-bold text-indigo-200/70"><span>XP to next level</span><span>68%</span></div>
                  <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="vl-xp h-full w-[68%] rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500" />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold"><Icon name="flame" className="h-5 w-5 text-orange-400" />5 day streak</div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                      <span key={d} className={`h-5 w-5 rounded-full ${d < 5 ? "bg-gradient-to-br from-yellow-300 to-orange-400" : "bg-white/10"}`} />
                    ))}
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {[
                    { icon: "game", name: "Game milestone", p: "w-3/4", tone: "from-violet-500 to-fuchsia-500" },
                    { icon: "survey", name: "Quick survey", p: "w-1/3", tone: "from-cyan-300 to-sky-400" },
                    { icon: "tasks", name: "App offer", p: "w-1/2", tone: "from-yellow-300 to-lime-300" },
                  ].map((a) => (
                    <li key={a.name} className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${a.tone} text-neutral-950`}><Icon name={a.icon} className="h-5 w-5" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">{a.name}</p>
                        <div className="mt-1.5 h-1.5 rounded-full bg-white/10"><div className={`h-full rounded-full bg-gradient-to-r ${a.tone} ${a.p}`} /></div>
                      </div>
                      <span className="rounded-lg bg-yellow-300 px-2.5 py-1 text-xs font-black text-neutral-950">+•• VE</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-center text-[11px] text-indigo-200/50">Illustration with sample data</p>
              </div>

              <div className="vl-float absolute -bottom-6 -left-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-neutral-950 shadow-2xl sm:-left-10">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="check" className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs font-extrabold">Reward credited</p>
                  <p className="text-[11px] text-neutral-500">Illustration</p>
                </div>
              </div>
              <div className="vl-float absolute -right-2 -top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 shadow-xl sm:-right-6" style={{ animationDelay: "-2s" }}>
                <Icon name="trophy" className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* Ways to earn */}
        <section id="ways-to-earn">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
            <h2 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl">Six ways to earn, one account.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-indigo-100/70">Pick what fits your time. Mix and match whenever you like.</p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:auto-rows-[190px] lg:grid-cols-4">
              {earnCategories.map((c) => (
                <a key={c.title} href="/register" className={`group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-6 transition duration-300 hover:-translate-y-1.5 hover:rotate-[0.6deg] hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] ${c.tone} ${c.box || ""} ${focus}`}>
                  <Icon name={c.icon} className={`pointer-events-none absolute -bottom-6 -right-6 opacity-20 transition group-hover:scale-110 group-hover:rotate-6 ${c.big ? "h-64 w-64" : "h-32 w-32"}`} />
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/15"><Icon name={c.icon} className="h-6 w-6" /></span>
                    <span className="rounded-full bg-black/15 px-2.5 py-1 text-xs font-bold">{c.tag}</span>
                  </div>
                  <div className="relative">
                    <h3 className={`font-black tracking-tight ${c.big ? "text-3xl" : "text-lg"}`}>{c.title}</h3>
                    <p className={`mt-1.5 max-w-sm leading-6 opacity-85 ${c.big ? "text-base" : "text-sm"}`}>{c.description}</p>
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-5 text-sm text-indigo-100/50">Which categories are open depends on your account.</p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-24">
            <h2 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl">From sign-up to cash-out in four levels.</h2>
            <ol className="mt-14 grid gap-5 md:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className={`${glass} relative rounded-[26px] p-6 pt-10`}>
                  {i < steps.length - 1 && <span aria-hidden="true" className="absolute -right-4 top-1/2 hidden h-px w-4 border-t-2 border-dashed border-yellow-300/50 md:block" />}
                  <span className={`absolute -top-5 left-6 flex h-12 w-12 items-center justify-center rounded-2xl text-neutral-950 shadow-[0_4px_0_0_rgba(0,0,0,0.35)] ${i === 3 ? "bg-gradient-to-br from-yellow-300 to-orange-400" : "bg-gradient-to-br from-lime-300 to-emerald-400"}`}>
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <p className="text-xs font-bold text-yellow-300">Level {i + 1}</p>
                  <h3 className="mt-1 text-lg font-extrabold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-indigo-100/70">{s.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Spin */}
        <section id="spin">
          <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
            <div className="grid items-center gap-12 overflow-hidden rounded-[40px] bg-gradient-to-br from-violet-700/60 via-indigo-800/60 to-fuchsia-800/50 p-8 ring-1 ring-white/15 lg:grid-cols-2 lg:p-14">
              <div>
                <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Feeling lucky? Give the wheel a spin.</h2>
                <p className="mt-5 max-w-md text-base leading-7 text-indigo-100/80">Spend SPIN on the reward wheel for a chance at bonus rewards across your balances. Try the demo to see how it feels.</p>
                <a href="/register" className={`${ctaPrimary} mt-7`}>Create free account <Icon name="arrow" className="h-4 w-4" /></a>
              </div>
              <SpinDemo />
            </div>
          </div>
        </section>

        {/* Rewards / currencies */}
        <section id="rewards">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-24">
            <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">Five reward currencies, all in your wallet.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-indigo-100/70">Each activity can reward a different balance. Every credit is recorded in your ledger.</p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {currencies.map((c, i) => (
                <li key={c.code} className={`rounded-[24px] bg-gradient-to-br p-5 shadow-[0_6px_0_0_rgba(0,0,0,0.35)] transition hover:-translate-y-1 ${c.tone} ${i % 2 ? "lg:mt-6" : ""}`}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/15 text-xs font-black">{c.code[0]}</span>
                  <p className="mt-6 text-2xl font-black tracking-tight">{c.code}</p>
                  <p className="mt-1.5 text-sm leading-5 opacity-85">{c.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-indigo-100/50">Currency roles shown are a summary. Live balances appear after you sign in.</p>
          </div>
        </section>

        {/* Payouts */}
        <section id="payouts">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Cash out when you're ready.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-indigo-100/70">Payout methods, values and required VE balances are set by VELOop. Sign in to see what applies to you, then submit a request and follow it to completion.</p>
              <a href="/register" className={`${ctaPrimary} mt-7`}>Create free account <Icon name="arrow" className="h-4 w-4" /></a>
            </div>

            <div className={`${glass} rounded-[30px] p-6`}>
              <p className="text-sm font-extrabold">Your withdrawal, step by step</p>
              <ul className="mt-4 space-y-3">
                {[
                  { title: "Choose a payout option", detail: "Active methods are listed with their requirements" },
                  { title: "Meet the VE requirement", detail: "Shown next to each option" },
                  { title: "Submit and track", detail: "Pending, processing, then final status" },
                ].map((item) => (
                  <li key={item.title} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lime-300 to-emerald-400 text-neutral-950"><Icon name="check" className="h-4 w-4" /></span>
                    <div>
                      <p className="text-sm font-bold">{item.title}</p>
                      <p className="text-xs text-indigo-100/60">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-indigo-100/50">No payout amounts or live availability are shown on this page.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
            <h2 className="text-center text-4xl font-black tracking-tight">Questions, answered.</h2>
            <div className="mt-10 space-y-3">
              {faqs.map((item) => (
                <details key={item.question} className={`${glass} group rounded-2xl px-5 py-4 open:bg-white/[0.08]`}>
                  <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded text-left text-[15px] font-bold ${focus}`}>
                    {item.question}
                    <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-300 font-black text-neutral-950 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 pr-10 text-sm leading-6 text-indigo-100/70">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-20 lg:px-8">
          <div className="relative mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-[40px] bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-400 px-6 py-16 text-center text-neutral-950">
            <Icon name="trophy" aria-hidden="true" className="pointer-events-none absolute -left-6 -top-6 h-40 w-40 -rotate-12 opacity-15" />
            <Icon name="game" aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-4 h-48 w-48 rotate-12 opacity-15" />
            <h2 className="relative max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">Your next reward is a few taps away.</h2>
            <p className="relative mt-4 max-w-md text-base leading-7 text-neutral-800">Join VELOop, browse the activities open to you and start collecting.</p>
            <a href="/register" className={`relative mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-neutral-950 px-6 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0 ${focus}`}>
              Start earning free <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <BrandMark className="h-7 w-7 rounded-lg" />
              <span className="font-extrabold">VELOop</span>
            </div>
            <p className="mt-2 text-sm text-indigo-100/60">Get paid to play, survey and explore.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-indigo-100/60">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-white">{l.label}</a>
            ))}
            <a href="/login" className="hover:text-white">Log in</a>
            <a href="/register" className="hover:text-white">Register</a>
          </nav>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-indigo-100/40 lg:px-8">© {new Date().getFullYear()} VELOop. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default Home;