import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design tokens ──────────────────────────────────────────────────────────
// Flat, dark base + one accent. No gradients, no glow, no particle canvas.
const T = {
  bg: "#0a0a0a",
  surface: "#131313",
  surface2: "#1a1a1a",
  border: "#262626",
  borderStrong: "#3a3a3a",
  text: "#f2f2ee",
  dim: "#9a9a90",
  faint: "#68685f",
  accent: "#f2a71b",
  accentText: "#1a1204",
  danger: "#e0524f",
};
const FONT_DISPLAY = "'Space Grotesk', sans-serif";
const FONT_BODY = "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

// ─── Utility ───────────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ─── REAL DATA ─────────────────────────────────────────────────────────────
const CREATOR_PHOTO = "https://raw.githubusercontent.com/SubhraS-G/Subhra-Gaming/main/CP.jpeg";

const VIDEOS = [
  { id:"mfw40lh15dk", title:"We Survived Odisha's Wildest Waterfall Trek… | VLOG #1",             views:"271", category:"VLOG",    url:"https://youtu.be/mfw40lh15dk" },
  { id:"OmYKZEJbxno", title:"I Love Roasting | Omegle - 3 | Subhra Gaming",                       views:"625", category:"OMEGLE",  url:"https://youtu.be/OmYKZEJbxno" },
  { id:"EXq-7uORlP8", title:"I Wasn't Ready for Balasore Street Food 😱 | Street Food Tour",       views:"357", category:"VLOG",    url:"https://youtu.be/EXq-7uORlP8" },
  { id:"bGAaBUFbNts", title:"Getting Skipped Is An Art | Omegle | Subhra Gaming",                  views:"737", category:"OMEGLE",  url:"https://youtu.be/bGAaBUFbNts" },
  { id:"i6LgUaOmeIM", title:"3 Underrated Games That Run Smooth on Low End PC",                    views:"67",  category:"GAMING",  url:"https://youtu.be/i6LgUaOmeIM" },
  { id:"hcfSaDQkWrM", title:"I Started Game Development From Scratch - Week 1 Results",            views:"30",  category:"GAMEDEV", url:"https://youtu.be/hcfSaDQkWrM" },
];

const STATS = [
  { label:"YouTube subscribers",  value:785, suffix:"+" },
  { label:"Avg views per video",  value:400, suffix:"+" },
  { label:"Engagement rate",      value:8,   suffix:".9%" },
  { label:"Live avg viewers",     value:64,  suffix:"+" },
];

const GEAR = [
  { name:"Gaming laptop", model:"MSI GF63 Thin 11UC",         specs:"i5-11260H @ 2.60GHz · 16GB RAM · RTX 3050 4GB" },
  { name:"Mouse",         model:"Lapcare RAPIDO Gaming Mouse", specs:"2400 DPI · Wired · Ergonomic design" },
  { name:"Keyboard",      model:"Lapcare RAPIDO Gaming KB",    specs:"RGB backlit · Anti-ghosting · Membrane" },
  { name:"Headset",       model:"boAt BassHeads 100",          specs:"10mm driver · HD sound · 3.5mm jack" },
  { name:"Cooling pad",   model:"Lapcare Chillmate",           specs:"Powerful fan · Silent · Ergonomic lift" },
];

const PARTNERSHIPS = [
  { name:"ExitLag",      role:"Latency optimization partner" },
  { name:"TipsOnStream", role:"Streaming tools partner" },
];

const SOCIALS = [
  { label:"YouTube",     handle:"@SubhraGaming69",   url:"https://youtube.com/@SubhraGaming69" },
  { label:"Instagram",   handle:"@wao._.subhra",     url:"https://instagram.com/wao._.subhra" },
  { label:"Discord",     handle:"We Are One",        url:"https://discord.com/invite/G7Qy28swPN" },
  { label:"Twitter / X", handle:"@samalsubhrajit1",  url:"https://x.com/samalsubhrajit1" },
];

const LIVE_URL      = "https://www.youtube.com/live/ZdAlAl4zLD0";
const CHANNEL_URL   = "https://youtube.com/@SubhraGaming69";
const CONTACT_EMAIL = "profession.subhra@gmail.com";

