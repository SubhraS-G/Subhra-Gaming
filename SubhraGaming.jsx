import { useState, useEffect, useRef, useCallback } from "react";

// ─── Utility: clamp ────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ─── Particle Canvas ───────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const N = 120;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
      color: ["#5b5bff","#ff2bd6","#00f0ff"][Math.floor(Math.random()*3)],
    }));

    let mx = canvas.width / 2, my = canvas.height / 2;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      // connections
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(91,91,255,${0.15 * (1 - dist/100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      // parallax mouse influence
      pts.forEach(p => {
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if (d < 120) { p.vx += dx/d * 0.01; p.vy += dy/d * 0.01; }
        p.vx = clamp(p.vx, -1, 1); p.vy = clamp(p.vy, -1, 1);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none", opacity:0.55 }} />;
}

// ─── Scroll Progress Bar ───────────────────────────────────────────────────
function ScrollBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setP(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height:3, zIndex:9999, background:"#0f0f1a" }}>
      <div style={{ height:"100%", width:`${p}%`, background:"linear-gradient(90deg,#5b5bff,#ff2bd6,#00f0ff)", transition:"width 0.1s", boxShadow:"0 0 8px #5b5bff" }} />
    </div>
  );
}

// ─── Loading Screen ────────────────────────────────────────────────────────
function Loader({ done }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct(v => { if (v >= 100) { clearInterval(id); setTimeout(done, 300); return 100; } return v + 2; }), 25);
    return () => clearInterval(id);
  }, [done]);
  return (
    <div style={{ position:"fixed", inset:0, background:"#0a0a12", zIndex:99999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:28, color:"#5b5bff", letterSpacing:8, textShadow:"0 0 20px #5b5bff" }}>SUBHRA GAMING</div>
      <div style={{ width:260, height:4, background:"#1a1a2e", borderRadius:2 }}>
        <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#5b5bff,#ff2bd6)", transition:"width 0.05s", borderRadius:2, boxShadow:"0 0 12px #ff2bd6" }} />
      </div>
      <div style={{ fontFamily:"monospace", color:"#00f0ff", fontSize:13 }}>LOADING... {pct}%</div>
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────
const NAV = ["About","Content","Live","Collab","Setup","Contact"];
function Nav({ logoClicks, onLogo }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scroll = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  return (
    <nav style={{
      position:"fixed", top:3, left:0, right:0, zIndex:1000,
      padding:"14px 40px", display:"flex", alignItems:"center", justifyContent:"space-between",
      background: scrolled ? "rgba(10,10,18,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(91,91,255,0.2)" : "none",
      transition:"all 0.4s",
    }}>
      <button onClick={onLogo} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'Orbitron',monospace", fontSize:18, color: logoClicks >= 5 ? "#ff2bd6" : "#5b5bff", letterSpacing:4, textShadow:`0 0 ${logoClicks * 4}px #5b5bff`, transition:"all 0.3s" }}>
        SUBHRA<span style={{ color:"#ff2bd6" }}>.</span>GG
      </button>
      <div style={{ display:"flex", gap:28 }}>
        {NAV.map(n => (
          <button key={n} onClick={() => scroll(n.toLowerCase())} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", fontFamily:"'Orbitron',monospace", fontSize:11, letterSpacing:2, transition:"color 0.2s" }}
            onMouseEnter={e => e.target.style.color="#00f0ff"} onMouseLeave={e => e.target.style.color="#aaa"}>
            {n}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Section Reveal Hook ───────────────────────────────────────────────────
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

// ─── Counter ───────────────────────────────────────────────────────────────
function Counter({ end, suffix = "", duration = 2000 }) {
  const [v, setV] = useState(0);
  const [ref, vis] = useReveal(0.5);
  useEffect(() => {
    if (!vis) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setV(Math.floor(prog * end));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, end, duration]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

// ─── Glow Button ──────────────────────────────────────────────────────────
function GlowBtn({ children, primary, onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding:"13px 32px", border:"none", borderRadius:4, cursor:"pointer",
        fontFamily:"'Orbitron',monospace", fontSize:12, letterSpacing:3,
        background: primary ? (hov ? "linear-gradient(135deg,#7b7bff,#ff2bd6)" : "linear-gradient(135deg,#5b5bff,#c020b0)") : "transparent",
        color: primary ? "#fff" : (hov ? "#00f0ff" : "#aaa"),
        border: primary ? "none" : `1px solid ${hov ? "#00f0ff" : "#333"}`,
        boxShadow: hov ? (primary ? "0 0 30px rgba(91,91,255,0.7)" : "0 0 20px rgba(0,240,255,0.3)") : "none",
        transform: hov ? "translateY(-2px)" : "none",
        transition:"all 0.3s",
        ...style,
      }}>
      {children}
    </button>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────
function SectionHead({ label, title, sub }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ textAlign:"center", marginBottom:60, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition:"all 0.7s" }}>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, letterSpacing:6, color:"#5b5bff", marginBottom:12 }}>{label}</div>
      <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:"clamp(26px,4vw,44px)", color:"#fff", margin:"0 0 16px", textShadow:"0 0 30px rgba(91,91,255,0.4)" }}>{title}</h2>
      {sub && <p style={{ color:"#888", maxWidth:500, margin:"0 auto", lineHeight:1.8 }}>{sub}</p>}
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 400); return () => clearTimeout(t); }, []);
  const scroll = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  return (
    <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", textAlign:"center", position:"relative", padding:"0 24px", overflow:"hidden" }}>
      {/* gradient blobs */}
      <div style={{ position:"absolute", top:"20%", left:"15%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(91,91,255,0.15),transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"25%", right:"10%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,43,214,0.12),transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,240,255,0.05),transparent 70%)", pointerEvents:"none" }} />

      <div style={{ position:"relative", zIndex:1 }}>
        {/* badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(91,91,255,0.12)", border:"1px solid rgba(91,91,255,0.3)", borderRadius:24, padding:"6px 20px", marginBottom:32, opacity: show ? 1 : 0, transition:"opacity 0.8s 0.2s" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#00f0ff", boxShadow:"0 0 8px #00f0ff", display:"inline-block", animation:"pulse 2s infinite" }} />
          <span style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#00f0ff", letterSpacing:4 }}>LIVE ON YOUTUBE & TWITCH</span>
        </div>

        <h1 style={{
          fontFamily:"'Orbitron',monospace",
          fontSize:"clamp(42px,8vw,110px)",
          fontWeight:900,
          lineHeight:1.05,
          margin:"0 0 8px",
          background:"linear-gradient(135deg,#fff 0%,#5b5bff 40%,#ff2bd6 70%,#00f0ff 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          opacity: show ? 1 : 0, transform: show ? "none" : "translateY(40px)",
          transition:"all 0.9s 0.3s",
          textShadow:"none",
          letterSpacing:"-2px",
        }}>SUBHRA</h1>
        <h1 style={{
          fontFamily:"'Orbitron',monospace",
          fontSize:"clamp(42px,8vw,110px)",
          fontWeight:900,
          lineHeight:1.05,
          margin:"0 0 28px",
          color:"#fff",
          opacity: show ? 1 : 0, transform: show ? "none" : "translateY(40px)",
          transition:"all 0.9s 0.45s",
          letterSpacing:"-2px",
        }}>GAMING</h1>

        <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"clamp(14px,2.5vw,20px)", color:"#aaa", letterSpacing:3, marginBottom:14, opacity: show ? 1 : 0, transform: show ? "none" : "translateY(20px)", transition:"all 0.8s 0.6s" }}>
          Gaming Creator &nbsp;•&nbsp; VALORANT Streamer &nbsp;•&nbsp; YouTube Content Creator
        </p>
        <p style={{ fontFamily:"Georgia,serif", fontSize:"clamp(16px,2vw,22px)", color:"#ff2bd6", fontStyle:"italic", marginBottom:48, opacity: show ? 1 : 0, transition:"opacity 0.8s 0.75s" }}>
          "Hope Is All We Can Hope For."
        </p>

        <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap", opacity: show ? 1 : 0, transform: show ? "none" : "translateY(20px)", transition:"all 0.8s 0.9s" }}>
          <GlowBtn primary onClick={() => scroll("content")}>▶ WATCH VIDEOS</GlowBtn>
          <GlowBtn onClick={() => scroll("contact")}>WORK WITH ME</GlowBtn>
        </div>

        {/* scroll hint */}
        <div style={{ marginTop:80, opacity: show ? 0.5 : 0, transition:"opacity 1s 1.5s", animation:"bounce 2s infinite 1.5s" }}>
          <div style={{ width:1, height:50, background:"linear-gradient(#5b5bff,transparent)", margin:"0 auto 8px" }} />
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#5b5bff", letterSpacing:4 }}>SCROLL</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #00f0ff} 50%{opacity:0.4;box-shadow:0 0 20px #00f0ff} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes ripple { to{transform:scale(4);opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,50,50,0.7)} 50%{box-shadow:0 0 0 8px rgba(255,50,50,0)} }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #0f0f1a; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a12; }
        ::-webkit-scrollbar-thumb { background: #5b5bff; border-radius: 2px; }
      `}</style>
    </section>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────────────────────
function About() {
  const [ref, vis] = useReveal();
  const [imgHov, setImgHov] = useState(false);
  return (
    <section id="about" style={{ padding:"100px 40px", maxWidth:1100, margin:"0 auto" }}>
      <SectionHead label="// WHO AM I" title="ABOUT ME" />
      <div ref={ref} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(40px)", transition:"all 0.8s" }}>

        {/* photo */}
        <div style={{ display:"flex", justifyContent:"center" }}>
          <div onMouseEnter={() => setImgHov(true)} onMouseLeave={() => setImgHov(false)}
            style={{
              width:300, height:360, borderRadius:8, background:"linear-gradient(135deg,#1a1a2e,#0f0f1a)",
              border:`2px solid ${imgHov ? "#ff2bd6" : "#333"}`,
              boxShadow: imgHov ? "0 0 40px rgba(255,43,214,0.4),0 0 80px rgba(91,91,255,0.2)" : "0 0 20px rgba(91,91,255,0.1)",
              transition:"all 0.4s", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16,
              position:"relative", overflow:"hidden", cursor:"pointer",
              transform: imgHov ? "scale(1.02)" : "none",
            }}>
            <div style={{ fontSize:72 }}>🎮</div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color:"#5b5bff", letterSpacing:3 }}>SUBHRA GAMING</div>
            <div style={{ fontFamily:"monospace", fontSize:11, color:"#555", letterSpacing:2 }}>CREATOR PHOTO</div>
            {/* corner accents */}
            {["topLeft","topRight","bottomLeft","bottomRight"].map(c => (
              <div key={c} style={{
                position:"absolute",
                top: c.includes("top") ? 12 : "auto", bottom: c.includes("bottom") ? 12 : "auto",
                left: c.includes("Left") ? 12 : "auto", right: c.includes("Right") ? 12 : "auto",
                width:20, height:20,
                borderTop: c.includes("top") ? "2px solid #5b5bff" : "none",
                borderBottom: c.includes("bottom") ? "2px solid #5b5bff" : "none",
                borderLeft: c.includes("Left") ? "2px solid #5b5bff" : "none",
                borderRight: c.includes("Right") ? "2px solid #5b5bff" : "none",
              }} />
            ))}
          </div>
        </div>

        {/* text */}
        <div>
          <h3 style={{ fontFamily:"'Orbitron',monospace", fontSize:22, color:"#00f0ff", marginBottom:20 }}>Hi, I'm <span style={{ color:"#ff2bd6" }}>Subhra</span></h3>
          <p style={{ color:"#bbb", lineHeight:1.9, marginBottom:20, fontFamily:"'Rajdhani',sans-serif", fontSize:16 }}>
            A gaming content creator and live streamer focused on competitive gameplay, entertaining moments, and interactive live streams.
          </p>
          <p style={{ color:"#bbb", lineHeight:1.9, marginBottom:24, fontFamily:"'Rajdhani',sans-serif", fontSize:16 }}>
            I create gaming content around titles like VALORANT, Minecraft, BGMI, and other fun multiplayer games. My goal is to build a gaming community where viewers feel entertained, engaged, and part of the experience.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:28 }}>
            {["VALORANT","Minecraft","BGMI","Multiplayer","FPS","Battle Royale"].map(t => (
              <span key={t} style={{ background:"rgba(91,91,255,0.12)", border:"1px solid rgba(91,91,255,0.3)", borderRadius:4, padding:"5px 14px", fontFamily:"'Orbitron',monospace", fontSize:9, color:"#5b5bff", letterSpacing:2 }}>{t}</span>
            ))}
          </div>
          <GlowBtn primary onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" })}>GET IN TOUCH</GlowBtn>
        </div>
      </div>
    </section>
  );
}

// ─── VIDEO CARD ────────────────────────────────────────────────────────────
function VideoCard({ emoji, title, views, category, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background:"#12121f", borderRadius:8, overflow:"hidden", cursor:"pointer",
        border:`1px solid ${hov ? "#5b5bff" : "#1e1e32"}`,
        boxShadow: hov ? "0 0 30px rgba(91,91,255,0.3),0 0 60px rgba(91,91,255,0.1)" : "0 4px 20px rgba(0,0,0,0.4)",
        transform: hov ? "translateY(-6px)" : "none",
        transition:`all 0.35s ${delay}ms`,
        opacity: vis ? 1 : 0, transitionDelay:`${delay}ms`,
      }}>
      {/* thumbnail */}
      <div style={{ height:160, background:"linear-gradient(135deg,#1a1a2e,#0a0a18)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ fontSize:52, transform: hov ? "scale(1.15)" : "scale(1)", transition:"transform 0.4s" }}>{emoji}</div>
        <div style={{ position:"absolute", inset:0, background: hov ? "rgba(91,91,255,0.08)" : "transparent", transition:"background 0.3s" }} />
        <div style={{ position:"absolute", top:10, left:10, background:"rgba(255,43,214,0.9)", borderRadius:4, padding:"3px 10px", fontFamily:"'Orbitron',monospace", fontSize:9, color:"#fff", letterSpacing:2 }}>{category}</div>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity: hov ? 1 : 0, transition:"opacity 0.3s" }}>
          <div style={{ width:50, height:50, borderRadius:"50%", background:"rgba(91,91,255,0.85)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(91,91,255,0.8)" }}>▶</div>
        </div>
      </div>
      <div style={{ padding:"16px 18px" }}>
        <h4 style={{ fontFamily:"'Orbitron',monospace", fontSize:12, color:"#e0e0ff", margin:"0 0 8px", lineHeight:1.5 }}>{title}</h4>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:12, color:"#666" }}>👁 {views} views</span>
          <button style={{ background:"none", border:"1px solid #333", borderRadius:4, padding:"4px 12px", fontFamily:"'Orbitron',monospace", fontSize:9, color:"#5b5bff", cursor:"pointer", letterSpacing:2, transition:"all 0.2s" }}
            onMouseEnter={e => { e.target.style.background="#5b5bff"; e.target.style.color="#fff"; }}
            onMouseLeave={e => { e.target.style.background="none"; e.target.style.color="#5b5bff"; }}>WATCH</button>
        </div>
      </div>
    </div>
  );
}

// ─── CONTENT ───────────────────────────────────────────────────────────────
const VIDEOS = [
  { emoji:"🔫", title:"VALORANT Operator 1v4 Clutch – Insane Comeback", views:"124K", category:"VALORANT", delay:0 },
  { emoji:"😂", title:"Funny Gaming Moments Compilation #23", views:"89K", category:"HIGHLIGHTS", delay:100 },
  { emoji:"🎮", title:"Live Stream Highlights – Best Moments", views:"67K", category:"STREAM", delay:200 },
  { emoji:"⛏️", title:"Minecraft Hardcore Survival – Day 100", views:"203K", category:"MINECRAFT", delay:300 },
  { emoji:"🏆", title:"Ranked to Immortal Journey – Full Series", views:"156K", category:"VALORANT", delay:400 },
  { emoji:"💥", title:"BGMI Tournament Gameplay – Squad Wipe", views:"45K", category:"BGMI", delay:500 },
];

function Content() {
  return (
    <section id="content" style={{ padding:"100px 40px", maxWidth:1200, margin:"0 auto" }}>
      <SectionHead label="// FEATURED CONTENT" title="WATCH & ENJOY" sub="Epic gameplay moments, funny compilations, and highlight reels." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:24 }}>
        {VIDEOS.map(v => <VideoCard key={v.title} {...v} />)}
      </div>
      <div style={{ textAlign:"center", marginTop:48 }}>
        <GlowBtn primary>VIEW ALL VIDEOS</GlowBtn>
      </div>
    </section>
  );
}

// ─── LIVE ──────────────────────────────────────────────────────────────────
function Live() {
  const [ref, vis] = useReveal();
  const [isLive] = useState(true);
  return (
    <section id="live" style={{ padding:"100px 40px", background:"linear-gradient(180deg,#0f0f1a,#0a0a14,#0f0f1a)" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <SectionHead label="// STREAMING" title="CATCH ME LIVE" />
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition:"all 0.8s" }}>
          {/* stream card */}
          <div style={{ background:"#12121f", borderRadius:12, overflow:"hidden", border:"1px solid #1e1e32", boxShadow:"0 0 60px rgba(91,91,255,0.15)" }}>
            {/* preview */}
            <div style={{ height:340, background:"linear-gradient(135deg,#0d0d1a,#150d20)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, position:"relative" }}>
              {/* scanlines overlay */}
              <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)", pointerEvents:"none" }} />
              <div style={{ fontSize:80 }}>🔴</div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14, color:"#fff", letterSpacing:4 }}>STREAM PREVIEW</div>

              {/* LIVE badge */}
              <div style={{ position:"absolute", top:16, left:16, display:"flex", alignItems:"center", gap:8, background:"rgba(220,30,30,0.9)", borderRadius:4, padding:"5px 14px", animation:"livePulse 2s infinite" }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#fff", display:"inline-block" }} />
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11, color:"#fff", fontWeight:700, letterSpacing:2 }}>LIVE</span>
              </div>

              {/* platform icons */}
              <div style={{ position:"absolute", top:16, right:16, display:"flex", gap:10 }}>
                {[{icon:"📺",label:"YouTube"},{icon:"🟣",label:"Twitch"}].map(p => (
                  <div key={p.label} style={{ background:"rgba(0,0,0,0.6)", borderRadius:6, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>
                    <span>{p.icon}</span>
                    <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#aaa", letterSpacing:2 }}>{p.label}</span>
                  </div>
                ))}
              </div>

              {/* viewer count */}
              <div style={{ position:"absolute", bottom:16, left:16, background:"rgba(0,0,0,0.7)", borderRadius:4, padding:"5px 12px" }}>
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#00f0ff", letterSpacing:2 }}>👁 2.4K WATCHING</span>
              </div>
            </div>

            {/* info bar */}
            <div style={{ padding:"24px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
              <div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:16, color:"#fff", marginBottom:8 }}>VALORANT – Ranked Grind to Immortal</div>
                <p style={{ color:"#888", fontFamily:"'Rajdhani',sans-serif", fontSize:14, margin:0 }}>
                  Catch me live playing VALORANT, interacting with viewers, and creating epic moments.
                </p>
              </div>
              <GlowBtn primary>WATCH LIVE ▶</GlowBtn>
            </div>
          </div>

          {/* stream schedule */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16, marginTop:24 }}>
            {[{day:"MON & WED",time:"8:00 PM IST",label:"RANKED GRIND"},{day:"FRI & SAT",time:"9:00 PM IST",label:"CHILL STREAMS"},{day:"SUNDAY",time:"7:00 PM IST",label:"SPECIAL EVENTS"}].map(s => (
              <div key={s.day} style={{ background:"#12121f", borderRadius:8, padding:"18px 20px", border:"1px solid #1e1e32", textAlign:"center" }}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#ff2bd6", letterSpacing:2, marginBottom:6 }}>{s.day}</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14, color:"#fff", marginBottom:4 }}>{s.time}</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:12, color:"#666", letterSpacing:1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COLLAB ────────────────────────────────────────────────────────────────
const STATS = [
  { label:"YouTube Subscribers", value:52000, suffix:"+" },
  { label:"Average Views", value:85000, suffix:"+" },
  { label:"Engagement Rate", value:8, suffix:"%" },
  { label:"Live Audience", value:2400, suffix:"+" },
];

function Collab() {
  const [ref, vis] = useReveal();
  return (
    <section id="collab" style={{ padding:"100px 40px", maxWidth:1100, margin:"0 auto" }}>
      <SectionHead label="// PARTNERSHIPS" title="WORK WITH ME" sub="Reach a passionate gaming audience through authentic brand integration." />
      <div ref={ref} style={{ opacity: vis ? 1 : 0, transition:"all 0.8s" }}>

        {/* stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:20, marginBottom:50 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background:"linear-gradient(135deg,#12121f,#0f0f1a)", borderRadius:8, padding:"28px 24px", textAlign:"center", border:"1px solid #1e1e32", boxShadow:"0 0 20px rgba(91,91,255,0.08)" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:36, fontWeight:900, color:"#5b5bff", textShadow:"0 0 20px rgba(91,91,255,0.5)", marginBottom:10 }}>
                <Counter end={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:13, color:"#888", letterSpacing:1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
          {/* services */}
          <div style={{ background:"#12121f", borderRadius:8, padding:"32px", border:"1px solid #1e1e32" }}>
            <h3 style={{ fontFamily:"'Orbitron',monospace", fontSize:14, color:"#00f0ff", marginBottom:24, letterSpacing:3 }}>OPEN TO COLLABORATIONS</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {["Sponsored Streams","Gaming Product Reviews","Brand Integrations","Affiliate Partnerships","Shoutouts & Social Posts","Giveaway Collaborations"].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ color:"#5b5bff", fontSize:14 }}>◆</span>
                  <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:15, color:"#ccc" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* brand logos */}
          <div>
            <h3 style={{ fontFamily:"'Orbitron',monospace", fontSize:14, color:"#00f0ff", marginBottom:24, letterSpacing:3 }}>TRUSTED BY BRANDS</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:28 }}>
              {["RAZER","LOGITECH","CORSAIR","ASUS ROG","NVIDIA","INTEL"].map(b => (
                <div key={b} style={{ background:"rgba(91,91,255,0.08)", border:"1px solid rgba(91,91,255,0.15)", borderRadius:6, padding:"14px 8px", textAlign:"center", fontFamily:"'Orbitron',monospace", fontSize:9, color:"#888", letterSpacing:2, transition:"all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#5b5bff"; e.currentTarget.style.color="#5b5bff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(91,91,255,0.15)"; e.currentTarget.style.color="#888"; }}>
                  {b}
                </div>
              ))}
            </div>
            <GlowBtn primary style={{ width:"100%" }} onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" })}>
              CONTACT FOR COLLABORATIONS
            </GlowBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SETUP ─────────────────────────────────────────────────────────────────
const GEAR = [
  { emoji:"💻", name:"Gaming Laptop", model:"ASUS ROG Strix G15", specs:"RTX 3060 | 16GB RAM | 144Hz" },
  { emoji:"🖱️", name:"Mouse", model:"Logitech G Pro X", specs:"25600 DPI | Wireless | Lightweight" },
  { emoji:"⌨️", name:"Keyboard", model:"Corsair K70 RGB", specs:"Cherry MX Red | Mechanical | TKL" },
  { emoji:"🎧", name:"Headset", model:"Razer BlackShark V2", specs:"THX 7.1 | 50mm Drivers | USB" },
  { emoji:"❄️", name:"Cooling Pad", model:"Havit HV-F2056", specs:"3 Fans | Silent | Ergonomic" },
  { emoji:"🎙️", name:"Microphone", model:"Blue Yeti Nano", specs:"24-bit | USB | Cardioid" },
];

function Setup() {
  return (
    <section id="setup" style={{ padding:"100px 40px", background:"linear-gradient(180deg,#0f0f1a,#0a0a14,#0f0f1a)", maxWidth:1200, margin:"0 auto" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionHead label="// MY GEAR" title="GAMING SETUP" sub="The tools that power every stream and video." />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
          {GEAR.map((g, i) => {
            const [hov, setHov] = useState(false);
            const [ref, vis] = useReveal(0.05);
            return (
              <div ref={ref} key={g.name} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{
                  background:"#12121f", borderRadius:8, padding:"28px 24px",
                  border:`1px solid ${hov ? "#ff2bd6" : "#1e1e32"}`,
                  boxShadow: hov ? "0 0 30px rgba(255,43,214,0.25),0 0 60px rgba(255,43,214,0.08)" : "0 4px 20px rgba(0,0,0,0.3)",
                  transform: hov ? "translateY(-4px) perspective(600px) rotateX(2deg)" : "none",
                  transition:`all 0.3s ${i * 50}ms`,
                  opacity: vis ? 1 : 0, transitionDelay:`${i * 80}ms`,
                  cursor:"default",
                }}>
                <div style={{ fontSize:40, marginBottom:16, animation: hov ? "float 2s infinite" : "none" }}>{g.emoji}</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#ff2bd6", letterSpacing:3, marginBottom:6 }}>{g.name}</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14, color:"#fff", marginBottom:10 }}>{g.model}</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:13, color:"#666", lineHeight:1.7 }}>{g.specs}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL ────────────────────────────────────────────────────────────────
const SOCIALS = [
  { icon:"▶", label:"YouTube", handle:"@SubhraGaming", color:"#ff0000", bg:"rgba(255,0,0,0.08)" },
  { icon:"📸", label:"Instagram", handle:"@subhragaming", color:"#e1306c", bg:"rgba(225,48,108,0.08)" },
  { icon:"💬", label:"Discord", handle:"SubhraGaming", color:"#7289da", bg:"rgba(114,137,218,0.08)" },
  { icon:"✖", label:"Twitter / X", handle:"@SubhraGaming", color:"#1d9bf0", bg:"rgba(29,155,240,0.08)" },
];

function Social() {
  return (
    <section style={{ padding:"80px 40px" }}>
      <SectionHead label="// CONNECT" title="FIND ME ONLINE" />
      <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:20, maxWidth:900, margin:"0 auto" }}>
        {SOCIALS.map(s => {
          const [hov, setHov] = useState(false);
          return (
            <div key={s.label} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
              style={{
                flex:"1 1 180px", background: hov ? s.bg : "#12121f", borderRadius:10, padding:"32px 24px", textAlign:"center", cursor:"pointer",
                border:`1px solid ${hov ? s.color : "#1e1e32"}`,
                boxShadow: hov ? `0 0 30px ${s.color}44` : "none",
                transform: hov ? "scale(1.06)" : "none",
                transition:"all 0.3s",
              }}>
              <div style={{ fontSize:36, marginBottom:14, transform: hov ? "scale(1.2)" : "none", transition:"transform 0.3s", display:"block" }}>{s.icon}</div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color: hov ? s.color : "#fff", marginBottom:6, letterSpacing:2 }}>{s.label}</div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:12, color:"#666" }}>{s.handle}</div>
            </div>
          );
        })}
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
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name:"", email:"", brand:"", message:"" });
  };

  const inputStyle = {
    width:"100%", background:"#0a0a12", border:"1px solid #1e1e32", borderRadius:6, padding:"14px 16px",
    color:"#fff", fontFamily:"'Rajdhani',sans-serif", fontSize:15, outline:"none", transition:"border-color 0.2s",
  };

  return (
    <section id="contact" style={{ padding:"100px 40px", background:"linear-gradient(180deg,#0f0f1a,#0a0a12)" }}>
      <div style={{ maxWidth:640, margin:"0 auto" }}>
        <SectionHead label="// GET IN TOUCH" title="COLLABORATE" sub="Interested in working together? Send a message and let's create something epic." />
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition:"all 0.8s" }}>
          {sent ? (
            <div style={{ textAlign:"center", padding:"60px 40px", background:"rgba(91,91,255,0.08)", border:"1px solid #5b5bff", borderRadius:10 }}>
              <div style={{ fontSize:52, marginBottom:20 }}>✅</div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, color:"#00f0ff", letterSpacing:3, marginBottom:12 }}>MESSAGE SENT!</div>
              <p style={{ color:"#888", fontFamily:"'Rajdhani',sans-serif" }}>I'll get back to you within 24–48 hours.</p>
            </div>
          ) : (
            <div style={{ background:"#12121f", borderRadius:10, padding:"40px", border:"1px solid #1e1e32" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                {[["name","Your Name","text"],["email","Your Email","email"]].map(([k,ph,t]) => (
                  <input key={k} type={t} placeholder={ph} value={form[k]}
                    onChange={e => setForm(p => ({ ...p, [k]:e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor="#5b5bff"}
                    onBlur={e => e.target.style.borderColor="#1e1e32"} />
                ))}
              </div>
              <input placeholder="Brand / Company (optional)" value={form.brand}
                onChange={e => setForm(p => ({ ...p, brand:e.target.value }))}
                style={{ ...inputStyle, marginBottom:16 }}
                onFocus={e => e.target.style.borderColor="#5b5bff"}
                onBlur={e => e.target.style.borderColor="#1e1e32"} />
              <textarea placeholder="Your message..." value={form.message} rows={5}
                onChange={e => setForm(p => ({ ...p, message:e.target.value }))}
                style={{ ...inputStyle, resize:"vertical", marginBottom:24 }}
                onFocus={e => e.target.style.borderColor="#5b5bff"}
                onBlur={e => e.target.style.borderColor="#1e1e32"} />
              <GlowBtn primary style={{ width:"100%", padding:"16px" }} onClick={submit}>
                SEND COLLABORATION REQUEST ✦
              </GlowBtn>
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
    <footer style={{ padding:"40px", borderTop:"1px solid #1e1e32", textAlign:"center" }}>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20, color:"#5b5bff", letterSpacing:4, marginBottom:8, textShadow:"0 0 15px rgba(91,91,255,0.4)" }}>
        SUBHRA<span style={{ color:"#ff2bd6" }}>.</span>GAMING
      </div>
      <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#555", fontStyle:"italic", marginBottom:20 }}>"Hope Is All We Can Hope For."</p>
      <div style={{ display:"flex", gap:20, justifyContent:"center", marginBottom:24 }}>
        {["▶ YouTube","📸 Instagram","💬 Discord","✖ Twitter"].map(s => (
          <button key={s} style={{ background:"none", border:"none", color:"#666", fontFamily:"'Rajdhani',sans-serif", fontSize:13, cursor:"pointer", transition:"color 0.2s" }}
            onMouseEnter={e => e.target.style.color="#5b5bff"} onMouseLeave={e => e.target.style.color="#666"}>{s}</button>
        ))}
      </div>
      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:12, color:"#333" }}>
        © 2025 Subhra Gaming. All rights reserved.
      </div>
    </footer>
  );
}

// ─── EASTER EGG ────────────────────────────────────────────────────────────
function EasterEgg({ show }) {
  if (!show) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:99998, pointerEvents:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:"clamp(20px,5vw,60px)", color:"#ff2bd6", textShadow:"0 0 40px #ff2bd6,0 0 80px #5b5bff", animation:"pulse 1s infinite", letterSpacing:6, textAlign:"center" }}>
        🎮 CHEAT CODE ACTIVATED 🎮<br/>
        <span style={{ fontSize:"0.4em", color:"#00f0ff" }}>GG EZ – YOU FOUND THE EASTER EGG</span>
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
    if (next >= 5) { setEaster(true); setTimeout(() => { setEaster(false); setLogoClicks(0); }, 3000); }
  }, [logoClicks]);

  if (loading) return <Loader done={() => setLoading(false)} />;

  return (
    <div style={{ background:"#0f0f1a", minHeight:"100vh", color:"#fff", overflowX:"hidden" }}>
      <ScrollBar />
      <ParticleCanvas />
      <EasterEgg show={easter} />
      <Nav logoClicks={logoClicks} onLogo={handleLogo} />
      <Hero />
      <About />
      <Content />
      <Live />
      <Collab />
      <Setup />
      <Social />
      <Contact />
      <Footer />
    </div>
  );
}
