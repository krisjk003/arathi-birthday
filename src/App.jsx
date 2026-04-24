import { useState, useEffect, useRef, useCallback } from "react";


const PHOTOS = [
  { src: "/images/a1.jpeg", caption: " 😭💖" },
  { src: "/images/a2.jpeg", caption: "✨" },
  { src: "/images/a3.jpeg", caption: " 🌸" },
  { src: "/images/a4.jpeg", caption: "☀️" },
  { src: "/images/a5.jpeg", caption: "💕"},
];

const STORY_CARDS = [
  { emoji: "☀️", text: "You make everything brighter just by being in the room.", color: "#fff0f5" },
  { emoji: "😊", text: "Your smile? It's genuinely instant happiness for anyone around you.", color: "#f5f0ff" },
  { emoji: "🌸", text: "You're one of a kind — truly. There's nobody like you, Arathi.", color: "#fff5f0" },
  { emoji: "💫", text: "You carry a kind of magic that's hard to put into words.", color: "#f0f5ff" },
  { emoji: "🌙", text: "The world is genuinely better because you're in it.", color: "#fff0fa" },
];

function FloatingParticle({ style }) {
  return <div className="fp" style={style} />;
}

function CursorTrail() {
  const trailRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const hearts = ["💖", "✨", "🌸", "💕", "⭐"];
    let frame;
    const particles = [];

    const onMove = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (!x) return;
      const el = document.createElement("div");
      el.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;font-size:14px;z-index:9999;transform:translate(-50%,-50%);animation:trailFade 0.8s forwards;`;
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  return null;
}

function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    if (!active) return;
    const colors = ["#ff6eb4", "#c084fc", "#fbbf24", "#fb923c", "#60a5fa", "#f472b6"];
    const newPieces = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
      delay: Math.random() * 0.5,
      dur: 1.5 + Math.random() * 1.5,
      shape: Math.random() > 0.5 ? "circle" : "rect",
      rotate: Math.random() * 360,
    }));
    setPieces(newPieces);
    const t = setTimeout(() => setPieces([]), 3000);
    return () => clearTimeout(t);
  }, [active]);

  if (!pieces.length) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1000, overflow: "hidden" }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingHearts({ active }) {
  const [hearts, setHearts] = useState([]);
  useEffect(() => {
    if (!active) return;
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 0.8,
      size: 20 + Math.random() * 24,
      emoji: ["💖", "💗", "💕", "💓", "🌸"][Math.floor(Math.random() * 5)],
    }));
    setHearts(items);
    const t = setTimeout(() => setHearts([]), 3000);
    return () => clearTimeout(t);
  }, [active]);
  if (!hearts.length) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1001, overflow: "hidden" }}>
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            left: `${h.x}%`,
            bottom: "-40px",
            fontSize: h.size,
            animation: `floatUp 2.5s ${h.delay}s ease-out forwards`,
          }}
        >
          {h.emoji}
        </div>
      ))}
    </div>
  );
}

export default function ArathibirthdaySite() {
  const [revealed, setRevealed] = useState([]);
  const [screen, setScreen] = useState("hero");
  const [muted, setMuted] = useState(true);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [surpriseActive, setSurpriseActive] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [heartsActive, setHeartsActive] = useState(false);
  const [hoveredPhoto, setHoveredPhoto] = useState(null);
  const [glowScreen, setGlowScreen] = useState(false);
  const [visible, setVisible] = useState({});
  const storyRefs = useRef([]);
  const audioRef = useRef(null);

  const MESSAGE = `Dear Arathi,\n\nI hope this little world makes you smile — even just for a moment.\nYou have this rare, beautiful energy that lights up everything around you. Your laughter is contagious, your kindness is real, and the way you show up for the people you love? It's something truly special.\n\nOn your birthday, I just want you to know: you are so deeply appreciated. Not for what you do or what you achieve — but simply for being you.\n\nHere's to another year of your magic, your growth, and all the happiness you deserve. 💖\n\nHappy Birthday, Arathi. 🎂✨`;

  useEffect(() => {
    if (screen !== "main") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible((v) => ({ ...v, [e.target.dataset.id]: true }));
        });
      },
      { threshold: 0.2 }
    );
    storyRefs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, [screen]);

  useEffect(() => {
    if (!envelopeOpen) return;
    let i = 0;
    const interval = setInterval(() => {
      setTyped(MESSAGE.slice(0, i));
      i++;
      if (i > MESSAGE.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [envelopeOpen]);

  const handleSurprise = () => {
    setSurpriseActive(true);
    setConfettiActive(true);
    setHeartsActive(true);
    setGlowScreen(true);
    setTimeout(() => setConfettiActive(false), 3000);
    setTimeout(() => setHeartsActive(false), 3000);
    setTimeout(() => setGlowScreen(false), 2000);
  };

  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    delay: Math.random() * 3,
    dur: 2 + Math.random() * 3,
  }));

  const floatingEmojis = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: ["🌸", "💖", "✨", "🌙", "⭐", "💕", "🦋", "🌷"][i % 8],
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 90,
    size: 14 + Math.random() * 18,
    dur: 4 + Math.random() * 5,
    delay: Math.random() * 4,
  }));

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Quicksand:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{overflow-x:hidden;}
        @keyframes trailFade{0%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-100%) scale(0.5);}}
        @keyframes twinkle{0%,100%{opacity:0.2;transform:scale(0.8);}50%{opacity:1;transform:scale(1.2);}}
        @keyframes floatY{0%,100%{transform:translateY(0px);}50%{transform:translateY(-18px);}}
        @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:1;}100%{transform:translateY(-110vh) scale(0.5);opacity:0;}}
        @keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(110vh) rotate(720deg);opacity:0;}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes envelopeOpen{from{transform:rotateX(0deg);}to{transform:rotateX(-180deg);}}
        @keyframes glowPulse{0%,100%{box-shadow:inset 0 0 60px rgba(255,182,193,0.3);}50%{box-shadow:inset 0 0 120px rgba(255,182,193,0.7);}}
        @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
        @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes scaleIn{from{transform:scale(0.6);opacity:0;}to{transform:scale(1);opacity:1;}}
        .fp{position:absolute;border-radius:50%;pointer-events:none;animation:twinkle var(--dur,3s) var(--delay,0s) infinite;}
        .story-card{opacity:0;transform:translateY(50px);transition:all 0.8s cubic-bezier(0.16,1,0.3,1);}
        .story-card.visible{opacity:1;transform:translateY(0);}
        .photo-card{transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;}
        .photo-card:hover{transform:translateY(-12px) rotate(-1deg) scale(1.04);}
        .btn{cursor:pointer;border:none;outline:none;}
        .btn:hover{filter:brightness(1.05);}
        .btn:active{transform:scale(0.97);}
        .mute-btn{position:fixed;top:18px;right:18px;z-index:500;background:rgba(255,255,255,0.3);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.5);border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;transition:all 0.3s;}
        .mute-btn:hover{background:rgba(255,255,255,0.5);}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,182,193,0.5);border-radius:10px;}
      `}</style>

      <CursorTrail />
      <Confetti active={confettiActive} />
      <FloatingHearts active={heartsActive} />

      {/* Mute button */}
      <button className="mute-btn" onClick={() => setMuted((m) => !m)} title={muted ? "Unmute" : "Mute"}>
        {muted ? "🔇" : "🎵"}
      </button>

      {/* HERO SCREEN */}
      {screen === "hero" && (
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #1a0533 0%, #2d1155 30%, #4a1672 60%, #6b2fa0 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            padding: "2rem",
          }}
        >
          {/* Stars */}
          {stars.map((s) => (
            <div
              key={s.id}
              className="fp"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                background: "white",
                "--dur": `${s.dur}s`,
                "--delay": `${s.delay}s`,
              }}
            />
          ))}

          {/* Floating emojis bg */}
          {floatingEmojis.map((e) => (
            <div
              key={e.id}
              style={{
                position: "absolute",
                left: `${e.x}%`,
                top: `${e.y}%`,
                fontSize: e.size,
                opacity: 0.25,
                animation: `floatY ${e.dur}s ${e.delay}s ease-in-out infinite`,
                pointerEvents: "none",
              }}
            >
              {e.emoji}
            </div>
          ))}

          {/* Glow orbs */}
          {[
            { w: 320, h: 320, l: "-8%", t: "10%", c: "rgba(192,132,252,0.25)" },
            { w: 280, h: 280, r: "-5%", b: "15%", c: "rgba(244,114,182,0.2)" },
            { w: 200, h: 200, l: "40%", t: "5%", c: "rgba(251,191,36,0.1)" },
          ].map((o, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: o.w,
                height: o.h,
                left: o.l,
                right: o.r,
                top: o.t,
                bottom: o.b,
                borderRadius: "50%",
                background: o.c,
                filter: "blur(60px)",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Hero content */}
          <div style={{ textAlign: "center", zIndex: 10, maxWidth: 560 }}>
            <div
              style={{
                fontSize: "clamp(48px,10vw,80px)",
                animation: "floatY 4s ease-in-out infinite",
                marginBottom: "1rem",
              }}
            >
              🌸
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(14px,4vw,18px)",
                color: "rgba(255,220,240,0.8)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: "1rem",
                animation: "fadeSlideUp 1s 0.3s both",
              }}
            >
              A little world, just for
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(52px,12vw,100px)",
                fontWeight: 300,
                color: "white",
                lineHeight: 1.0,
                fontStyle: "italic",
                marginBottom: "1.2rem",
                animation: "fadeSlideUp 1s 0.6s both",
                textShadow: "0 0 60px rgba(244,114,182,0.6), 0 0 120px rgba(192,132,252,0.3)",
              }}
            >
              Arathi
            </h1>
            <p
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(16px,4vw,22px)",
                color: "rgba(255,220,240,0.9)",
                fontWeight: 300,
                marginBottom: "0.6rem",
                animation: "fadeSlideUp 1s 0.9s both",
              }}
            >
              Hey Arathi... 💖
            </p>
            <p
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px,3.5vw,18px)",
                color: "rgba(255,200,230,0.75)",
                fontWeight: 300,
                marginBottom: "3rem",
                animation: "fadeSlideUp 1s 1.1s both",
              }}
            >
              This little world is just for you ✨
            </p>
            <button
              className="btn"
              onClick={() => setScreen("main")}
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(15px,3.5vw,18px)",
                fontWeight: 500,
                color: "#4a1672",
                background: "linear-gradient(135deg, #ffd6e7, #ffb3d1, #e8b4ff)",
                border: "none",
                borderRadius: "50px",
                padding: "16px 44px",
                cursor: "pointer",
                animation: "fadeSlideUp 1s 1.4s both, pulse 2s 2.5s ease-in-out infinite",
                boxShadow: "0 8px 32px rgba(244,114,182,0.4), 0 0 60px rgba(244,114,182,0.2)",
                letterSpacing: "0.05em",
              }}
            >
              Tap to Enter 🌷
            </button>
          </div>
        </div>
      )}

      {/* MAIN EXPERIENCE */}
      {screen === "main" && (
        <div
          style={{
            background: "linear-gradient(180deg, #fff0f8 0%, #fdf4ff 25%, #fff8f0 50%, #f0f4ff 75%, #1a0533 100%)",
            minHeight: "100vh",
            animation: glowScreen ? "glowPulse 0.5s ease-in-out 3" : "none",
          }}
        >
          {/* ─── STORY SECTION ─── */}
          <section style={{ padding: "clamp(60px,10vw,100px) clamp(20px,5vw,60px)", textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(36px,8vw,64px)",
                fontStyle: "italic",
                fontWeight: 300,
                color: "#9b2c6e",
                marginBottom: "0.4rem",
                animation: "fadeSlideUp 1s both",
              }}
            >
              Happy Birthday 🎂
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(48px,12vw,90px)",
                fontStyle: "italic",
                fontWeight: 600,
                color: "#6b21a8",
                lineHeight: 1,
                animation: "fadeSlideUp 1s 0.2s both",
                textShadow: "0 2px 30px rgba(107,33,168,0.2)",
              }}
            >
              Arathi 🌸
            </div>
            <div
              style={{
                width: 80,
                height: 2,
                background: "linear-gradient(to right, transparent, #f472b6, transparent)",
                margin: "2rem auto",
              }}
            />

            {/* Story cards */}
            <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
              {STORY_CARDS.map((card, i) => (
                <div
                  key={i}
                  ref={(el) => (storyRefs.current[i] = el)}
                  data-id={`card-${i}`}
                  className={`story-card${visible[`card-${i}`] ? " visible" : ""}`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div
                    style={{
                      background: card.color,
                      backdropFilter: "blur(20px)",
                      borderRadius: 24,
                      padding: "clamp(24px,5vw,40px)",
                      border: "1px solid rgba(255,182,193,0.3)",
                      boxShadow: "0 8px 40px rgba(244,114,182,0.1), 0 2px 8px rgba(107,33,168,0.05)",
                      transition: "all 0.4s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 16px 60px rgba(244,114,182,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 8px 40px rgba(244,114,182,0.1), 0 2px 8px rgba(107,33,168,0.05)";
                    }}
                  >
                    <div style={{ fontSize: 42, marginBottom: 12 }}>{card.emoji}</div>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(20px,4vw,28px)",
                        fontStyle: "italic",
                        color: "#5b1a6e",
                        fontWeight: 400,
                        lineHeight: 1.5,
                      }}
                    >
                      {card.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── PHOTO GALLERY ─── */}
          <section
            ref={(el) => { storyRefs.current[10] = el; }}
            data-id="gallery"
            className={`story-card${visible["gallery"] ? " visible" : ""}`}
            style={{ padding: "clamp(40px,8vw,80px) clamp(20px,4vw,40px)", textAlign: "center" }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px,7vw,56px)",
                fontStyle: "italic",
                fontWeight: 300,
                color: "#9b2c6e",
                marginBottom: "0.5rem",
              }}
            >
              A few of my favourite
            </h2>
            <p style={{ fontFamily: "'Quicksand',sans-serif", color: "#c084fc", marginBottom: "3rem", fontSize: 16 }}>
              moments & memories with you ✨
            </p>


            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "clamp(16px,3vw,28px)",
                justifyContent: "center",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              {PHOTOS.map((photo, i) => (
                <div
                  key={i}
                  className="photo-card"
                style={{
                    width: "clamp(160px, 28vw, 200px)",
                    background: "white",
                    borderRadius: 16,
                    padding: "10px 10px 20px",
                    boxShadow: "0 8px 30px rgba(107,33,168,0.12), 0 2px 8px rgba(244,114,182,0.1)",
                    transform: `rotate(${[-2, 1.5, -1, 2, -1.5][i]}deg)`,
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredPhoto(i)}
                  onMouseLeave={() => setHoveredPhoto(null)}
                  onClick={() => setHoveredPhoto(hoveredPhoto === i ? null : i)}
                >
                  {/* Photo placeholder */}
                  <div
                    style={{
                      width: "100%",
                      paddingBottom:"130%",
                      position: "relative",
                      borderRadius: 8,
                      overflow: "hidden",
                      background: `linear-gradient(135deg, ${["#fce7f3,#ede9fe","#fff7ed,#fce7f3","#ede9fe,#dbeafe","#fdf4ff,#fce7f3","#fce7f3,#fdf4ff"][i]})`,
                     
                    
                    }}
                  >
                    <img
  src={photo.src}
  alt={photo.label}
  onClick={() => setRevealed((prev) => [...prev, i])}
 style={{
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: i === 4 ? "contain" : "cover", // 👈 FIX
  backgroundColor: i === 4 ? "#fff" : "transparent",
  cursor: "pointer",
  filter: revealed.includes(i) ? "none" : "blur(20px)",
  transition: "0.5s",
}}
/>
{!revealed.includes(i) && (
  <div
    onClick={() => setRevealed((prev) => [...prev, i])} // 👈 ADD THIS
    style={{
      position: "absolute",
      inset: 0,
      backdropFilter: "blur(12px)",
      background: "rgba(255, 192, 203, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      color: "#9b2c6e",
      fontWeight: "500",
      cursor: "pointer", // 👈 optional
    }}
  >
    Tap to reveal 💖
  </div>
)}
                              
                    
                    {hoveredPhoto === i && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(107,33,168,0.8) 0%, transparent 50%)",
                          display: "flex",
                          alignItems: "flex-end",
                          padding: 10,
                          animation: "fadeIn 0.3s",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "'Quicksand',sans-serif",
                            fontSize: 12,
                            color: "white",
                            fontWeight: 500,
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {photo.caption}
                        </p>
                      </div>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Quicksand',sans-serif",
                      fontSize: 11,
                      color: "#9b2c6e",
                      textAlign: "center",
                      marginTop: 10,
                      fontWeight: 500,
                    }}
                  >
                    {photo.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── SECRET MESSAGE ─── */}
          <section
            ref={(el) => { storyRefs.current[11] = el; }}
            data-id="envelope"
            className={`story-card${visible["envelope"] ? " visible" : ""}`}
            style={{
              padding: "clamp(40px,8vw,80px) clamp(20px,4vw,40px)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px,6vw,48px)",
                fontStyle: "italic",
                color: "#6b21a8",
                marginBottom: "2.5rem",
              }}
            >
              There's something here for you... 💌
            </h2>

            {!envelopeOpen ? (
              <div
                onClick={() => setEnvelopeOpen(true)}
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  animation: "floatY 3s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(80px,18vw,130px)",
                    filter: "drop-shadow(0 8px 24px rgba(244,114,182,0.4))",
                    transition: "transform 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  💌
                </div>
                <p
                  style={{
                    fontFamily: "'Quicksand',sans-serif",
                    fontSize: 16,
                    color: "#c084fc",
                    marginTop: 12,
                  }}
                >
                  Open this 💌
                </p>
              </div>
            ) : (
              <div
                style={{
                  maxWidth: 580,
                  margin: "0 auto",
                  background: "linear-gradient(135deg, rgba(255,240,248,0.95), rgba(240,230,255,0.95))",
                  backdropFilter: "blur(20px)",
                  borderRadius: 28,
                  padding: "clamp(28px,6vw,48px)",
                  border: "1px solid rgba(244,114,182,0.3)",
                  boxShadow: "0 20px 80px rgba(107,33,168,0.15)",
                  animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: 32, textAlign: "center", marginBottom: "1.5rem" }}>💖</div>
                <pre
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(15px,3.5vw,19px)",
                    color: "#5b1a6e",
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  {typed}
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: "1.1em",
                      background: "#f472b6",
                      verticalAlign: "text-bottom",
                      animation: "pulse 0.8s infinite",
                    }}
                  />
                </pre>
              </div>
            )}
          </section>

          {/* ─── SURPRISE BUTTON ─── */}
          <section
            ref={(el) => { storyRefs.current[12] = el; }}
            data-id="surprise"
            className={`story-card${visible["surprise"] ? " visible" : ""}`}
            style={{
              padding: "clamp(40px,8vw,80px) clamp(20px,4vw,40px)",
              textAlign: "center",
            }}
          >
            {!surpriseActive ? (
              <div>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(22px,5vw,36px)",
                    fontStyle: "italic",
                    color: "#9b2c6e",
                    marginBottom: "2rem",
                  }}
                >
                  One last thing... 🎁
                </p>
                <button
                  className="btn"
                  onClick={handleSurprise}
                  style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "clamp(16px,4vw,20px)",
                    fontWeight: 600,
                    color: "white",
                    background: "linear-gradient(135deg, #ec4899, #a855f7, #f472b6)",
                    border: "none",
                    borderRadius: "50px",
                    padding: "18px 48px",
                    boxShadow: "0 8px 40px rgba(236,72,153,0.4)",
                    animation: "pulse 2s ease-in-out infinite",
                    letterSpacing: "0.04em",
                  }}
                >
                  Click for a Surprise 🎁
                </button>
              </div>
            ) : (
              <div style={{ animation: "scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <div style={{ fontSize: "clamp(60px,14vw,100px)", marginBottom: "1rem", animation: "floatY 2s ease-in-out infinite" }}>
                  🎂
                </div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(32px,8vw,64px)",
                    fontStyle: "italic",
                    fontWeight: 600,
                    color: "#6b21a8",
                    lineHeight: 1.2,
                    marginBottom: "1rem",
                    textShadow: "0 0 40px rgba(168,85,247,0.3)",
                  }}
                >
                  Happy Birthday<br />Arathi! 💖
                </h2>
                <p
                  style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "clamp(16px,4vw,22px)",
                    color: "#c084fc",
                    fontWeight: 400,
                  }}
                >
                  You deserve all the happiness in the world ✨
                </p>
                <div style={{ marginTop: "1.5rem", fontSize: 32, animation: "floatY 3s ease-in-out infinite" }}>
                  🌸 💫 🌙 ✨ 🌸
                </div>
              </div>
            )}
          </section>

          {/* ─── FINAL SCREEN ─── */}
          <section
            style={{
              minHeight: "100vh",
              background: "linear-gradient(180deg, #1a0533 0%, #0f0221 60%, #07010f 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem 2rem",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {/* Stars for final screen */}
            {stars.map((s) => (
              <div
                key={`f${s.id}`}
                className="fp"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size * 0.8,
                  height: s.size * 0.8,
                  background: "white",
                  "--dur": `${s.dur}s`,
                  "--delay": `${s.delay}s`,
                }}
              />
            ))}

            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "clamp(50px,12vw,90px)",
                  marginBottom: "2rem",
                  animation: "floatY 4s ease-in-out infinite",
                }}
              >
                💫
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(16px,4vw,24px)",
                  fontStyle: "italic",
                  color: "rgba(240,200,255,0.7)",
                  letterSpacing: "0.1em",
                  marginBottom: "1rem",
                  animation: "fadeIn 2s both",
                }}
              >
                Made with love…
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(36px,9vw,72px)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "white",
                  lineHeight: 1.2,
                  textShadow: "0 0 60px rgba(244,114,182,0.5)",
                  animation: "fadeSlideUp 1.5s 0.5s both",
                }}
              >
                just for you, Arathi 💫
              </h2>
              <div
                style={{
                  marginTop: "3rem",
                  display: "flex",
                  gap: 16,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  animation: "fadeIn 2s 1.5s both",
                }}
              >
                {"🌸 💖 ✨ 🌙 💫 🌷 💕 ⭐".split(" ").map((e, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "clamp(20px,5vw,28px)",
                      animation: `floatY ${3 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`,
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
              <button
                className="btn"
                onClick={() => { setScreen("hero"); setSurpriseActive(false); setEnvelopeOpen(false); setTyped(""); }}
                style={{
                  marginTop: "3rem",
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 14,
                  color: "rgba(240,200,255,0.6)",
                  background: "transparent",
                  border: "1px solid rgba(240,200,255,0.2)",
                  borderRadius: 50,
                  padding: "10px 28px",
                  cursor: "pointer",
                  animation: "fadeIn 2s 2s both",
                }}
              >
                ↩ Back to the beginning
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}