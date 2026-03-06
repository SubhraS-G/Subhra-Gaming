import { useState, useEffect, useRef, useCallback } from "react";

// ─── Utility ───────────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ─── REAL DATA ─────────────────────────────────────────────────────────────

// 👤 CREATOR PHOTO
// → Place CP.jpeg in your /public folder (Next.js) and this works as-is.
// → OR replace with a hosted URL e.g. "https://i.imgur.com/YOUR_ID.jpeg"
const CREATOR_PHOTO = "https://github.com/SubhraS-G/Subhra-Gaming/blob/main/CP.jpeg";

// 🎬 REAL YOUTUBE VIDEOS
const VIDEOS = [
  { id:"mfw40lh15dk", title:"We Survived Odisha's Wildest Waterfall Trek… | VLOG #1",             views:"271", category:"VLOG",    url:"https://youtu.be/mfw40lh15dk" },
  { id:"OmYKZEJbxno", title:"I Love Roasting | Omegle - 3 | Subhra Gaming",                       views:"625", category:"OMEGLE",  url:"https://youtu.be/OmYKZEJbxno" },
  { id:"EXq-7uORlP8", title:"I Wasn't Ready for Balasore Street Food 😱 | Street Food Tour",       views:"357", category:"VLOG",    url:"https://youtu.be/EXq-7uORlP8" },
  { id:"bGAaBUFbNts", title:"Getting Skipped Is An Art | Omegle | Subhra Gaming",                  views:"737", category:"OMEGLE",  url:"https://youtu.be/bGAaBUFbNts" },
  { id:"i6LgUaOmeIM", title:"3 Underrated Games That Run Smooth on Low End PC",                    views:"67",  category:"GAMING",  url:"https://youtu.be/i6LgUaOmeIM" },
  { id:"hcfSaDQkWrM", title:"I Started Game Development From Scratch - Week 1 Results",            views:"30",  category:"GAMEDEV", url:"https://youtu.be/hcfSaDQkWrM" },
];

// 📊 REAL STATS
const STATS = [
  { label:"YouTube Subscribers",  value:785, suffix:"+" },
  { label:"Avg Views per Video",   value:400, suffix:"+" },
  { label:"Engagement Rate",       value:8,   suffix:".9%" },
  { label:"Live Avg Viewers",      value:64,  suffix:"+" },
];

// ⚙️ REAL GEAR
const GEAR = [
  { emoji:"💻", name:"Gaming Laptop", model:"MSI GF63 Thin 11UC",          specs:"i5-11260H @ 2.60GHz | 16GB RAM | RTX 3050 4GB" },
  { emoji:"🖱️", name:"Mouse",         model:"Lapcare RAPIDO Gaming Mouse",  specs:"2400 DPI | Wired | Ergonomic Design" },
  { emoji:"⌨️", name:"Keyboard",      model:"Lapcare RAPIDO Gaming KB",     specs:"RGB Backlit | Anti-Ghosting | Membrane" },
  { emoji:"🎧", name:"Headset",       model:"boAt BassHeads 100",           specs:"10mm Driver | HD Sound | 3.5mm Jack" },
  { emoji:"❄️", name:"Cooling Pad",  model:"Lapcare Chillmate",            specs:"Powerful Fan | Silent | Ergonomic Lift" },
  { emoji:"🏢", name:"Content Team", model:"R2V eSports",                  specs:"Official Content Creator | Competitive Gaming Org" },
];

// 📱 REAL SOCIALS
const SOCIALS = [
  { icon:"▶",  label:"YouTube",     handle:"@SubhraGaming69",   color:"#ff0000", bg:"rgba(255,0,0,0.08)",            url:"https://youtube.com/@SubhraGaming69" },
  { icon:"📸", label:"Instagram",   handle:"@wao._.subhra",     color:"#e1306c", bg:"rgba(225,48,108,0.08)",         url:"https://instagram.com/wao._.subhra" },
  { icon:"💬", label:"Discord",     handle:"We Are One",        color:"#7289da", bg:"rgba(114,137,218,0.08)",        url:"https://discord.com/invite/G7Qy28swPN" },
  { icon:"✖",  label:"Twitter / X", handle:"@samalsubhrajit1", color:"#1d9bf0", bg:"rgba(29,155,240,0.08)",         url:"https://x.com/samalsubhrajit1" },
];

const LIVE_URL      = "https://www.youtube.com/live/ZdAlAl4zLD0";
const CHANNEL_URL   = "https://youtube.com/@SubhraGaming69";
const CONTACT_EMAIL = "profession.subhra@gmail.com";