// slug must match the VALID_PROJECTS set on the ratings API backend.
const PROJECTS = [
  {
    slug: "glitch-runner",
    title: "GLITCH RUNNER",
    tagline: "Cyberpunk endless runner — dodge, collect, survive.",
    tech: ["HTML5 Canvas", "Vanilla JS"],
    playUrl: "https://subhras-g.github.io/Glitch-Runner",
    githubUrl: "https://github.com/SubhraS-G/Glitch-Runner",
  },
  {
    slug: "top-down-shooter",
    title: "TOP DOWN SHOOTER",
    tagline: "Cyberpunk 2D shooter with wave-based enemy AI, built from scratch.",
    tech: ["Unity 6", "C#"],
    playUrl: null,
    githubUrl: "https://github.com/SubhraS-G/Top-Down-Shooter",
  },
  {
    slug: "skill-issue",
    title: "SKILL ISSUE",
    tagline: "A troll platformer designed to destroy your confidence.",
    tech: ["Unity 6", "C#"],
    playUrl: "https://subhras-g.itch.io/skill-issue",
    githubUrl: "https://github.com/SubhraS-G/SKILL-ISSUE",
  },
  {
    slug: "suga-blaze",
    title: "SuGa BLAZE",
    tagline: "3D endless runner — zero Unity 3D experience to shipped in 22 days.",
    tech: ["Unity 6", "C#"],
    playUrl: null,
    githubUrl: "https://github.com/SubhraS-G/SuGa-BLAZE",
  },
];

const RATINGS_API_BASE = import.meta.env.VITE_RATINGS_API_BASE || "http://localhost:4123";
const ytThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

// ─── Global styles ──────────────────────────────────────────────────────────
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');
      *{box-sizing:border-box}
      html{scroll-behavior:smooth}
      body{margin:0;background:${T.bg};color:${T.text};font-family:${FONT_BODY}}
      ::-webkit-scrollbar{width:4px}
      ::-webkit-scrollbar-track{background:${T.bg}}
      ::-webkit-scrollbar-thumb{background:${T.borderStrong};border-radius:2px}
      @keyframes livePulse{0%,100%{opacity:1}50%{opacity:0.4}}
      body.custom-cursor, body.custom-cursor *{cursor:none}
      body.custom-cursor input, body.custom-cursor textarea{cursor:text}
      .cursor-ring{transition:width 0.25s,height 0.25s,margin 0.25s,background-color 0.25s,border-color 0.25s}
      .cursor-ring.hov{width:60px;height:60px;margin-left:-30px;margin-top:-30px;background:rgba(242,167,27,0.1)}
    `}</style>
  );
}

// ─── Loader ─────────────────────────────────────────────────────────────────
// A greeting-cycle intro instead of a plain percentage bar — gamer flavored.
const LOADER_WORDS = ["LOADING SAVE FILE…", "SPAWNING PLAYER…", "GG"];
function Loader({ done }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (i < LOADER_WORDS.length - 1) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 480);
      return () => clearTimeout(t);
    }
  }, [i]);

  useEffect(() => {
    if (visible || i >= LOADER_WORDS.length - 1) return;
    const t = setTimeout(() => setI(n => n + 1), 160);
    return () => clearTimeout(t);
  }, [visible, i]);

  useEffect(() => {
    if (i !== LOADER_WORDS.length - 1) return;
    const t1 = setTimeout(() => setExiting(true), 600);
    const t2 = setTimeout(done, 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [i, done]);

  return (
    <div style={{ background:T.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT_DISPLAY, color:T.text, overflow:"hidden" }}>
      <GlobalStyle />
      <div style={{
        fontSize:"clamp(22px,5vw,42px)", fontWeight:700, letterSpacing:1, textAlign:"center",
        opacity: (visible && !exiting) ? 1 : 0,
        transform: exiting ? "translateY(-28px)" : (visible ? "translateY(0)" : "translateY(14px)"),
        transition:"opacity 0.28s, transform 0.35s cubic-bezier(.16,1,.3,1)",
      }}>
        {LOADER_WORDS[i]}
      </div>
    </div>
  );
}

// ─── Scroll progress bar ────────────────────────────────────────────────────
function ScrollBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => {
      const s = document.documentElement;
      const max = s.scrollHeight - s.clientHeight;
      setP(max > 0 ? (s.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return <div style={{ position:"fixed", top:0, left:0, height:2, width:`${p}%`, background:T.accent, zIndex:1001, transition:"width 0.1s" }} />;
}

// ─── Custom cursor ──────────────────────────────────────────────────────────
// Desktop only (pointer: fine) — never breaks touch devices, which never
// enable it and keep their normal system cursor.
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState("");
  const pos = useRef({ x:-100, y:-100 });
  const ring = useRef({ x:-100, y:-100 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("custom-cursor");

    const move = e => {
      pos.current = { x:e.clientX, y:e.clientY };
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`;
    };
    window.addEventListener("mousemove", move);

    let raf;
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.current.x}px,${ring.current.y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onOver = e => {
      const t = e.target.closest("[data-cursor]");
      if (!t) return;
      setLabel(t.dataset.cursor || "");
      ringRef.current?.classList.add("hov");
    };
    const onOut = e => {
      const t = e.target.closest("[data-cursor]");
      if (!t) return;
      setLabel("");
      ringRef.current?.classList.remove("hov");
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{ position:"fixed", top:0, left:0, width:6, height:6, borderRadius:"50%", background:T.accent, pointerEvents:"none", zIndex:10000 }} />
      <div ref={ringRef} className="cursor-ring" style={{ position:"fixed", top:0, left:0, width:34, height:34, borderRadius:"50%", border:`1px solid ${T.accent}`, pointerEvents:"none", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {label && <span style={{ fontSize:9, fontWeight:500, color:T.accent, letterSpacing:1, whiteSpace:"nowrap" }}>{label}</span>}
      </div>
    </>
  );
}

// A small magnetic pull toward the cursor for buttons — desktop only.
function useMagnetic(strength = 14) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const move = e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
    };
    const leave = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength]);
  return ref;
}

