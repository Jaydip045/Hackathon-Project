import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Plus, Camera, Heart, Calendar, X } from "lucide-react";

// ── Design Tokens ──────────────────────────────────────────────────
const SB = {
  parchment: "#f0e8d8",
  cream:     "#fdf9f0",
  cardBorder:"#ddd0b4",
  ink:       "#3d2414",
  inkMed:    "#7a5c42",
  inkFaded:  "#b09478",
  copper:    "#c87432",
  gold:      "#d4a853",
  goldLight: "#f0cc80",
  leather:   "#1a0d06",
  green:     "#4a7c59",
};

const WASHI = [
  "rgba(248,192,160,0.88)",
  "rgba(176,208,240,0.88)",
  "rgba(248,228,144,0.88)",
  "rgba(176,224,192,0.88)",
  "rgba(216,192,240,0.88)",
];

const PIN_COLORS = ["#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#d35400", "#16a085"];

// ── Memory Data ────────────────────────────────────────────────────
const MEMORIES_DATA = [
  {
    id: 1,
    label: "Santorini, Greece",
    location: "Oia · Fira",
    date: "Mar 2025",
    mood: "🌅",
    caption: "That last sunset... I stood there until the stars came out",
    washi: 0,
    rotate: "-2.8deg",
    photos: [
      "https://images.unsplash.com/photo-1497339047006-39f2b26f005d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1473866033898-b59c3da7e432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    ],
    pinColor: "#c0392b",
    liked: false,
    photoCount: 34,
  },
  {
    id: 2,
    label: "Venice, Italy",
    location: "San Marco · Rialto",
    date: "Apr 2025",
    mood: "🛶",
    caption: "No maps, no plans — just canals and getting blissfully lost",
    washi: 1,
    rotate: "1.9deg",
    photos: [
      "https://images.unsplash.com/photo-1653670477141-0a91c4f09408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    ],
    pinColor: "#2980b9",
    liked: true,
    photoCount: 22,
  },
  {
    id: 3,
    label: "Swiss Alps",
    location: "Interlaken · Jungfrau",
    date: "May 2025",
    mood: "🗻",
    caption: "Above the clouds, the world makes a different kind of sense",
    washi: 3,
    rotate: "-1.4deg",
    photos: [
      "https://images.unsplash.com/photo-1584212882409-aef913bb81ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1531169628054-ca3b3c1a7f4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    ],
    pinColor: "#27ae60",
    liked: false,
    photoCount: 41,
  },
  {
    id: 4,
    label: "Paris, France",
    location: "Le Marais · Montmartre",
    date: "Feb 2025",
    mood: "🗼",
    caption: "Parisian mornings with café au lait and a croissant are non-negotiable",
    washi: 2,
    rotate: "2.5deg",
    photos: [
      "https://images.unsplash.com/photo-1595441857632-71570ef36580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1551279880-03041531948b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    ],
    pinColor: "#8e44ad",
    liked: true,
    photoCount: 57,
  },
  {
    id: 5,
    label: "Maldives",
    location: "North Malé Atoll",
    date: "Jan 2025",
    mood: "🌊",
    caption: "Turquoise water so clear you forget which way is up",
    washi: 1,
    rotate: "-2.0deg",
    photos: [
      "https://images.unsplash.com/photo-1622779536320-bb5f5b501a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    ],
    pinColor: "#16a085",
    liked: false,
    photoCount: 28,
  },
  {
    id: 6,
    label: "Amalfi Coast, Italy",
    location: "Positano · Ravello",
    date: "Jun 2025",
    mood: "🍋",
    caption: "Cliffside villages and limoncello at sunset — Italy, you never disappoint",
    washi: 4,
    rotate: "1.3deg",
    photos: [
      "https://images.unsplash.com/photo-1752888444795-1775afa62e65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1519482816300-1490faa93b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1533588236350-8d12d9d2e97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    ],
    pinColor: "#d35400",
    liked: true,
    photoCount: 38,
  },
  {
    id: 7,
    label: "Golden Coast, Bali",
    location: "Seminyak · Canggu",
    date: "Mar 2025",
    mood: "🌺",
    caption: "Every evening the sky turned into a painting we didn't want to end",
    washi: 0,
    rotate: "-1.7deg",
    photos: [
      "https://images.unsplash.com/photo-1746215186951-285967178e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    ],
    pinColor: "#c0392b",
    liked: false,
    photoCount: 49,
  },
  {
    id: 8,
    label: "Himalayan Trek",
    location: "Nepal · Base Camp",
    date: "Oct 2024",
    mood: "🏔️",
    caption: "Each step upward felt like shedding everything that didn't matter",
    washi: 3,
    rotate: "2.1deg",
    photos: [
      "https://images.unsplash.com/photo-1639938793999-bbd7fd99f6b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1484910292437-025e5d13ce87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    ],
    pinColor: "#2980b9",
    liked: true,
    photoCount: 63,
  },
];

type MemoryItem = typeof MEMORIES_DATA[0] & { liked: boolean };

// ── Tape Corner ────────────────────────────────────────────────────
function TapeCorner({ side, color }: { side: "tl" | "tr" | "bl" | "br"; color: string }) {
  const base: React.CSSProperties = {
    position: "absolute", width: 34, height: 12,
    background: color, opacity: 0.85, borderRadius: 2,
    boxShadow: "0 1px 5px rgba(0,0,0,0.18)", pointerEvents: "none", zIndex: 25,
  };
  const pos: Record<string, React.CSSProperties> = {
    tl: { top: 6,  left: 6,  transform: "rotate(-43deg)" },
    tr: { top: 6,  right: 6, transform: "rotate(43deg)"  },
    bl: { bottom: 6, left: 6,  transform: "rotate(43deg)"  },
    br: { bottom: 6, right: 6, transform: "rotate(-43deg)" },
  };
  return <div style={{ ...base, ...pos[side] }} />;
}

// ── Paper Pin ──────────────────────────────────────────────────────
function PinDot({ color }: { color: string }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-30" style={{ top: -10 }}>
      <div style={{
        width: 16, height: 16, borderRadius: "50%",
        background: color, border: "2.5px solid rgba(255,255,255,0.9)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
      }} />
      {/* Pin shadow */}
      <div style={{ width: 4, height: 6, background: "rgba(0,0,0,0.2)", borderRadius: "0 0 2px 2px", margin: "0 auto", marginTop: -2 }} />
    </div>
  );
}

// ── Stacked Photo Polaroid ─────────────────────────────────────────
function MemoryCard({ memory, onToggleLike }: { memory: MemoryItem; onToggleLike: (id: number) => void }) {
  const [hovered, setHovered] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const stackRotations = [-5.5, 3.0, -1.5];
  const hoverRotations = [-12, 8, 0];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.82, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative cursor-pointer"
        style={{ transform: `rotate(${memory.rotate})`, transformOrigin: "center bottom" }}
        whileHover={{ y: -12, scale: 1.04, zIndex: 20 }}
      >
        <PinDot color={memory.pinColor} />

        {/* ─ Photo Stack ─ */}
        <div className="relative" style={{ marginTop: 12 }}>
          {/* Back photo layers */}
          {memory.photos.slice(0, 2).reverse().map((photo, idx) => (
            <motion.div
              key={idx}
              className="absolute inset-0"
              animate={{
                rotate: hovered
                  ? hoverRotations[idx]
                  : stackRotations[idx],
                x: hovered ? (idx === 0 ? -18 : -9) : 0,
                y: hovered ? idx * 4 : idx * 3,
                scale: hovered ? 0.95 : 1 - idx * 0.025,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: idx * 0.03 }}
              style={{
                background: "#fefefe",
                padding: "5px 5px 28px",
                borderRadius: 2,
                border: `1px solid ${SB.cardBorder}`,
                boxShadow: "2px 3px 8px rgba(0,0,0,0.15)",
                zIndex: 5 - idx,
              }}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" style={{ borderRadius: 1, display: "block", height: 140, width: "100%" }} />
            </motion.div>
          ))}

          {/* Front (top) photo */}
          <motion.div
            onClick={() => setLightbox(true)}
            animate={{ rotate: hovered ? hoverRotations[2] : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{
              position: "relative",
              background: "#fefefe",
              padding: "6px 6px 36px",
              borderRadius: 2,
              border: `1px solid ${SB.cardBorder}`,
              boxShadow: hovered
                ? "4px 6px 0 #c8b890, 5px 10px 22px rgba(100,60,20,0.22)"
                : "3px 4px 0 #d8c8a0, 4px 7px 14px rgba(100,60,20,0.16)",
              zIndex: 10,
              transition: "box-shadow 0.25s ease",
            }}
          >
            <TapeCorner side="tl" color={WASHI[memory.washi]} />
            <TapeCorner side="tr" color={WASHI[(memory.washi + 2) % 5]} />

            {/* Photo */}
            <div className="relative overflow-hidden" style={{ borderRadius: 1.5, height: 145 }}>
              <motion.img
                src={memory.photos[0]} alt={memory.label}
                className="w-full h-full object-cover"
                animate={{ scale: hovered ? 1.08 : 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              {/* Cinematic overlay */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,13,6,0.65) 0%, transparent 55%)", borderRadius: 1.5 }} />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 15% 15%, rgba(255,220,160,0.09) 0%, transparent 50%)", borderRadius: 1.5 }} />

              {/* Mood emoji */}
              <div className="absolute top-2 right-2" style={{ fontSize: 18, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}>{memory.mood}</div>

              {/* Photo count badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1"
                style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(6px)", borderRadius: 10, padding: "2px 7px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <Camera style={{ width: 9, height: 9, color: "rgba(255,255,255,0.8)" }} />
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "rgba(255,255,255,0.85)" }}>{memory.photoCount}</span>
              </div>

              {/* Hover reveal: view all overlay */}
              <AnimatePresence>
                {hovered && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(26,13,6,0.4)", backdropFilter: "blur(2px)" }}
                  >
                    <div style={{ background: "rgba(253,249,240,0.95)", borderRadius: 2, padding: "5px 12px", border: `1px solid ${SB.cardBorder}`, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                      <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.copper, letterSpacing: "0.15em", fontWeight: "bold" }}>OPEN ALBUM →</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Location bottom-left */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center gap-1">
                  <MapPin style={{ width: 8, height: 8, color: "rgba(255,255,255,0.75)", flexShrink: 0 }} />
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: 7.5, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{memory.location.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Polaroid caption area */}
            <div style={{ paddingTop: 8, paddingLeft: 3, paddingRight: 3 }}>
              {/* Date */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Calendar style={{ width: 8, height: 8, color: SB.inkFaded }} />
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 7.5, color: SB.inkFaded, letterSpacing: "0.1em" }}>{memory.date.toUpperCase()}</span>
                </div>
                <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                  onClick={e => { e.stopPropagation(); onToggleLike(memory.id); }}>
                  <Heart style={{ width: 12, height: 12, color: memory.liked ? "#c0392b" : SB.inkFaded }} fill={memory.liked ? "#c0392b" : "none"} />
                </motion.button>
              </div>

              {/* Handwritten label */}
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: SB.ink, lineHeight: 1.2, marginBottom: 3 }}>{memory.label}</p>

              {/* Caption (italic, faded) */}
              <p style={{ fontFamily: "Georgia, serif", fontSize: 10.5, color: SB.inkFaded, fontStyle: "italic", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                "{memory.caption}"
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ─ Lightbox ─ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(10,5,2,0.88)", backdropFilter: "blur(12px)" }}
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, rotate: -3 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fefefe", padding: "10px 10px 44px", maxWidth: 480, width: "100%", borderRadius: 3, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            >
              <TapeCorner side="tl" color={WASHI[memory.washi]} />
              <TapeCorner side="tr" color={WASHI[(memory.washi + 2) % 5]} />
              <img src={memory.photos[0]} alt={memory.label} className="w-full object-cover" style={{ borderRadius: 2, maxHeight: 340, height: "auto" }} />
              <div style={{ paddingTop: 12, paddingLeft: 6 }}>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: SB.ink }}>{memory.label}</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: SB.inkFaded, fontStyle: "italic", marginTop: 4 }}>"{memory.caption}"</p>
                <div className="flex items-center gap-2 mt-3">
                  <MapPin style={{ width: 12, height: 12, color: SB.copper }} />
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: SB.copper, letterSpacing: "0.1em" }}>{memory.location.toUpperCase()}</span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: SB.inkFaded, marginLeft: "auto" }}>{memory.date}</span>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setLightbox(false)}
                className="absolute top-3 right-3"
                style={{ background: "rgba(60,30,10,0.1)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${SB.cardBorder}` }}>
                <X style={{ width: 14, height: 14, color: SB.inkMed }} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Add Memory Card ────────────────────────────────────────────────
function AddMemoryCard() {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03, zIndex: 15 }}
      className="cursor-pointer"
      style={{ transform: "rotate(1.5deg)", transformOrigin: "center bottom" }}
    >
      <div style={{ marginTop: 12 }}>
        <div style={{
          background: "#fefefe",
          padding: "6px 6px 36px",
          borderRadius: 2,
          border: `2px dashed ${SB.cardBorder}`,
          boxShadow: "2px 3px 8px rgba(100,60,20,0.08)",
        }}>
          <div className="flex flex-col items-center justify-center" style={{ height: 145, background: SB.parchment, borderRadius: 1.5 }}>
            <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
              <Plus style={{ width: 24, height: 24, color: SB.copper, opacity: 0.7 }} />
            </motion.div>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: SB.inkFaded, marginTop: 6 }}>Add memory</p>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8.5, color: SB.inkFaded, letterSpacing: "0.1em", marginTop: 2, opacity: 0.6 }}>+ UPLOAD PHOTOS</p>
          </div>
          <div style={{ paddingTop: 10, paddingLeft: 3 }}>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: SB.inkFaded }}>new adventure</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 10.5, color: SB.inkFaded, fontStyle: "italic" }}>"your story here..."</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stats Bar ──────────────────────────────────────────────────────
