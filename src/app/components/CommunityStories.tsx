import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Share2, MapPin, Bookmark, MessageCircle, Globe, Plus, Eye } from "lucide-react";

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
};

const WASHI = [
  "rgba(248,192,160,0.88)",
  "rgba(176,208,240,0.88)",
  "rgba(248,228,144,0.88)",
  "rgba(176,224,192,0.88)",
  "rgba(216,192,240,0.88)",
];

// ── Story Data ─────────────────────────────────────────────────────
const STORIES = [
  {
    id: 0,
    user: "WanderWithMe",
    handle: "@wanderwithme",
    avatar: "WM",
    avatarGrad: "from-blue-400 to-purple-500",
    location: "Bali, Indonesia",
    country: "🇮🇩",
    days: "7 DAYS",
    img: "https://images.unsplash.com/photo-1581665334521-ac9a6f6b4be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    caption: "Lost between rice terraces and temple incense — Bali rewired something deep inside me. The kind of peace you only find when you stop looking for it.",
    tags: ["🌿 Nature", "🏝️ Tropical", "🧘 Wellness"],
    reactions: { "❤️": 1247, "🌍": 342, "✈️": 98, "📸": 231 },
    stamp: "BALI · INDONESIA",
    stampColor: "#27ae60",
    washi: 3,
    rotate: "-1.2deg",
    featured: true,
    category: "Asia",
    readTime: "4 min read",
    views: "8.4K",
  },
  {
    id: 1,
    user: "RoamNExplore",
    handle: "@roamnexplore",
    avatar: "RE",
    avatarGrad: "from-green-400 to-teal-500",
    location: "Iceland Roadtrip",
    country: "🇮🇸",
    days: "10 DAYS",
    img: "https://images.unsplash.com/photo-1556896594-215e77578507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    caption: "We chased the Northern Lights for 6 nights and caught them on the last. Some things are worth every freezing, hopeful hour.",
    tags: ["🌌 Aurora", "❄️ Arctic", "🚗 Road Trip"],
    reactions: { "❤️": 892, "🌍": 210, "✈️": 145, "📸": 178 },
    stamp: "ICELAND · ROAD",
    stampColor: "#2980b9",
    washi: 1,
    rotate: "1.4deg",
    featured: false,
    category: "Europe",
    readTime: "6 min read",
    views: "5.1K",
  },
  {
    id: 2,
    user: "SunsetChaser",
    handle: "@sunsetchaser",
    avatar: "SC",
    avatarGrad: "from-orange-400 to-red-500",
    location: "Santorini, Greece",
    country: "🇬🇷",
    days: "5 DAYS",
    img: "https://images.unsplash.com/photo-1497339047006-39f2b26f005d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    caption: "Oia at golden hour is not a cliché. It is a promise the sky keeps every single evening. I watched it from the same wall three nights in a row.",
    tags: ["🌅 Sunset", "🍷 Food", "🏛️ Culture"],
    reactions: { "❤️": 2413, "🌍": 521, "✈️": 203, "📸": 487 },
    stamp: "SANTORINI · GR",
    stampColor: "#8e44ad",
    washi: 0,
    rotate: "-0.8deg",
    featured: false,
    category: "Europe",
    readTime: "3 min read",
    views: "12.7K",
  },
  {
    id: 3,
    user: "KyotoWanderer",
    handle: "@kyotowanderer",
    avatar: "KW",
    avatarGrad: "from-pink-400 to-rose-500",
    location: "Kyoto, Japan",
    country: "🇯🇵",
    days: "8 DAYS",
    img: "https://images.unsplash.com/photo-1724325095172-71da0b904c8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    caption: "Cherry blossom season in Kyoto lasts only two weeks. I timed it perfectly by accident and have never felt luckier in my life.",
    tags: ["🌸 Sakura", "🍵 Tea", "⛩️ Temples"],
    reactions: { "❤️": 3102, "🌍": 612, "✈️": 290, "📸": 548 },
    stamp: "KYOTO · JAPAN",
    stampColor: "#c0392b",
    washi: 4,
    rotate: "1.0deg",
    featured: false,
    category: "Asia",
    readTime: "5 min read",
    views: "18.3K",
  },
  {
    id: 4,
    user: "EndOfTheWorld_",
    handle: "@endoftheworld_",
    avatar: "EW",
    avatarGrad: "from-slate-400 to-blue-600",
    location: "Patagonia, Argentina",
    country: "🇦🇷",
    days: "14 DAYS",
    img: "https://images.unsplash.com/photo-1684419316084-65b5ac128280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    caption: "Torres del Paine tested every limit I had. Cold mornings, aching legs, and the most profound silence I've ever heard.",
    tags: ["🏔️ Trekking", "🌊 Glaciers", "🦁 Wildlife"],
    reactions: { "❤️": 1589, "🌍": 402, "✈️": 176, "📸": 299 },
    stamp: "PATAGONIA · AR",
    stampColor: "#16a085",
    washi: 1,
    rotate: "-1.6deg",
    featured: false,
    category: "Americas",
    readTime: "8 min read",
    views: "9.2K",
  },
  {
    id: 5,
    user: "SandDuneJo",
    handle: "@sanddunejoe",
    avatar: "SJ",
    avatarGrad: "from-amber-400 to-orange-500",
    location: "Sahara, Morocco",
    country: "🇲🇦",
    days: "9 DAYS",
    img: "https://images.unsplash.com/photo-1507812335255-961c6cb5d7cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    caption: "We slept under the Sahara stars in a camel-hair tent. The silence was so total I could hear my own heartbeat. Merzouga changed everything.",
    tags: ["🐪 Desert", "⭐ Stargazing", "🕌 Culture"],
    reactions: { "❤️": 1034, "🌍": 287, "✈️": 132, "📸": 219 },
    stamp: "MOROCCO · SAHARA",
    stampColor: "#d35400",
    washi: 2,
    rotate: "0.7deg",
    featured: false,
    category: "Africa",
    readTime: "5 min read",
    views: "6.8K",
  },
];

