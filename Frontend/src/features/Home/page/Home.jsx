import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { logout } from "../../auth/services/auth.api";
import { setUser } from "../../auth/auth.slice";
import { useDispatch } from "react-redux";
import NavBar from "../components/NavBar";
import "../style/home.scss";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// ── Mini animated SVG Graph ──────────────────────────────────────────────
function MiniGraph() {
  const ref = useRef(null);

  useEffect(() => {
    const paths = ref.current?.querySelectorAll(".gline");
    if (!paths) return;

    paths.forEach((p, i) => {
      const len = p.getTotalLength?.() ?? 400;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, {
        strokeDashoffset: 0,
        duration: 1.8,
        delay: i * 0.3,
        ease: "power2.out",
        scrollTrigger: { trigger: p, start: "top 85%" },
      });
    });

    const dots = ref.current?.querySelectorAll(".gdot");
    dots?.forEach((d, i) => {
      gsap.from(d, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        delay: 1.4 + i * 0.12,
        ease: "back.out(2)",
        transformOrigin: "center",
        scrollTrigger: { trigger: d, start: "top 85%" },
      });
    });
  }, []);

  const pts = [
    [30, 200], [90, 160], [150, 130], [220, 80], [290, 110],
    [360, 60], [430, 90], [500, 40], [570, 70], [640, 30],
  ];
  const d1 = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const pts2 = pts.map(([x, y]) => [x, y + 60]);
  const d2 = pts2.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");

  return (
    <svg ref={ref} viewBox="0 0 680 240" className="graph-svg">
      {[50, 100, 150, 200].map((y) => (
        <line key={y} x1="20" y1={y} x2="660" y2={y} stroke="#333" strokeWidth="1" />
      ))}
      <path className="gline" d={d1} fill="none" stroke="#7fffb2" strokeWidth="2.5" strokeLinecap="round" />
      <path className="gline" d={d2} fill="none" stroke="#5599ff" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
      {pts.map(([x, y], i) => (
        <circle key={`a${i}`} className="gdot" cx={x} cy={y} r="5" fill="#7fffb2" />
      ))}
      {pts2.map(([x, y], i) => (
        <circle key={`b${i}`} className="gdot" cx={x} cy={y} r="4" fill="#5599ff" />
      ))}
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: "📁",
    title: "Auto Folder Organization",
    desc: "Your saves are automatically sorted into folders based on content no manual tagging needed.",
  },
  {
    icon: "🔗",
    title: "Semantic Intelligence",
    desc: "Omni connects your bookmarks, notes, and files into a living mind map using semantic understanding.",
  },
  {
    icon: "📊",
    title: "Graph Visualization",
    desc: "See how your saved content relates to each other through an interactive knowledge graph.",
  },
  {
    icon: "🤖",
    title: "AI Tags & Summaries",
    desc: "Every save gets an AI generated summary and smart tags so you can find anything instantly.",
  },
];

const sampleTags = [
  "🎨 Design", "⚡ Productivity", "💡 Ideas", "📘 Learning",
  "🛠 Dev Tools", "📰 Articles", "🎵 Inspiration", "🌐 Web",
  "🔬 Research", "📦 Projects", "✍️ Writing", "🎯 Goals",
];