// ─── Nav ────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"about",  label:"About" },
  { id:"plays",  label:"Plays" },
  { id:"builds", label:"Builds" },
  { id:"setup",  label:"Setup" },
  { id:"collab", label:"Collab" },
  { id:"contact",label:"Contact" },
];
function Nav({ logoClicks, onLogo }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scroll = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, padding:"16px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", background:scrolled?T.bg:"transparent", borderBottom:scrolled?`1px solid ${T.border}`:"1px solid transparent", transition:"all 0.3s" }}>
      <button onClick={onLogo} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:15, color:logoClicks>=5?T.accent:T.text, letterSpacing:1 }}>
        SUBHRA GAMING
      </button>
      <div style={{ display:"flex", gap:26 }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => scroll(n.id)} style={{ background:"none", border:"none", cursor:"pointer", color:T.dim, fontSize:13, transition:"color 0.2s" }}
            onMouseEnter={e=>e.target.style.color=T.text} onMouseLeave={e=>e.target.style.color=T.dim}>{n.label}</button>
        ))}
      </div>
    </nav>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function Counter({ end, suffix = "", duration = 1400 }) {
  const [v, setV] = useState(0);
  const [ref, vis] = useReveal(0.5);
  useEffect(() => {
    if (!vis) return;
    let start = null;
    const step = ts => { if (!start) start = ts; const prog = Math.min((ts-start)/duration,1); setV(Math.floor(prog*end)); if (prog<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [vis, end, duration]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

function Button({ children, primary, onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  const magRef = useMagnetic(10);
  return (
    <button ref={magRef} onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      data-cursor=""
      style={{ padding:"12px 26px", borderRadius:4, cursor:"pointer", fontSize:13, fontWeight:500, letterSpacing:0.5,
        background: primary ? T.accent : "transparent",
        color: primary ? T.accentText : (hov ? T.text : T.dim),
        border: primary ? "none" : `1px solid ${hov ? T.borderStrong : T.border}`,
        transition:"background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s ease-out", ...style }}>
      {children}
    </button>
  );
}

function SectionHead({ label, title, sub }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ marginBottom:56, opacity:vis?1:0, transform:vis?"none":"translateY(20px)", transition:"all 0.6s" }}>
      <div style={{ fontSize:12, letterSpacing:3, color:T.accent, marginBottom:12 }}>{label}</div>
      <h2 style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:"clamp(28px,4vw,44px)", color:T.text, margin:"0 0 14px" }}>{title}</h2>
      {sub && <p style={{ color:T.dim, maxWidth:520, margin:0, lineHeight:1.7, fontSize:15 }}>{sub}</p>}
    </div>
  );
}

function Tag({ children }) {
  return <span style={{ border:`1px solid ${T.border}`, color:T.dim, fontSize:12, padding:"5px 12px", borderRadius:4 }}>{children}</span>;
}

// Masked line-wipe reveal — used for the hero headline.
function RevealLine({ children, show, delay = 0 }) {
  return (
    <div style={{ overflow:"hidden" }}>
      <div style={{ transform: show ? "translateY(0)" : "translateY(115%)", transition:`transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
        {children}
      </div>
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setShow(true),300); return ()=>clearTimeout(t); }, []);
  const scroll = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  return (
    <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"120px 40px 60px", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:28, opacity:show?1:0, transition:"opacity 0.6s 0.1s" }}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:T.danger, display:"inline-block", animation:"livePulse 2s infinite" }} />
        <span style={{ fontSize:12, color:T.dim, letterSpacing:1 }}>GAMING CONTENT CREATOR · VALORANT STREAMER</span>
      </div>
      <h1 style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:"clamp(48px,9vw,120px)", lineHeight:0.95, letterSpacing:"-2px", color:T.text, margin:"0 0 24px" }}>
        <RevealLine show={show} delay={100}>SUBHRA</RevealLine>
        <RevealLine show={show} delay={220}>GAMING</RevealLine>
      </h1>
      <p style={{ fontSize:"clamp(16px,2vw,20px)", color:T.dim, maxWidth:560, lineHeight:1.6, marginBottom:36, opacity:show?1:0, transform:show?"none":"translateY(20px)", transition:"all 0.7s 0.3s" }}>
        Content creator and streamer around VALORANT, Minecraft, and BGMI — and the developer shipping the games behind #100DaysOfCode.
      </p>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", opacity:show?1:0, transform:show?"none":"translateY(20px)", transition:"all 0.7s 0.45s" }}>
        <Button primary onClick={()=>window.open(CHANNEL_URL,"_blank")}>Watch videos</Button>
        <Button onClick={()=>scroll("contact")}>Work with me</Button>
      </div>
      <div style={{ marginTop:80, fontSize:11, letterSpacing:2, color:T.faint, opacity:show?1:0, transition:"opacity 1s 0.8s" }}>
        SCROLL TO EXPLORE ↓
      </div>
    </section>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────────────────────
function About() {
  const [ref, vis] = useReveal();
  return (
    <section id="about" style={{ padding:"100px 40px", maxWidth:1100, margin:"0 auto" }}>
      <SectionHead label="// WHO I AM" title="About" />
      <div ref={ref} style={{ display:"grid", gridTemplateColumns:"1fr 1.3fr", gap:60, alignItems:"center", opacity:vis?1:0, transform:vis?"none":"translateY(30px)", transition:"all 0.7s" }}>
        <div style={{ display:"flex", justifyContent:"center" }}>
          <div style={{ width:280, height:360, borderRadius:8, overflow:"hidden", border:`1px solid ${T.border}`, position:"relative" }}>
            <img
              src={CREATOR_PHOTO}
              alt="Subhra — gaming content creator"
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }}
              onError={e => { e.target.style.display = "none"; if (e.target.nextSibling) e.target.nextSibling.style.display = "flex"; }}
            />
            <div style={{ display:"none", position:"absolute", inset:0, flexDirection:"column", alignItems:"center", justifyContent:"center", background:T.surface, color:T.faint, fontSize:13 }}>
              Photo unavailable
            </div>
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:22, color:T.text, marginBottom:18 }}>Hi, I'm Subhra</h3>
          <p style={{ color:T.dim, lineHeight:1.8, marginBottom:16, fontSize:15 }}>
            A gaming content creator and live streamer focused on competitive gameplay, entertaining moments, and interactive live streams.
          </p>
          <p style={{ color:T.dim, lineHeight:1.8, marginBottom:16, fontSize:15 }}>
            I create content around titles like VALORANT, Minecraft, BGMI, and other fun multiplayer games — plus vlogs, Omegle reactions, and game dev diaries.
          </p>
          <p style={{ color:T.dim, lineHeight:1.8, marginBottom:24, fontSize:15 }}>
            My goal is to build a gaming community where viewers feel entertained, engaged, and part of the experience.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:28 }}>
            {["VALORANT","Minecraft","BGMI","Game Dev","Vlogs","Omegle"].map(t => <Tag key={t}>{t}</Tag>)}
          </div>
          <Button primary onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>Get in touch</Button>
        </div>
      </div>
    </section>
  );
}

// ─── STAR RATING ────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readOnly = false, size = 18 }) {
  const [hoverVal, setHoverVal] = useState(0);
  const display = readOnly ? value : (hoverVal || value);
  return (
    <div style={{ display:"inline-flex", gap:2 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n}
          onClick={readOnly ? undefined : () => onChange(n)}
          onMouseEnter={readOnly ? undefined : () => setHoverVal(n)}
          onMouseLeave={readOnly ? undefined : () => setHoverVal(0)}
          style={{ fontSize:size, cursor:readOnly?"default":"pointer", color:n<=display?T.accent:T.border, transition:"color 0.15s", lineHeight:1 }}>★</span>
      ))}
    </div>
  );
}

// ─── PROJECT RATINGS & COMMENTS (live, backed by the ratings API) ─────────
function ProjectRatings({ slug }) {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("loading");
  const [form, setForm] = useState({ name:"", rating:0, comment:"" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    fetch(`${RATINGS_API_BASE}/api/projects/${slug}/ratings`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setRatings(data.ratings || []); setAverage(data.average || 0); setCount(data.count || 0); setStatus("ready"); })
      .catch(() => setStatus("offline"));
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const submit = () => {
    if (!form.rating) { setError("Pick a star rating first."); return; }
    if (!form.comment.trim()) { setError("Add a short comment."); return; }
    setError("");
    setSubmitting(true);
    fetch(`${RATINGS_API_BASE}/api/projects/${slug}/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(r => r.json().then(data => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) { setError(data.error || "Couldn't submit. Try again."); return; }
        setRatings(data.ratings); setAverage(data.average); setCount(data.count);
        setForm({ name:"", rating:0, comment:"" }); setShowForm(false);
      })
      .catch(() => setError("Couldn't reach the ratings server."))
      .finally(() => setSubmitting(false));
  };

  if (status === "offline") {
    return <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${T.border}`, fontSize:12, color:T.faint }}>Ratings are temporarily unavailable.</div>;
  }

  return (
    <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <StarRating value={Math.round(average)} readOnly size={14} />
        <span style={{ fontSize:13, color:T.dim }}>
          {status === "loading" ? "Loading…" : count > 0 ? `${average} (${count} ${count===1?"rating":"ratings"})` : "No ratings yet — be the first"}
        </span>
      </div>

      {ratings.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12, maxHeight:140, overflowY:"auto" }}>
          {ratings.map(r => (
            <div key={r.id} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:6, padding:"8px 12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:12, color:T.text, fontWeight:500 }}>{r.name}</span>
                <StarRating value={r.rating} readOnly size={11} />
              </div>
              <p style={{ margin:0, fontSize:13, color:T.dim, lineHeight:1.5 }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:4, padding:"6px 14px", fontSize:12, color:T.accent, cursor:"pointer" }}>
          Rate this project
        </button>
      ) : (
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:6, padding:12 }}>
          <div style={{ marginBottom:10 }}>
            <StarRating value={form.rating} onChange={n => setForm(f => ({...f, rating:n}))} size={20} />
          </div>
          <input placeholder="Your name (optional)" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))}
            style={{ width:"100%", background:T.bg, border:`1px solid ${T.border}`, borderRadius:4, padding:"8px 10px", color:T.text, fontSize:13, outline:"none", marginBottom:8, boxSizing:"border-box" }} />
          <textarea placeholder="What did you think?" rows={2} value={form.comment} onChange={e => setForm(f => ({...f, comment:e.target.value}))}
            style={{ width:"100%", background:T.bg, border:`1px solid ${T.border}`, borderRadius:4, padding:"8px 10px", color:T.text, fontSize:13, outline:"none", resize:"vertical", marginBottom:8, boxSizing:"border-box" }} />
          {error && <div style={{ color:T.danger, fontSize:12, marginBottom:8 }}>{error}</div>}
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={submit} disabled={submitting}
              style={{ background:T.accent, border:"none", borderRadius:4, padding:"7px 16px", fontSize:12, color:T.accentText, fontWeight:500, cursor:submitting?"default":"pointer", opacity:submitting?0.6:1 }}>
              {submitting ? "Sending…" : "Submit"}
            </button>
            <button onClick={() => { setShowForm(false); setError(""); }}
              style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:4, padding:"7px 16px", fontSize:12, color:T.dim, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BUILDS (game dev projects) ─────────────────────────────────────────────
function ProjectCard({ project, delay }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} data-cursor="VIEW" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:T.surface, borderRadius:8, padding:"24px 22px", border:`1px solid ${hov?T.borderStrong:T.border}`, transform:hov?"translateY(-3px)":"none", transition:"all 0.25s", opacity:vis?1:0, transitionDelay:`${delay}ms` }}>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        {project.tech.map(t => <Tag key={t}>{t}</Tag>)}
      </div>
      <h4 style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:17, color:T.text, margin:"0 0 8px" }}>{project.title}</h4>
      <p style={{ color:T.dim, fontSize:14, lineHeight:1.6, margin:"0 0 16px" }}>{project.tagline}</p>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {project.playUrl && <Button primary onClick={()=>window.open(project.playUrl,"_blank")}>Play</Button>}
        <Button onClick={()=>window.open(project.githubUrl,"_blank")}>Source ↗</Button>
      </div>
      <ProjectRatings slug={project.slug} />
    </div>
  );
}

function Builds() {
  return (
    <section id="builds" style={{ padding:"100px 40px", maxWidth:1200, margin:"0 auto" }}>
      <SectionHead label="// #100DAYSOFCODE" title="Builds" sub="Games I shipped from scratch — no templates, no pre-made scripts. Rate them or drop a comment." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
        {PROJECTS.map((p,i) => <ProjectCard key={p.slug} project={p} delay={i*60} />)}
      </div>
    </section>
  );
}

// ─── PLAYS (content + live) ─────────────────────────────────────────────────
function VideoCard({ id, title, views, category, url, delay }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} data-cursor="WATCH" onClick={()=>window.open(url,"_blank")} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:T.surface, borderRadius:8, overflow:"hidden", cursor:"pointer", border:`1px solid ${hov?T.borderStrong:T.border}`, transform:hov?"translateY(-3px)":"none", transition:"all 0.25s", opacity:vis?1:0, transitionDelay:`${delay}ms` }}>
      <div style={{ height:170, overflow:"hidden", position:"relative" }}>
        <img src={ytThumb(id)} alt={title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        <div style={{ position:"absolute", top:10, left:10, background:T.bg, border:`1px solid ${T.border}`, borderRadius:4, padding:"3px 10px", fontSize:10, color:T.dim, letterSpacing:1 }}>{category}</div>
      </div>
      <div style={{ padding:"14px 16px" }}>
        <h4 style={{ fontSize:13, color:T.text, margin:"0 0 10px", lineHeight:1.5, fontWeight:500, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{title}</h4>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:12, color:T.faint }}>{views} views</span>
          <Button onClick={()=>window.open(url,"_blank")} style={{ padding:"5px 12px", fontSize:11 }}>Watch</Button>
        </div>
      </div>
    </div>
  );
}

function Plays() {
  const [ref, vis] = useReveal();
  return (
    <section id="plays" style={{ padding:"100px 40px", background:T.surface }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionHead label="// STREAMING & CONTENT" title="Plays" sub="Vlogs, gaming moments, Omegle reactions, and live VALORANT streams." />

        <div ref={ref} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:24, opacity:vis?1:0, transform:vis?"none":"translateY(20px)", transition:"all 0.6s" }}>
          <div style={{ height:280, position:"relative", background:"#000" }}>
            <img src="https://img.youtube.com/vi/ZdAlAl4zLD0/maxresdefault.jpg" alt="Subhra Gaming live"
              style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.55 }} onError={e=>{ e.target.style.opacity=0; }} />
            <div style={{ position:"absolute", top:14, left:14, display:"flex", alignItems:"center", gap:6, background:T.danger, borderRadius:4, padding:"4px 10px" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#fff", animation:"livePulse 2s infinite" }} />
              <span style={{ fontSize:11, color:"#fff", fontWeight:700, letterSpacing:1 }}>LIVE ON YOUTUBE</span>
            </div>
            <div style={{ position:"absolute", bottom:14, left:14, background:T.bg, borderRadius:4, padding:"4px 10px", fontSize:11, color:T.dim }}>~64 avg viewers</div>
          </div>
          <div style={{ padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontSize:14, color:T.text, fontWeight:500, marginBottom:4 }}>VALORANT — ranked grind & chill streams</div>
              <p style={{ color:T.faint, fontSize:13, margin:0 }}>Ranked grind Mon & Wed 8 PM IST · chill streams Fri & Sat 9 PM IST</p>
            </div>
            <Button primary onClick={()=>window.open(LIVE_URL,"_blank")}>Watch live</Button>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:20 }}>
          {VIDEOS.map((v,i) => <VideoCard key={v.id} {...v} delay={i*60} />)}
        </div>
        <div style={{ textAlign:"center", marginTop:36 }}>
          <Button primary onClick={()=>window.open(CHANNEL_URL,"_blank")}>View all videos</Button>
        </div>
      </div>
    </section>
  );
}

// ─── SETUP ─────────────────────────────────────────────────────────────────
function Setup() {
  return (
    <section id="setup" style={{ padding:"100px 40px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionHead label="// MY GEAR" title="Setup" sub="The real tools powering every stream and video." />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
          {GEAR.map((g,i) => {
            const [ref, vis] = useReveal(0.05);
            return (
              <div ref={ref} key={g.name} style={{ background:T.surface, borderRadius:8, padding:"22px 20px", border:`1px solid ${T.border}`, opacity:vis?1:0, transitionDelay:`${i*60}ms`, transition:"opacity 0.5s" }}>
                <div style={{ fontSize:11, color:T.accent, letterSpacing:1, marginBottom:8 }}>{g.name.toUpperCase()}</div>
                <div style={{ fontSize:14, color:T.text, marginBottom:8, fontWeight:500 }}>{g.model}</div>
                <div style={{ fontSize:13, color:T.faint, lineHeight:1.6 }}>{g.specs}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── COLLAB ────────────────────────────────────────────────────────────────
function Collab() {
  const [ref, vis] = useReveal();
  return (
    <section id="collab" style={{ padding:"100px 40px", background:T.surface }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionHead label="// PARTNERSHIPS" title="Collab" sub="Reach a passionate gaming audience through authentic content and brand integration." />
        <div ref={ref} style={{ opacity:vis?1:0, transition:"all 0.7s" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:48 }}>
            {STATS.map(s=>(
              <div key={s.label} style={{ background:T.bg, borderRadius:8, padding:"24px 20px", textAlign:"center", border:`1px solid ${T.border}` }}>
                <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:30, color:T.accent, marginBottom:8 }}>
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize:12, color:T.dim }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
            <div style={{ background:T.bg, borderRadius:8, padding:"28px", border:`1px solid ${T.border}` }}>
              <h3 style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:14, color:T.text, marginBottom:20, letterSpacing:0.5 }}>OPEN TO COLLABORATIONS</h3>
              {["Sponsored streams","Gaming product reviews","Brand integrations","Affiliate partnerships","Shoutouts & social posts","Giveaway collaborations"].map(item=>(
                <div key={item} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <span style={{ color:T.accent, fontSize:12 }}>◆</span>
                  <span style={{ fontSize:14, color:T.dim }}>{item}</span>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:14, color:T.text, marginBottom:20, letterSpacing:0.5 }}>PARTNERED WITH</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
                {PARTNERSHIPS.map(p => (
                  <div key={p.name} style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:8, padding:"18px 20px" }}>
                    <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:16, color:T.text }}>{p.name}</div>
                    <div style={{ fontSize:12, color:T.faint, marginTop:4 }}>{p.role}</div>
                  </div>
                ))}
              </div>
              <Button primary style={{ width:"100%", padding:"14px" }} onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>
                Contact for collaborations
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL ────────────────────────────────────────────────────────────────
function Social() {
  return (
    <section style={{ padding:"80px 40px" }}>
      <SectionHead label="// CONNECT" title="Find me online" />
      <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:16, maxWidth:900, margin:"0 auto" }}>
        {SOCIALS.map(s => (
          <div key={s.label} data-cursor="OPEN" onClick={()=>window.open(s.url,"_blank")}
            style={{ flex:"1 1 180px", background:T.surface, borderRadius:8, padding:"26px 20px", textAlign:"center", cursor:"pointer", border:`1px solid ${T.border}`, transition:"border-color 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderStrong} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
            <div style={{ fontSize:14, color:T.text, marginBottom:6, fontWeight:500 }}>{s.label}</div>
            <div style={{ fontSize:12, color:T.faint }}>{s.handle}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ───────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name:"", email:"", brand:"", message:"" });
  const [sent, setSent] = useState(false);
  const [ref, vis] = useReveal();

  const submit = () => {
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(`Collaboration request from ${form.name}${form.brand?" – "+form.brand:""}`);
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nBrand/Company: ${form.brand||"N/A"}\n\nMessage:\n${form.message}`);
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name:"", email:"", brand:"", message:"" });
  };

  const inputStyle = { width:"100%", background:T.bg, border:`1px solid ${T.border}`, borderRadius:6, padding:"13px 15px", color:T.text, fontSize:14, outline:"none", transition:"border-color 0.2s", boxSizing:"border-box" };

  return (
    <section id="contact" style={{ padding:"100px 40px" }}>
      <div style={{ maxWidth:640, margin:"0 auto" }}>
        <SectionHead label="// GET IN TOUCH" title="Collaborate" sub="Reach out for collaborations, sponsorships, or partnerships." />
        <div ref={ref} style={{ opacity:vis?1:0, transform:vis?"none":"translateY(20px)", transition:"all 0.6s" }}>
          {sent ? (
            <div style={{ textAlign:"center", padding:"52px 40px", background:T.surface, border:`1px solid ${T.accent}`, borderRadius:8 }}>
              <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:16, color:T.accent, marginBottom:10 }}>Email client opened</div>
              <p style={{ color:T.dim, fontSize:14, margin:0 }}>Your message was loaded in your email app. Send it to reach Subhra — response within 24–48 hours.</p>
            </div>
          ) : (
            <div style={{ background:T.surface, borderRadius:8, padding:"32px", border:`1px solid ${T.border}` }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                {[["name","Your name","text"],["email","Your email","email"]].map(([k,ph,t])=>(
                  <input key={k} type={t} placeholder={ph} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                    style={inputStyle} onFocus={e=>e.target.style.borderColor=T.borderStrong} onBlur={e=>e.target.style.borderColor=T.border} />
                ))}
              </div>
              <input placeholder="Brand / company (optional)" value={form.brand} onChange={e=>setForm(p=>({...p,brand:e.target.value}))}
                style={{...inputStyle, marginBottom:14}} onFocus={e=>e.target.style.borderColor=T.borderStrong} onBlur={e=>e.target.style.borderColor=T.border} />
              <textarea placeholder="Your message..." value={form.message} rows={5} onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                style={{...inputStyle, resize:"vertical", marginBottom:20}} onFocus={e=>e.target.style.borderColor=T.borderStrong} onBlur={e=>e.target.style.borderColor=T.border} />
              <Button primary style={{ width:"100%", padding:"14px" }} onClick={submit}>Send collaboration request</Button>
              <p style={{ textAlign:"center", fontSize:13, color:T.faint, marginTop:16 }}>
                Or email directly: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color:T.accent, textDecoration:"none" }}>{CONTACT_EMAIL}</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding:"40px", borderTop:`1px solid ${T.border}`, textAlign:"center" }}>
      <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:16, color:T.text, marginBottom:16 }}>SUBHRA GAMING</div>
      <div style={{ display:"flex", gap:20, justifyContent:"center", marginBottom:20, flexWrap:"wrap" }}>
        {SOCIALS.map(s=>(
          <button key={s.label} onClick={()=>window.open(s.url,"_blank")}
            style={{ background:"none", border:"none", color:T.faint, fontSize:13, cursor:"pointer", transition:"color 0.2s" }}
            onMouseEnter={e=>e.target.style.color=T.text} onMouseLeave={e=>e.target.style.color=T.faint}>{s.label}</button>
        ))}
      </div>
      <div style={{ fontSize:12, color:T.faint }}>© {new Date().getFullYear()} Subhra Gaming · All rights reserved.</div>
    </footer>
  );
}