const FILTERS = ["All", "Asia", "Europe", "Americas", "Africa"];

// ── Primitives ─────────────────────────────────────────────────────
function TapeCorner({ side, color }: { side: "tl" | "tr" | "bl" | "br"; color: string }) {
  const base: React.CSSProperties = {
    position: "absolute", width: 38, height: 13,
    background: color, opacity: 0.84, borderRadius: 2,
    boxShadow: "0 1px 5px rgba(0,0,0,0.18)", pointerEvents: "none", zIndex: 20,
  };
  const pos: Record<string, React.CSSProperties> = {
    tl: { top: 7,  left: 7,  transform: "rotate(-45deg)", transformOrigin: "center" },
    tr: { top: 7,  right: 7, transform: "rotate(45deg)",  transformOrigin: "center" },
    bl: { bottom: 7, left: 7,  transform: "rotate(45deg)",  transformOrigin: "center" },
    br: { bottom: 7, right: 7, transform: "rotate(-45deg)", transformOrigin: "center" },
  };
  return <div style={{ ...base, ...pos[side] }} />;
}

function TravelStamp({ text, color = "#8b2020", rotate = -3 }: { text: string; color?: string; rotate?: number }) {
  return (
    <div style={{
      display: "inline-block", border: `2px solid ${color}`,
      padding: "2px 7px", transform: `rotate(${rotate}deg)`, opacity: 0.82,
      background: "rgba(255,255,255,0.08)",
    }}>
      <p style={{
        fontFamily: "'Courier New', monospace", fontSize: 7.5,
        color, letterSpacing: "0.18em", fontWeight: "bold", whiteSpace: "nowrap",
      }}>{text}</p>
    </div>
  );
}