// ── Component ─────────────────────────────────────────────────────────────
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  // refs for GSAP
  const blob1Ref    = useRef(null);
  const blob2Ref    = useRef(null);
  const badgeRef    = useRef(null);
  const h1Ref       = useRef(null);
  const subRef      = useRef(null);
  const ctaRef      = useRef(null);
  const bannerRef   = useRef(null);
  const cardsRef    = useRef([]);
  const tagsRef     = useRef(null);

  async function handleLogout() {
    try {
      const res = await logout();
      dispatch(setUser(null));
      console.log(res);
    } catch (error) {
      console.log("Logout error:", error);
    }
  }

  useEffect(() => {
    // ── Hero entrance (fromTo so end state is always opacity:1) ──
    const heroEls = [
      { ref: badgeRef,  delay: 0.15 },
      { ref: h1Ref,     delay: 0.35 },
      { ref: subRef,    delay: 0.55 },
      { ref: ctaRef,    delay: 0.72 },
    ];

    heroEls.forEach(({ ref, delay }) => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { y: 30, autoAlpha: 0 },
        { y: 0,  autoAlpha: 1, duration: 0.7, delay, ease: "power3.out" }
      );
    });

    // ── Blob float ──
    gsap.to(blob1Ref.current, { y: -30, x: 20,  duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(blob2Ref.current, { y:  25, x: -15, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });

    // ── Feature cards ──
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { y: 50, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.7, delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
        }
      );
      card.addEventListener("mouseenter", () => gsap.to(card, { y: -6, duration: 0.25 }));
      card.addEventListener("mouseleave", () => gsap.to(card, { y: 0,  duration: 0.25 }));
    });

    // ── Banner ──
    if (bannerRef.current) {
      gsap.fromTo(
        bannerRef.current,
        { y: 30, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: bannerRef.current, start: "top 90%", toggleActions: "play none none none" },
        }
      );
    }

    // ── Tags stagger ──
    const tagEls = tagsRef.current?.querySelectorAll(".tag-item");
    if (tagEls?.length) {
      gsap.fromTo(
        tagEls,
        { scale: 0.7, autoAlpha: 0 },
        {
          scale: 1, autoAlpha: 1, duration: 0.4, stagger: 0.05, ease: "back.out(2)",
          scrollTrigger: { trigger: tagsRef.current, start: "top 90%", toggleActions: "play none none none" },
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="home-container">
      {/* ── Navbar ── */}
      <NavBar value={{ handleLogout }} />

      {/* ── Hero ── */}
      <section className="hero">
        <div ref={blob1Ref} className="blob blob--green" />
        <div ref={blob2Ref} className="blob blob--blue" />

        <div className="hero__content">
          <div ref={badgeRef} className="hero__badge">
            <span className="hero__badge-dot" /> AI Powered
          </div>

          <h1 ref={h1Ref} className="hero__title">
            Save <em>everything</em><br />from everywhere.
          </h1>

          <p ref={subRef} className="hero__sub">
            Your digital life, finally in one place. Capture links, photos, and
            thoughts with AI powered organization that organizes your stuff.
          </p>
        </div>
      </section>

      {/* ── Note Banner ── */}
      <div ref={bannerRef} className="note-banner">
        <span className="note-banner__icon">💡</span>
        <span>
          <strong>Pro tip:</strong>{" "}
          <span className="note-banner__highlight">Create your folders first</span>{" "}
           Omni saves and sorts your data according to the folders you set up.
          Better folders = smarter organization.
        </span>
      </div>

      {/* ── Features ── */}
      <section className="section">
        <p className="section__label">Core Features</p>
        <h2 className="section__title">Everything you need to remember everything.</h2>
        <div className="cards-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card"
              ref={(el) => (cardsRef.current[i] = el)}
            >
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Graph ── */}
      <section className="graph-section">
        <div className="graph-section__info">
          <p className="section__label section__label--light">Knowledge Graph</p>
          <h2 className="graph-section__title">See your mind<br />come to life.</h2>
          <p className="graph-section__sub">
            Omni draws connections between everything you save links, notes, files
            and renders it as a live, interactive graph you can explore.
          </p>
        </div>
        <div className="graph-section__canvas">
          <MiniGraph />
        </div>
        <div className="graph-section__legend">
          {[["🟢", "Your saves"], ["🔵", "Related content"]].map(([dot, label]) => (
            <span key={label} className="legend-item">{dot} {label}</span>
          ))}
        </div>
      </section>

      {/* ── AI Tags ── */}
      <section className="section">
        <p className="section__label">AI Tags &amp; Summaries</p>
        <h2 className="section__title">Your content, always labeled.</h2>
        <p className="section__body">
          Omni reads what you save and instantly generates relevant tags and a short
          summary no typing needed.
        </p>
        <div ref={tagsRef} className="tags-row">
          {sampleTags.map((t, i) => (
            <span key={t} className={`tag-item ${i % 5 === 0 ? "tag-item--accent" : ""}`}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="cta-section__title">
          Ready to stop<br /><em>forgetting things?</em>
        </h2>
        <p className="cta-section__sub">
          Join thousands who've made Omni their second brain.
        </p>
        <button onClick={()=>navigate("/notes")} className="btn btn--cta">Get Started — It's Free</button>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <span className="footer__logo">Omni⬡</span>
        <span>© 2025 Omni. All rights reserved.</span>
        <span>Built with ❤️ for curious minds.</span>
      </footer>
    </div>
  );
};

export default Home;