// YouTube thumbnail helper
const ytThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

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
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
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
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i+1; j < N; j++) {
        const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y, dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle = `rgba(91,91,255,${0.15*(1-dist/100)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      pts.forEach(p => {
        const dx = mx-p.x, dy = my-p.y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 120) { p.vx += dx/d*0.01; p.vy += dy/d*0.01; }
        p.vx = clamp(p.vx,-1,1); p.vy = clamp(p.vy,-1,1);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); window.removeEventListener("mousemove",onMove); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none",opacity:0.55 }} />;
}

// ─── Scroll Progress Bar ───────────────────────────────────────────────────
function ScrollBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => { const t = document.documentElement.scrollHeight - window.innerHeight; setP(t > 0 ? (window.scrollY/t)*100 : 0); };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div style={{ position:"fixed",top:0,left:0,right:0,height:3,zIndex:9999,background:"#0f0f1a" }}>
      <div style={{ height:"100%",width:`${p}%`,background:"linear-gradient(90deg,#5b5bff,#ff2bd6,#00f0ff)",transition:"width 0.1s",boxShadow:"0 0 8px #5b5bff" }} />
    </div>
  );
}

// ─── Loading Screen ────────────────────────────────────────────────────────
function Loader({ done }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct(v => { if (v >= 100) { clearInterval(id); setTimeout(done,300); return 100; } return v+2; }), 25);
    return () => clearInterval(id);
  }, [done]);
  return (
    <div style={{ position:"fixed",inset:0,background:"#0a0a12",zIndex:99999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24 }}>
      <div style={{ fontFamily:"'Orbitron',monospace",fontSize:28,color:"#5b5bff",letterSpacing:8,textShadow:"0 0 20px #5b5bff" }}>SUBHRA GAMING</div>
      <div style={{ width:260,height:4,background:"#1a1a2e",borderRadius:2 }}>
        <div style={{ height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#5b5bff,#ff2bd6)",transition:"width 0.05s",borderRadius:2,boxShadow:"0 0 12px #ff2bd6" }} />
      </div>
      <div style={{ fontFamily:"monospace",color:"#00f0ff",fontSize:13 }}>LOADING... {pct}%</div>
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
    <nav style={{ position:"fixed",top:3,left:0,right:0,zIndex:1000,padding:"14px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(10,10,18,0.92)":"transparent",backdropFilter:scrolled?"blur(12px)":"none",borderBottom:scrolled?"1px solid rgba(91,91,255,0.2)":"none",transition:"all 0.4s" }}>
      <button onClick={onLogo} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"'Orbitron',monospace",fontSize:18,color:logoClicks>=5?"#ff2bd6":"#5b5bff",letterSpacing:4,textShadow:`0 0 ${logoClicks*4}px #5b5bff`,transition:"all 0.3s" }}>
        SUBHRA<span style={{ color:"#ff2bd6" }}>.</span>GG
      </button>
      <div style={{ display:"flex",gap:28 }}>
        {NAV.map(n => (
          <button key={n} onClick={() => scroll(n.toLowerCase())} style={{ background:"none",border:"none",cursor:"pointer",color:"#aaa",fontFamily:"'Orbitron',monospace",fontSize:11,letterSpacing:2,transition:"color 0.2s" }}
            onMouseEnter={e=>e.target.style.color="#00f0ff"} onMouseLeave={e=>e.target.style.color="#aaa"}>{n}</button>
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

function Counter({ end, suffix = "", duration = 2000 }) {
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

function GlowBtn({ children, primary, onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ padding:"13px 32px",border:"none",borderRadius:4,cursor:"pointer",fontFamily:"'Orbitron',monospace",fontSize:12,letterSpacing:3,background:primary?(hov?"linear-gradient(135deg,#7b7bff,#ff2bd6)":"linear-gradient(135deg,#5b5bff,#c020b0)"):"transparent",color:primary?"#fff":(hov?"#00f0ff":"#aaa"),border:primary?"none":`1px solid ${hov?"#00f0ff":"#333"}`,boxShadow:hov?(primary?"0 0 30px rgba(91,91,255,0.7)":"0 0 20px rgba(0,240,255,0.3)"):"none",transform:hov?"translateY(-2px)":"none",transition:"all 0.3s",...style }}>
      {children}
    </button>
  );
}

function SectionHead({ label, title, sub }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ textAlign:"center",marginBottom:60,opacity:vis?1:0,transform:vis?"none":"translateY(30px)",transition:"all 0.7s" }}>
      <div style={{ fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:6,color:"#5b5bff",marginBottom:12 }}>{label}</div>
      <h2 style={{ fontFamily:"'Orbitron',monospace",fontSize:"clamp(26px,4vw,44px)",color:"#fff",margin:"0 0 16px",textShadow:"0 0 30px rgba(91,91,255,0.4)" }}>{title}</h2>
      {sub && <p style={{ color:"#888",maxWidth:500,margin:"0 auto",lineHeight:1.8 }}>{sub}</p>}
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setShow(true),400); return ()=>clearTimeout(t); }, []);
  const scroll = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  return (
    <section style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",position:"relative",padding:"0 24px",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"20%",left:"15%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(91,91,255,0.15),transparent 70%)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:"25%",right:"10%",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,43,214,0.12),transparent 70%)",pointerEvents:"none" }} />
      <div style={{ position:"relative",zIndex:1 }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(91,91,255,0.12)",border:"1px solid rgba(91,91,255,0.3)",borderRadius:24,padding:"6px 20px",marginBottom:32,opacity:show?1:0,transition:"opacity 0.8s 0.2s" }}>
          <span style={{ width:7,height:7,borderRadius:"50%",background:"#00f0ff",boxShadow:"0 0 8px #00f0ff",display:"inline-block",animation:"pulse 2s infinite" }} />
          <span style={{ fontFamily:"'Orbitron',monospace",fontSize:10,color:"#00f0ff",letterSpacing:4 }}>CONTENT CREATOR @ R2V ESPORTS</span>
        </div>
        <h1 style={{ fontFamily:"'Orbitron',monospace",fontSize:"clamp(42px,8vw,110px)",fontWeight:900,lineHeight:1.05,margin:"0 0 8px",background:"linear-gradient(135deg,#fff 0%,#5b5bff 40%,#ff2bd6 70%,#00f0ff 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",opacity:show?1:0,transform:show?"none":"translateY(40px)",transition:"all 0.9s 0.3s",letterSpacing:"-2px" }}>SUBHRA</h1>
        <h1 style={{ fontFamily:"'Orbitron',monospace",fontSize:"clamp(42px,8vw,110px)",fontWeight:900,lineHeight:1.05,margin:"0 0 28px",color:"#fff",opacity:show?1:0,transform:show?"none":"translateY(40px)",transition:"all 0.9s 0.45s",letterSpacing:"-2px" }}>GAMING</h1>
        <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(14px,2.5vw,20px)",color:"#aaa",letterSpacing:3,marginBottom:14,opacity:show?1:0,transform:show?"none":"translateY(20px)",transition:"all 0.8s 0.6s" }}>
          Gaming Creator &nbsp;•&nbsp; VALORANT Streamer &nbsp;•&nbsp; YouTube Content Creator
        </p>
        <p style={{ fontFamily:"Georgia,serif",fontSize:"clamp(16px,2vw,22px)",color:"#ff2bd6",fontStyle:"italic",marginBottom:48,opacity:show?1:0,transition:"opacity 0.8s 0.75s" }}>
          "Hope Is All We Can Hope For."
        </p>
        <div style={{ display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",opacity:show?1:0,transform:show?"none":"translateY(20px)",transition:"all 0.8s 0.9s" }}>
          <GlowBtn primary onClick={()=>window.open(CHANNEL_URL,"_blank")}>▶ WATCH VIDEOS</GlowBtn>
          <GlowBtn onClick={()=>scroll("contact")}>WORK WITH ME</GlowBtn>
        </div>
        <div style={{ marginTop:80,opacity:show?0.5:0,transition:"opacity 1s 1.5s",animation:"bounce 2s infinite 1.5s" }}>
          <div style={{ width:1,height:50,background:"linear-gradient(#5b5bff,transparent)",margin:"0 auto 8px" }} />
          <div style={{ fontFamily:"'Orbitron',monospace",fontSize:9,color:"#5b5bff",letterSpacing:4 }}>SCROLL</div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap');
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 8px #00f0ff}50%{opacity:0.4;box-shadow:0 0 20px #00f0ff}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(255,50,50,0.7)}50%{box-shadow:0 0 0 8px rgba(255,50,50,0)}}
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;background:#0f0f1a;color:#fff}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0a12}
        ::-webkit-scrollbar-thumb{background:#5b5bff;border-radius:2px}
      `}</style>
    </section>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────────────────────
function About() {
  const [ref, vis] = useReveal();
  const [imgHov, setImgHov] = useState(false);
  return (
    <section id="about" style={{ padding:"100px 40px",maxWidth:1100,margin:"0 auto" }}>
      <SectionHead label="// WHO AM I" title="ABOUT ME" />
      <div ref={ref} style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center",opacity:vis?1:0,transform:vis?"none":"translateY(40px)",transition:"all 0.8s" }}>
        {/* PHOTO */}
        <div style={{ display:"flex",justifyContent:"center" }}>
          <div onMouseEnter={()=>setImgHov(true)} onMouseLeave={()=>setImgHov(false)}
            style={{ width:300,height:380,borderRadius:10,overflow:"hidden",border:`2px solid ${imgHov?"#ff2bd6":"#333"}`,boxShadow:imgHov?"0 0 40px rgba(255,43,214,0.5),0 0 80px rgba(91,91,255,0.2)":"0 0 20px rgba(91,91,255,0.1)",transition:"all 0.4s",transform:imgHov?"scale(1.02)":"none",position:"relative",cursor:"pointer" }}>
            {/*
              ── HOW TO USE YOUR PHOTO (CP.jpeg) ──────────────────────────
              Next.js:   Put CP.jpeg in the /public folder → src="/CP.jpeg"
              Vite/CRA:  Put CP.jpeg in /public → src="/CP.jpeg"
              Hosted:    Upload to imgur/cloudinary, paste full https:// URL
                         into the CREATOR_PHOTO constant at the top of this file
              ─────────────────────────────────────────────────────────────
            */}
            <img
              src={CREATOR_PHOTO}
              alt="Subhra — Gaming Content Creator"
              style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block" }}
              onError={e => {
                e.target.style.display = "none";
                if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
              }}
            />
            {/* Fallback if photo file not found */}
            <div style={{ display:"none",position:"absolute",inset:0,flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,background:"linear-gradient(135deg,#1a1a2e,#0f0f1a)" }}>
              <div style={{ fontSize:64 }}>🎮</div>
              <div style={{ fontFamily:"'Orbitron',monospace",fontSize:11,color:"#5b5bff",letterSpacing:3,textAlign:"center",padding:"0 16px" }}>Place CP.jpeg in /public folder</div>
            </div>
            {/* Corner accents */}
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h])=>(
              <div key={v+h} style={{ position:"absolute",[v]:12,[h]:12,width:20,height:20,borderTop:v==="top"?"2px solid #5b5bff":"none",borderBottom:v==="bottom"?"2px solid #5b5bff":"none",borderLeft:h==="left"?"2px solid #5b5bff":"none",borderRight:h==="right"?"2px solid #5b5bff":"none",zIndex:2 }} />
            ))}
            <div style={{ position:"absolute",inset:0,background:imgHov?"rgba(91,91,255,0.06)":"transparent",transition:"background 0.3s" }} />
          </div>
        </div>

        {/* TEXT */}
        <div>
          <h3 style={{ fontFamily:"'Orbitron',monospace",fontSize:22,color:"#00f0ff",marginBottom:20 }}>Hi, I'm <span style={{ color:"#ff2bd6" }}>Subhra</span></h3>
          <p style={{ color:"#bbb",lineHeight:1.9,marginBottom:16,fontFamily:"'Rajdhani',sans-serif",fontSize:16 }}>
            A gaming content creator and live streamer focused on competitive gameplay, entertaining moments, and interactive live streams.
          </p>
          <p style={{ color:"#bbb",lineHeight:1.9,marginBottom:16,fontFamily:"'Rajdhani',sans-serif",fontSize:16 }}>
            I create content around titles like VALORANT, Minecraft, BGMI, and other fun multiplayer games — plus vlogs, Omegle reactions, and game dev diaries.
          </p>
          <p style={{ color:"#bbb",lineHeight:1.9,marginBottom:24,fontFamily:"'Rajdhani',sans-serif",fontSize:16 }}>
            Currently an official Content Creator at <span style={{ color:"#5b5bff",fontWeight:600 }}>R2V eSports</span>. My goal is to build a gaming community where viewers feel entertained, engaged, and part of the experience.
          </p>
          <div style={{ display:"flex",flexWrap:"wrap",gap:10,marginBottom:28 }}>
            {["VALORANT","Minecraft","BGMI","Game Dev","Vlogs","Omegle","R2V eSports"].map(t=>(
              <span key={t} style={{ background:"rgba(91,91,255,0.12)",border:"1px solid rgba(91,91,255,0.3)",borderRadius:4,padding:"5px 14px",fontFamily:"'Orbitron',monospace",fontSize:9,color:"#5b5bff",letterSpacing:2 }}>{t}</span>
            ))}
          </div>
          <GlowBtn primary onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>GET IN TOUCH</GlowBtn>
        </div>
      </div>
    </section>
  );
}

// ─── VIDEO CARD ────────────────────────────────────────────────────────────
function VideoCard({ id, title, views, category, url, delay }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useReveal(0.1);
  const catColors = { VLOG:"#ff2bd6", OMEGLE:"#5b5bff", GAMING:"#00f0ff", GAMEDEV:"#ffaa00" };
  const catColor = catColors[category] || "#5b5bff";
  return (
    <div ref={ref} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"#12121f",borderRadius:8,overflow:"hidden",cursor:"pointer",border:`1px solid ${hov?"#5b5bff":"#1e1e32"}`,boxShadow:hov?"0 0 30px rgba(91,91,255,0.3)":"0 4px 20px rgba(0,0,0,0.4)",transform:hov?"translateY(-6px)":"none",transition:"all 0.35s",opacity:vis?1:0,transitionDelay:`${delay}ms` }}>
      <div style={{ height:180,overflow:"hidden",position:"relative" }}>
        <img src={ytThumb(id)} alt={title} style={{ width:"100%",height:"100%",objectFit:"cover",transform:hov?"scale(1.08)":"scale(1)",transition:"transform 0.5s",display:"block" }} />
        <div style={{ position:"absolute",inset:0,background:hov?"rgba(91,91,255,0.12)":"rgba(0,0,0,0.2)",transition:"background 0.3s" }} />
        <div style={{ position:"absolute",top:10,left:10,background:`${catColor}dd`,borderRadius:4,padding:"3px 10px",fontFamily:"'Orbitron',monospace",fontSize:9,color:"#fff",letterSpacing:2 }}>{category}</div>
        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:hov?1:0,transition:"opacity 0.3s" }}>
          <div style={{ width:52,height:52,borderRadius:"50%",background:"rgba(91,91,255,0.9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 24px rgba(91,91,255,0.9)" }}>▶</div>
        </div>
      </div>
      <div style={{ padding:"16px 18px" }}>
        <h4 style={{ fontFamily:"'Orbitron',monospace",fontSize:11,color:"#e0e0ff",margin:"0 0 10px",lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{title}</h4>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"#666" }}>👁 {views} views</span>
          <button onClick={()=>window.open(url,"_blank")}
            style={{ background:"none",border:"1px solid #333",borderRadius:4,padding:"4px 12px",fontFamily:"'Orbitron',monospace",fontSize:9,color:"#5b5bff",cursor:"pointer",letterSpacing:2,transition:"all 0.2s" }}
            onMouseEnter={e=>{e.target.style.background="#5b5bff";e.target.style.color="#fff";}}
            onMouseLeave={e=>{e.target.style.background="none";e.target.style.color="#5b5bff";}}>WATCH</button>
        </div>
      </div>
    </div>
  );
}

// ─── CONTENT ───────────────────────────────────────────────────────────────
function Content() {
  return (
    <section id="content" style={{ padding:"100px 40px",maxWidth:1200,margin:"0 auto" }}>
      <SectionHead label="// FEATURED CONTENT" title="WATCH & ENJOY" sub="Vlogs, gaming moments, Omegle reactions, and game dev diaries." />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24 }}>
        {VIDEOS.map((v,i) => <VideoCard key={v.id} {...v} delay={i*80} />)}
      </div>
      <div style={{ textAlign:"center",marginTop:48 }}>
        <GlowBtn primary onClick={()=>window.open(CHANNEL_URL,"_blank")}>VIEW ALL VIDEOS ▶</GlowBtn>
      </div>
    </section>
  );
}

// ─── LIVE ──────────────────────────────────────────────────────────────────
function Live() {
  const [ref, vis] = useReveal();
  return (
    <section id="live" style={{ padding:"100px 40px",background:"linear-gradient(180deg,#0f0f1a,#0a0a14,#0f0f1a)" }}>
      <div style={{ maxWidth:900,margin:"0 auto" }}>
        <SectionHead label="// STREAMING" title="CATCH ME LIVE" />
        <div ref={ref} style={{ opacity:vis?1:0,transform:vis?"none":"translateY(30px)",transition:"all 0.8s" }}>
          <div style={{ background:"#12121f",borderRadius:12,overflow:"hidden",border:"1px solid #1e1e32",boxShadow:"0 0 60px rgba(91,91,255,0.15)" }}>
            <div style={{ height:340,background:"#0d0d1a",position:"relative",overflow:"hidden" }}>
              {/* Real live stream thumbnail */}
              <img src="https://img.youtube.com/vi/ZdAlAl4zLD0/maxresdefault.jpg" alt="Subhra Gaming Live"
                style={{ width:"100%",height:"100%",objectFit:"cover",opacity:0.7 }}
                onError={e=>{ e.target.style.opacity=0; }} />
              <div style={{ position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)",pointerEvents:"none" }} />
              {/* LIVE badge */}
              <div style={{ position:"absolute",top:16,left:16,display:"flex",alignItems:"center",gap:8,background:"rgba(220,30,30,0.92)",borderRadius:4,padding:"5px 14px",animation:"livePulse 2s infinite" }}>
                <span style={{ width:8,height:8,borderRadius:"50%",background:"#fff",display:"inline-block" }} />
                <span style={{ fontFamily:"'Orbitron',monospace",fontSize:11,color:"#fff",fontWeight:700,letterSpacing:2 }}>LIVE</span>
              </div>
              <div style={{ position:"absolute",top:16,right:16,background:"rgba(0,0,0,0.7)",borderRadius:6,padding:"6px 12px",display:"flex",alignItems:"center",gap:6 }}>
                <span>📺</span><span style={{ fontFamily:"'Orbitron',monospace",fontSize:9,color:"#aaa",letterSpacing:2 }}>YOUTUBE</span>
              </div>
              <div style={{ position:"absolute",bottom:16,left:16,background:"rgba(0,0,0,0.75)",borderRadius:4,padding:"5px 12px" }}>
                <span style={{ fontFamily:"'Orbitron',monospace",fontSize:10,color:"#00f0ff",letterSpacing:2 }}>👁 ~64 AVG VIEWERS</span>
              </div>
              <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <div onClick={()=>window.open(LIVE_URL,"_blank")}
                  style={{ width:72,height:72,borderRadius:"50%",background:"rgba(91,91,255,0.85)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 0 30px rgba(91,91,255,0.8)",cursor:"pointer",transition:"transform 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>▶</div>
              </div>
            </div>
            <div style={{ padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20 }}>
              <div>
                <div style={{ fontFamily:"'Orbitron',monospace",fontSize:15,color:"#fff",marginBottom:8 }}>VALORANT – Ranked Grind & Chill Streams</div>
                <p style={{ color:"#888",fontFamily:"'Rajdhani',sans-serif",fontSize:14,margin:0 }}>Catch me live playing VALORANT, interacting with viewers, and creating epic moments.</p>
              </div>
              <GlowBtn primary onClick={()=>window.open(LIVE_URL,"_blank")}>WATCH LIVE ▶</GlowBtn>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16,marginTop:24 }}>
            {[{day:"MON & WED",time:"8:00 PM IST",label:"RANKED GRIND"},{day:"FRI & SAT",time:"9:00 PM IST",label:"CHILL STREAMS"},{day:"SUNDAY",time:"7:00 PM IST",label:"SPECIAL EVENTS"}].map(s=>(
              <div key={s.day} style={{ background:"#12121f",borderRadius:8,padding:"18px 20px",border:"1px solid #1e1e32",textAlign:"center" }}>
                <div style={{ fontFamily:"'Orbitron',monospace",fontSize:10,color:"#ff2bd6",letterSpacing:2,marginBottom:6 }}>{s.day}</div>
                <div style={{ fontFamily:"'Orbitron',monospace",fontSize:14,color:"#fff",marginBottom:4 }}>{s.time}</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"#666",letterSpacing:1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COLLAB ────────────────────────────────────────────────────────────────
function Collab() {
  const [ref, vis] = useReveal();
  return (
    <section id="collab" style={{ padding:"100px 40px",maxWidth:1100,margin:"0 auto" }}>
      <SectionHead label="// PARTNERSHIPS" title="WORK WITH ME" sub="Reach a passionate gaming audience through authentic content and brand integration." />
      <div ref={ref} style={{ opacity:vis?1:0,transition:"all 0.8s" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:20,marginBottom:50 }}>
          {STATS.map(s=>(
            <div key={s.label} style={{ background:"linear-gradient(135deg,#12121f,#0f0f1a)",borderRadius:8,padding:"28px 24px",textAlign:"center",border:"1px solid #1e1e32",boxShadow:"0 0 20px rgba(91,91,255,0.08)" }}>
              <div style={{ fontFamily:"'Orbitron',monospace",fontSize:36,fontWeight:900,color:"#5b5bff",textShadow:"0 0 20px rgba(91,91,255,0.5)",marginBottom:10 }}>
                <Counter end={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"#888",letterSpacing:1 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"start" }}>
          <div style={{ background:"#12121f",borderRadius:8,padding:"32px",border:"1px solid #1e1e32" }}>
            <h3 style={{ fontFamily:"'Orbitron',monospace",fontSize:14,color:"#00f0ff",marginBottom:24,letterSpacing:3 }}>OPEN TO COLLABORATIONS</h3>
            {["Sponsored Streams","Gaming Product Reviews","Brand Integrations","Affiliate Partnerships","Shoutouts & Social Posts","Giveaway Collaborations"].map(item=>(
              <div key={item} style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
                <span style={{ color:"#5b5bff",fontSize:14 }}>◆</span>
                <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:15,color:"#ccc" }}>{item}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 style={{ fontFamily:"'Orbitron',monospace",fontSize:14,color:"#00f0ff",marginBottom:24,letterSpacing:3 }}>AFFILIATED WITH</h3>
            <div style={{ background:"rgba(91,91,255,0.08)",border:"1px solid rgba(91,91,255,0.25)",borderRadius:10,padding:"32px 24px",textAlign:"center",marginBottom:24 }}>
              <div style={{ fontFamily:"'Orbitron',monospace",fontSize:36,color:"#5b5bff",letterSpacing:6,marginBottom:10,textShadow:"0 0 24px rgba(91,91,255,0.6)" }}>R2V</div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:18,color:"#aaa",letterSpacing:3 }}>eSPORTS</div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"#666",marginTop:8 }}>Official Content Creator</div>
            </div>
            <GlowBtn primary style={{ width:"100%",padding:"16px" }} onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>
              CONTACT FOR COLLABORATIONS
            </GlowBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SETUP ─────────────────────────────────────────────────────────────────
function Setup() {
  return (
    <section id="setup" style={{ padding:"100px 40px",background:"linear-gradient(180deg,#0f0f1a,#0a0a14,#0f0f1a)" }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <SectionHead label="// MY GEAR" title="GAMING SETUP" sub="The real tools powering every stream and video." />
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20 }}>
          {GEAR.map((g,i) => {
            const [hov, setHov] = useState(false);
            const [ref, vis] = useReveal(0.05);
            return (
              <div ref={ref} key={g.name} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
                style={{ background:"#12121f",borderRadius:8,padding:"28px 24px",border:`1px solid ${hov?"#ff2bd6":"#1e1e32"}`,boxShadow:hov?"0 0 30px rgba(255,43,214,0.25)":"0 4px 20px rgba(0,0,0,0.3)",transform:hov?"translateY(-4px) perspective(600px) rotateX(2deg)":"none",transition:`all 0.3s ${i*50}ms`,opacity:vis?1:0,transitionDelay:`${i*80}ms`,cursor:"default" }}>
                <div style={{ fontSize:40,marginBottom:16,animation:hov?"float 2s infinite":"none" }}>{g.emoji}</div>
                <div style={{ fontFamily:"'Orbitron',monospace",fontSize:9,color:"#ff2bd6",letterSpacing:3,marginBottom:6 }}>{g.name}</div>
                <div style={{ fontFamily:"'Orbitron',monospace",fontSize:13,color:"#fff",marginBottom:10,lineHeight:1.5 }}>{g.model}</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"#666",lineHeight:1.7 }}>{g.specs}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL ────────────────────────────────────────────────────────────────
function Social() {
  return (
    <section style={{ padding:"80px 40px" }}>
      <SectionHead label="// CONNECT" title="FIND ME ONLINE" />
      <div style={{ display:"flex",justifyContent:"center",flexWrap:"wrap",gap:20,maxWidth:900,margin:"0 auto" }}>
        {SOCIALS.map(s => {
          const [hov, setHov] = useState(false);
          return (
            <div key={s.label} onClick={()=>window.open(s.url,"_blank")}
              onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
              style={{ flex:"1 1 180px",background:hov?s.bg:"#12121f",borderRadius:10,padding:"32px 24px",textAlign:"center",cursor:"pointer",border:`1px solid ${hov?s.color:"#1e1e32"}`,boxShadow:hov?`0 0 30px ${s.color}44`:"none",transform:hov?"scale(1.06)":"none",transition:"all 0.3s" }}>
              <div style={{ fontSize:36,marginBottom:14,transform:hov?"scale(1.2)":"none",transition:"transform 0.3s",display:"block" }}>{s.icon}</div>
              <div style={{ fontFamily:"'Orbitron',monospace",fontSize:13,color:hov?s.color:"#fff",marginBottom:6,letterSpacing:2 }}>{s.label}</div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"#666" }}>{s.handle}</div>
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
    const subject = encodeURIComponent(`Collaboration Request from ${form.name}${form.brand?" – "+form.brand:""}`);
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nBrand/Company: ${form.brand||"N/A"}\n\nMessage:\n${form.message}`);
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name:"", email:"", brand:"", message:"" });
  };

  const inputStyle = { width:"100%",background:"#0a0a12",border:"1px solid #1e1e32",borderRadius:6,padding:"14px 16px",color:"#fff",fontFamily:"'Rajdhani',sans-serif",fontSize:15,outline:"none",transition:"border-color 0.2s" };

  return (
    <section id="contact" style={{ padding:"100px 40px",background:"linear-gradient(180deg,#0f0f1a,#0a0a12)" }}>
      <div style={{ maxWidth:640,margin:"0 auto" }}>
        <SectionHead label="// GET IN TOUCH" title="COLLABORATE" sub={`Reach out for collaborations, sponsorships, or partnerships.`} />
        <div ref={ref} style={{ opacity:vis?1:0,transform:vis?"none":"translateY(30px)",transition:"all 0.8s" }}>
          {sent ? (
            <div style={{ textAlign:"center",padding:"60px 40px",background:"rgba(91,91,255,0.08)",border:"1px solid #5b5bff",borderRadius:10 }}>
              <div style={{ fontSize:52,marginBottom:20 }}>✅</div>
              <div style={{ fontFamily:"'Orbitron',monospace",fontSize:18,color:"#00f0ff",letterSpacing:3,marginBottom:12 }}>EMAIL CLIENT OPENED!</div>
              <p style={{ color:"#888",fontFamily:"'Rajdhani',sans-serif" }}>Your message was loaded in your email app. Send it to reach Subhra. Response within 24–48 hours.</p>
            </div>
          ) : (
            <div style={{ background:"#12121f",borderRadius:10,padding:"40px",border:"1px solid #1e1e32" }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
                {[["name","Your Name","text"],["email","Your Email","email"]].map(([k,ph,t])=>(
                  <input key={k} type={t} placeholder={ph} value={form[k]}
                    onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                    style={inputStyle} onFocus={e=>e.target.style.borderColor="#5b5bff"} onBlur={e=>e.target.style.borderColor="#1e1e32"} />
                ))}
              </div>
              <input placeholder="Brand / Company (optional)" value={form.brand}
                onChange={e=>setForm(p=>({...p,brand:e.target.value}))}
                style={{...inputStyle,marginBottom:16}} onFocus={e=>e.target.style.borderColor="#5b5bff"} onBlur={e=>e.target.style.borderColor="#1e1e32"} />
              <textarea placeholder="Your message..." value={form.message} rows={5}
                onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                style={{...inputStyle,resize:"vertical",marginBottom:24}} onFocus={e=>e.target.style.borderColor="#5b5bff"} onBlur={e=>e.target.style.borderColor="#1e1e32"} />
              <GlowBtn primary style={{ width:"100%",padding:"16px" }} onClick={submit}>
                SEND COLLABORATION REQUEST ✦
              </GlowBtn>
              <p style={{ textAlign:"center",fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"#444",marginTop:16 }}>
                Or email directly: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color:"#5b5bff",textDecoration:"none" }}>{CONTACT_EMAIL}</a>
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
  const links = [
    { label:"▶ YouTube",    url:"https://youtube.com/@SubhraGaming69" },
    { label:"📸 Instagram",  url:"https://instagram.com/wao._.subhra" },
    { label:"💬 Discord",    url:"https://discord.com/invite/G7Qy28swPN" },
    { label:"✖ Twitter/X",  url:"https://x.com/samalsubhrajit1" },
  ];
  return (
    <footer style={{ padding:"40px",borderTop:"1px solid #1e1e32",textAlign:"center" }}>
      <div style={{ fontFamily:"'Orbitron',monospace",fontSize:20,color:"#5b5bff",letterSpacing:4,marginBottom:8,textShadow:"0 0 15px rgba(91,91,255,0.4)" }}>
        SUBHRA<span style={{ color:"#ff2bd6" }}>.</span>GAMING
      </div>
      <p style={{ fontFamily:"Georgia,serif",fontSize:13,color:"#555",fontStyle:"italic",marginBottom:20 }}>"Hope Is All We Can Hope For."</p>
      <div style={{ display:"flex",gap:20,justifyContent:"center",marginBottom:24,flexWrap:"wrap" }}>
        {links.map(l=>(
          <button key={l.label} onClick={()=>window.open(l.url,"_blank")}
            style={{ background:"none",border:"none",color:"#666",fontFamily:"'Rajdhani',sans-serif",fontSize:13,cursor:"pointer",transition:"color 0.2s" }}
            onMouseEnter={e=>e.target.style.color="#5b5bff"} onMouseLeave={e=>e.target.style.color="#666"}>{l.label}</button>
        ))}
      </div>
      <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"#2a2a2a" }}>
        © 2025 Subhra Gaming · Content Creator @ R2V eSports · All rights reserved.
      </div>
    </footer>
  );
}

// ─── EASTER EGG ────────────────────────────────────────────────────────────
function EasterEgg({ show }) {
  if (!show) return null;
  return (
    <div style={{ position:"fixed",inset:0,zIndex:99998,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ fontFamily:"'Orbitron',monospace",fontSize:"clamp(20px,5vw,60px)",color:"#ff2bd6",textShadow:"0 0 40px #ff2bd6,0 0 80px #5b5bff",animation:"pulse 1s infinite",letterSpacing:6,textAlign:"center" }}>
        🎮 CHEAT CODE ACTIVATED 🎮<br/>
        <span style={{ fontSize:"0.4em",color:"#00f0ff" }}>GG EZ – YOU FOUND THE EASTER EGG</span>
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
    <div style={{ background:"#0f0f1a",minHeight:"100vh",color:"#fff",overflowX:"hidden" }}>
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