function AlbumStats({ memories }: { memories: MemoryItem[] }) {
  const liked = memories.filter(m => m.liked).length;
  const totalPhotos = memories.reduce((acc, m) => acc + m.photoCount, 0);
  const countries = new Set(memories.map(m => m.location.split("·")[1]?.trim())).size;

  return (
    <div className="flex gap-4 flex-wrap">
      {[
        { label: "Memories", value: memories.length, emoji: "📸" },
        { label: "Photos", value: totalPhotos, emoji: "🖼️" },
        { label: "Places", value: countries, emoji: "📍" },
        { label: "Favourites", value: liked, emoji: "❤️" },
      ].map(stat => (
        <motion.div key={stat.label} whileHover={{ y: -2 }}
          style={{
            background: SB.cream, border: `1px solid ${SB.cardBorder}`,
            borderRadius: 3, padding: "8px 14px", textAlign: "center",
            boxShadow: "1px 1px 4px rgba(100,60,20,0.08)", flexShrink: 0,
          }}>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: SB.ink, lineHeight: 1 }}>{stat.emoji} {stat.value}</p>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded, letterSpacing: "0.12em" }}>{stat.label.toUpperCase()}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ── Film Strip Footer ──────────────────────────────────────────────
function FilmStrip({ memories }: { memories: MemoryItem[] }) {
  return (
    <div className="relative overflow-hidden" style={{ marginTop: 28 }}>
      {/* Film border top */}
      <div style={{ height: 20, background: SB.leather, display: "flex", alignItems: "center", paddingLeft: 8, gap: 8, borderRadius: "3px 3px 0 0" }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{ width: 18, height: 12, background: SB.parchment, borderRadius: 1, flexShrink: 0, opacity: 0.35 }} />
        ))}
      </div>

      {/* Film frames */}
      <div className="flex gap-1 overflow-x-auto" style={{ background: SB.leather, padding: "6px 8px", scrollbarWidth: "none" }}>
        {memories.map((m, i) => (
          <motion.div key={m.id}
            whileHover={{ scale: 1.06, y: -2, zIndex: 5 }}
            className="flex-shrink-0 cursor-pointer relative"
            style={{ width: 80, height: 60, background: "#222", borderRadius: 1, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.1)" }}
          >
            <img src={m.photos[0]} alt={m.label} className="w-full h-full object-cover" style={{ opacity: 0.82 }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
            <p className="absolute bottom-1 left-1 right-1 text-center" style={{ fontFamily: "'Courier New', monospace", fontSize: 6, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{i + 1}</p>
          </motion.div>
        ))}
      </div>

      {/* Film border bottom */}
      <div style={{ height: 20, background: SB.leather, display: "flex", alignItems: "center", paddingLeft: 8, gap: 8, borderRadius: "0 0 3px 3px" }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{ width: 18, height: 12, background: SB.parchment, borderRadius: 1, flexShrink: 0, opacity: 0.35 }} />
        ))}
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────
export function MemoriesSection({ memories: _m }: { memories: any[] }) {
  const [memoriesState, setMemoriesState] = useState<MemoryItem[]>(
    MEMORIES_DATA.map(m => ({ ...m }))
  );

  const toggleLike = (id: number) => {
    setMemoriesState(prev => prev.map(m => m.id === id ? { ...m, liked: !m.liked } : m));
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Camera style={{ width: 22, height: 22, color: SB.copper }} />
            <h2 style={{ fontFamily: "Georgia, serif", color: SB.ink, letterSpacing: "-0.01em" }}>Memory Journal</h2>
          </div>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: SB.inkFaded }}>Your personal travel album — every photo tells a story ✦</p>
        </div>
        <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 flex-shrink-0"
          style={{ padding: "9px 16px", background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`, color: "white", borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 600, boxShadow: `2px 2px 8px ${SB.copper}45` }}>
          <Plus style={{ width: 15, height: 15 }} /> Add Memory
        </motion.button>
      </div>

      {/* Stats */}
      <div className="mb-5">
        <AlbumStats memories={memoriesState} />
      </div>

      {/* Divider */}
      <div className="h-px mb-6" style={{ background: `linear-gradient(90deg, ${SB.copper}60, transparent)` }} />

      {/* ── Cork Board ── */}
      <div className="relative rounded-sm p-6 md:p-8" style={{
        background: "linear-gradient(135deg, #c49a6c 0%, #b8825a 40%, #c49a6c 80%, #a87248 100%)",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.22), 0 4px 20px rgba(100,60,20,0.18)",
      }}>
        {/* Cork grain */}
        <div className="absolute inset-0 rounded-sm pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse 2.5px 2px at 50% 50%, rgba(160,100,40,0.4) 0%, transparent 100%)", backgroundSize: "7px 7px", opacity: 0.55 }} />

        {/* Cork wood grain lines */}
        <div className="absolute inset-0 rounded-sm pointer-events-none opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(160deg, rgba(100,50,10,0.3) 0px, transparent 3px, transparent 18px, rgba(100,50,10,0.2) 21px)" }} />

        {/* Board label */}
        <div className="absolute top-3 right-4 opacity-40">
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.leather, letterSpacing: "0.2em", transform: "rotate(2deg)" }}>KHUSHI'S TRAVEL BOARD</p>
        </div>

        {/* Grid of polaroids */}
        <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10" style={{ paddingTop: 14 }}>
          {memoriesState.map((memory, i) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.78, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 130, damping: 17 }}
            >
              <MemoryCard memory={memory} onToggleLike={toggleLike} />
            </motion.div>
          ))}

          {/* Add card */}
          <AddMemoryCard />
        </div>
      </div>

      {/* ── Film Strip ── */}
      <FilmStrip memories={memoriesState} />

      {/* Bottom tagline */}
      <div className="flex items-center gap-3 justify-center mt-5">
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${SB.cardBorder})` }} />
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: SB.inkFaded }}>✦ collect moments, not things</p>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${SB.cardBorder})` }} />
      </div>
    </div>
  );
}