// ─── EASTER EGG ────────────────────────────────────────────────────────────
function EasterEgg({ show }) {
  if (!show) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:99998, pointerEvents:"none", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)" }}>
      <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:"clamp(20px,5vw,48px)", color:T.accent, textAlign:"center", letterSpacing:2 }}>
        CHEAT CODE ACTIVATED<br/>
        <span style={{ fontSize:"0.4em", color:T.dim }}>GG EZ — you found the easter egg</span>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────
export default function SubhraGaming() {
  const [loading, setLoading] = useState(true);
  const [logoClicks, setLogoClicks] = useState(0);
  const [easter, setEaster] = useState(false);

  const handleLogo = useCallback(() => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) { setEaster(true); setTimeout(()=>{setEaster(false);setLogoClicks(0);},3000); }
  }, [logoClicks]);

  if (loading) return <Loader done={()=>setLoading(false)} />;

  return (
    <div style={{ background:T.bg, minHeight:"100vh", color:T.text, overflowX:"hidden" }}>
      <GlobalStyle />
      <ScrollBar />
      <CustomCursor />
      <EasterEgg show={easter} />
      <Nav logoClicks={logoClicks} onLogo={handleLogo} />
      <Hero />
      <About />
      <Plays />
      <Builds />
      <Setup />
      <Collab />
      <Social />
      <Contact />
      <Footer />
    </div>
  );
}