function ReactionsRow({ reactions }: { reactions: Record<string, number> }) {
  const [local, setLocal] = useState(reactions);
  const [liked, setLiked] = useState<string[]>([]);
  const toggle = (e: string) => {
    setLocal(r => ({ ...r, [e]: r[e] + (liked.includes(e) ? -1 : 1) }));
    setLiked(l => liked.includes(e) ? l.filter(x => x !== e) : [...l, e]);
  };
  return (
    <div className="flex gap-1.5 flex-wrap">
      {Object.entries(local).map(([emoji, count]) => (
        <motion.button key={emoji}
          whileHover={{ scale: 1.18, y: -2 }} whileTap={{ scale: 0.9 }}
          onClick={() => toggle(emoji)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "3px 9px", borderRadius: 20,
            background: liked.includes(emoji) ? `rgba(200,116,50,0.15)` : "rgba(253,249,240,0.92)",
            border: `1px solid ${liked.includes(emoji) ? SB.copper : SB.cardBorder}`,
            backdropFilter: "blur(6px)",
            boxShadow: liked.includes(emoji) ? `0 0 0 1px ${SB.copper}30` : "none",
            transition: "all 0.18s ease",
          }}>
          <span style={{ fontSize: 11 }}>{emoji}</span>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8.5, color: SB.ink }}>
            {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// ── Featured Hero Card ─────────────────────────────────────────────
function FeaturedStoryCard({ story }: { story: typeof STORIES[0] }) {
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-8 group"
    >
      {/* Washi tape strip top-center */}
      <div className="absolute left-1/2 -translate-x-1/2 z-30" style={{ top: -10, width: 72, height: 16, background: WASHI[story.washi], borderRadius: 3, boxShadow: "0 2px 6px rgba(0,0,0,0.14)", transform: "translateX(-50%) rotate(-0.5deg)" }} />

      <div className="relative overflow-hidden" style={{
        background: SB.cream,
        border: `1px solid ${SB.cardBorder}`,
        borderRadius: 4,
        boxShadow: "4px 5px 0 #d8c8a0, 5px 9px 28px rgba(100,60,20,0.14)",
        padding: "8px 8px 20px",
      }}>
        <TapeCorner side="tl" color={WASHI[story.washi]} />
        <TapeCorner side="tr" color={WASHI[(story.washi + 2) % 5]} />

        {/* Cinematic photo */}
        <div className="relative overflow-hidden" style={{ borderRadius: 2, height: 340 }}>
          <motion.img
            src={story.img} alt={story.location}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          {/* Layered cinematic overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,13,6,0.88) 0%, rgba(26,13,6,0.35) 55%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 80%, rgba(200,116,50,0.18) 0%, transparent 60%)" }} />

          {/* FEATURED badge */}
          <div className="absolute top-4 left-4">
            <div style={{ background: "rgba(200,116,50,0.9)", backdropFilter: "blur(8px)", borderRadius: 2, padding: "3px 10px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "white", letterSpacing: "0.22em", fontWeight: "bold" }}>✦ FEATURED STORY</p>
            </div>
          </div>

          {/* Days + views badges */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <TravelStamp text={story.days} color="rgba(255,255,255,0.85)" rotate={2} />
            <div className="flex items-center gap-1" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", borderRadius: 20, padding: "2px 8px", border: "1px solid rgba(255,255,255,0.12)" }}>
              <Eye style={{ width: 10, height: 10, color: "rgba(255,255,255,0.8)" }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "rgba(255,255,255,0.8)" }}>{story.views}</span>
            </div>
          </div>

          {/* Author + location bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 bg-gradient-to-br ${story.avatarGrad} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/30 flex-shrink-0`} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>{story.avatar}</div>
                <div>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "white", fontWeight: 600 }}>{story.user}</p>
                  <div className="flex items-center gap-1.5">
                    <MapPin style={{ width: 10, height: 10, color: "rgba(255,255,255,0.65)" }} />
                    <p style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{story.location} {story.country}</p>
                  </div>
                </div>
              </div>
              <TravelStamp text={story.stamp} color={story.stampColor} rotate={3} />
            </div>
          </div>
        </div>

        {/* Story body */}
        <div className="pt-4 px-2">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-3">
            {story.tags.map(tag => (
              <span key={tag} style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: SB.inkMed, background: SB.parchment, border: `1px solid ${SB.cardBorder}`, borderRadius: 2, padding: "2px 8px", letterSpacing: "0.08em" }}>{tag}</span>
            ))}
          </div>

          <p style={{ fontFamily: "Georgia, serif", fontSize: 14.5, color: SB.ink, lineHeight: 1.7, fontStyle: "italic", marginBottom: 14 }}>
            "{story.caption}"
          </p>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <ReactionsRow reactions={story.reactions} />
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: SB.inkFaded }}>⏱ {story.readTime}</span>
              <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                onClick={() => setBookmarked(b => !b)}
                style={{ padding: "7px 14px", background: bookmarked ? `rgba(200,116,50,0.15)` : SB.parchment, border: `1px solid ${bookmarked ? SB.copper : SB.cardBorder}`, borderRadius: 3, color: bookmarked ? SB.copper : SB.inkMed, display: "flex", alignItems: "center", gap: 5, boxShadow: "1px 1px 4px rgba(100,60,20,0.1)" }}>
                <Bookmark style={{ width: 13, height: 13 }} fill={bookmarked ? SB.copper : "none"} />
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: "0.1em" }}>SAVE</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                style={{ padding: "7px 18px", background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`, border: "none", borderRadius: 3, color: "white", display: "flex", alignItems: "center", gap: 5, boxShadow: `2px 2px 8px ${SB.copper}45` }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 12, fontWeight: 600 }}>Read Full Story</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Polaroid Story Card ────────────────────────────────────────────
function StoryCard({ story, delay = 0 }: { story: typeof STORIES[0]; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay, type: "spring", stiffness: 160, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.02, zIndex: 15 }}
      className="cursor-pointer group"
      style={{ transformOrigin: "center bottom", transform: `rotate(${story.rotate})` }}
    >
      {/* Washi tape top strip */}
      <div className="flex justify-center" style={{ marginBottom: -8, position: "relative", zIndex: 25 }}>
        <div style={{ width: 58, height: 16, background: WASHI[story.washi], borderRadius: 3, boxShadow: "0 1px 5px rgba(0,0,0,0.16)", transform: `rotate(${parseFloat(story.rotate) * 0.5}deg)` }} />
      </div>

      {/* Polaroid body */}
      <div style={{
        background: "#fefefe",
        padding: "7px 7px 36px",
        boxShadow: hovered ? "5px 7px 0 #c8b890, 6px 12px 28px rgba(100,60,20,0.22)" : "3px 4px 0 #d8c8a0, 4px 7px 16px rgba(100,60,20,0.14)",
        borderRadius: 2,
        border: `1px solid ${SB.cardBorder}`,
        position: "relative",
        transition: "box-shadow 0.25s ease",
      }}>
        <TapeCorner side="tl" color={WASHI[story.washi]} />
        <TapeCorner side="tr" color={WASHI[(story.washi + 2) % 5]} />

        {/* Photo */}
        <div className="relative overflow-hidden" style={{ height: 210, borderRadius: 1.5 }}>
          <motion.img
            src={story.img} alt={story.location}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {/* Cinematic overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,13,6,0.82) 0%, rgba(26,13,6,0.25) 50%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 100%, rgba(200,116,50,0.15) 0%, transparent 55%)" }} />

          {/* Days badge top-right */}
          <div className="absolute top-3 right-3">
            <TravelStamp text={story.days} color="rgba(255,255,255,0.82)" rotate={2.5} />
          </div>

          {/* Country flag top-left */}
          <div className="absolute top-3 left-3" style={{ fontSize: 18, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}>{story.country}</div>

          {/* Hover reveal: destination stamp */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -5 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute top-1/2 left-1/2"
                style={{ transform: "translate(-50%, -60%)" }}
              >
                <div style={{
                  border: `2.5px solid ${story.stampColor}`,
                  padding: "5px 12px",
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(4px)",
                  textAlign: "center",
                }}>
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: story.stampColor, letterSpacing: "0.18em", fontWeight: "bold" }}>{story.stamp}</p>
                  <div style={{ height: 1, background: `${story.stampColor}60`, margin: "3px 0" }} />
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: 7.5, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em" }}>VISITED ✓</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom: author */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 bg-gradient-to-br ${story.avatarGrad} rounded-full flex items-center justify-center text-white text-[10px] font-bold border border-white/30 flex-shrink-0`}>{story.avatar}</div>
              <div>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 12, color: "white", fontWeight: 600, lineHeight: 1.1 }}>{story.user}</p>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em" }}>{story.handle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Polaroid bottom: caption + reactions */}
        <div style={{ paddingTop: 10, paddingLeft: 4, paddingRight: 4 }}>
          {/* Location */}
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin style={{ width: 9, height: 9, color: SB.copper, flexShrink: 0 }} />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: SB.copper, lineHeight: 1 }}>{story.location}</p>
          </div>

          {/* Handwritten caption */}
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 13.5, color: SB.inkMed, lineHeight: 1.45, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {story.caption}
          </p>

          {/* Tags */}
          <div className="flex gap-1 flex-wrap mb-3">
            {story.tags.slice(0, 2).map(t => (
              <span key={t} style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded, background: SB.parchment, border: `1px solid ${SB.cardBorder}60`, borderRadius: 2, padding: "1.5px 6px" }}>{t}</span>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2 items-center">
              <button className="flex items-center gap-1" style={{ color: SB.inkFaded }}
                onClick={e => { e.stopPropagation(); }}>
                <Heart style={{ width: 12, height: 12 }} />
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9 }}>{story.reactions["❤️"] >= 1000 ? `${(story.reactions["❤️"] / 1000).toFixed(1)}k` : story.reactions["❤️"]}</span>
              </button>
              <div className="flex items-center gap-1" style={{ color: SB.inkFaded }}>
                <Eye style={{ width: 11, height: 11 }} />
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9 }}>{story.views}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setBookmarked(b => !b)}
                style={{ color: bookmarked ? SB.copper : SB.inkFaded, transition: "color 0.2s" }}>
                <Bookmark style={{ width: 12, height: 12 }} fill={bookmarked ? SB.copper : "none"} />
              </motion.button>
              <motion.button
                whileHover={{ x: 1 }}
                style={{ fontFamily: "'Courier New', monospace", fontSize: 8.5, color: SB.copper, letterSpacing: "0.08em", border: `1px solid ${SB.copper}60`, borderRadius: 2, padding: "3px 8px", background: `rgba(200,116,50,0.06)`, whiteSpace: "nowrap" }}>
                READ →
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Export ────────────────────────────────────────────────────
export function CommunitySection({ communityTrips: _ct }: { communityTrips: any[] }) {
  const [filter, setFilter] = useState("All");

  const featured = STORIES[0];
  const gridStories = STORIES.slice(1).filter(s => filter === "All" || s.category === filter);

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Globe style={{ width: 22, height: 22, color: SB.copper }} />
              <h2 style={{ fontFamily: "Georgia, serif", color: SB.ink, letterSpacing: "-0.01em" }}>Stories from the Road</h2>
            </div>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: SB.inkFaded }}>Real adventures. Real explorers. Real feelings. ✦</p>
          </div>
          <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 flex-shrink-0"
            style={{ padding: "9px 16px", background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`, color: "white", borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 600, boxShadow: `2px 2px 8px ${SB.copper}45` }}>
            <Plus style={{ width: 15, height: 15 }} /> Share Your Story
          </motion.button>
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, ${SB.copper}60, transparent)` }} />

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <motion.button key={f} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
              onClick={() => setFilter(f)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 2,
                background: filter === f ? SB.copper : SB.cream,
                color: filter === f ? "white" : SB.inkMed,
                border: `1px solid ${filter === f ? SB.copper : SB.cardBorder}`,
                fontFamily: "'Courier New', monospace", fontSize: 9.5,
                letterSpacing: "0.12em", fontWeight: "bold",
                boxShadow: filter === f ? `2px 2px 6px ${SB.copper}40` : "1px 1px 3px rgba(100,60,20,0.08)",
                transition: "all 0.18s ease",
              }}>
              {f.toUpperCase()}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Featured Story ── */}
      <FeaturedStoryCard story={featured} />

      {/* ── Grid ── */}
      <AnimatePresence mode="wait">
        {gridStories.length > 0 ? (
          <motion.div
            key={filter}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4"
            style={{ paddingTop: 8 }}
          >
            {gridStories.map((story, i) => (
              <StoryCard key={story.id} story={story} delay={i * 0.07} />
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-14 text-center"
            style={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, borderRadius: 4, boxShadow: "inset 0 2px 8px rgba(100,60,20,0.04)" }}>
            <Globe style={{ width: 32, height: 32, color: SB.inkFaded, margin: "0 auto 8px", opacity: 0.4 }} />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: SB.inkMed }}>No stories yet from {filter}</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: SB.inkFaded, fontStyle: "italic", marginTop: 4 }}>Be the first explorer to share one!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom tagline ── */}
      <div className="flex items-center gap-3 justify-center mt-6">
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${SB.cardBorder})` }} />
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: SB.inkFaded }}>✦ every journey is a story worth telling</p>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${SB.cardBorder})` }} />
      </div>
    </div>
  );
}
