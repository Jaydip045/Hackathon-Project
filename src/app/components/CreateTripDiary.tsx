import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check, ChevronLeft, ChevronRight, DollarSign,
  Calendar, Plane, MapPin, Compass, Plus,
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────
const SB = {
  parchment: "#f0e8d8",
  cream: "#fdf9f0",
  cardBorder: "#ddd0b4",
  ink: "#3d2414",
  inkMed: "#7a5c42",
  inkFaded: "#b09478",
  copper: "#c87432",
  gold: "#d4a853",
  goldLight: "#f0cc80",
  green: "#4a7c59",
  leather: "#1a0d06",
};

const WASHI = [
  "rgba(248,192,160,0.85)",
  "rgba(176,208,240,0.85)",
  "rgba(248,228,144,0.85)",
  "rgba(176,224,192,0.85)",
  "rgba(216,192,240,0.85)",
];

// ─── Destination Catalogue ────────────────────────────────────────
const DESTINATIONS = [
  {
    name: "Paris", emoji: "🗼", region: "France",
    img: "https://images.unsplash.com/photo-1684931233367-314cc35f4a08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    coords: "48°51'N · 2°20'E", color: WASHI[0],
  },
  {
    name: "Bali", emoji: "🏝️", region: "Indonesia",
    img: "https://images.unsplash.com/photo-1576475706812-822620fc23ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    coords: "8°40'S · 115°12'E", color: WASHI[3],
  },
  {
    name: "Swiss Alps", emoji: "🗻", region: "Switzerland",
    img: "https://images.unsplash.com/photo-1614703428261-09e1ac47199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    coords: "46°33'N · 8°10'E", color: WASHI[1],
  },
  {
    name: "Tokyo", emoji: "🎌", region: "Japan",
    img: "https://images.unsplash.com/photo-1770738020602-6481d583369d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    coords: "35°41'N · 139°41'E", color: WASHI[4],
  },
  {
    name: "Rome", emoji: "🏛️", region: "Italy",
    img: "https://images.unsplash.com/photo-1709662726160-789b143ec962?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    coords: "41°54'N · 12°28'E", color: WASHI[0],
  },
  {
    name: "Santorini", emoji: "🌊", region: "Greece",
    img: "https://images.unsplash.com/photo-1719607526486-96f27a995fcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    coords: "36°22'N · 25°28'E", color: WASHI[1],
  },
  {
    name: "New York", emoji: "🗽", region: "USA",
    img: "https://images.unsplash.com/photo-1651608034107-12b95f5b2088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    coords: "40°42'N · 74°00'W", color: WASHI[2],
  },
  {
    name: "Iceland", emoji: "🌋", region: "Iceland",
    img: "https://images.unsplash.com/photo-1681834418277-b01c30279693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    coords: "64°08'N · 21°56'W", color: WASHI[3],
  },
];

const DEFAULT_IMG = "https://images.unsplash.com/photo-1576475706812-822620fc23ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

// ─── Animation Variants (GSAP-feel) ──────────────────────────────
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const childV = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.52, ease: EXPO_OUT },
  },
  exit: {
    opacity: 0, y: -14, filter: "blur(6px)",
    transition: { duration: 0.24, ease: "easeIn" },
  },
};

const slideForward = {
  hidden: { opacity: 0, x: 56, filter: "blur(10px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.48, ease: EXPO_OUT } },
  exit: { opacity: 0, x: -40, filter: "blur(8px)", transition: { duration: 0.22, ease: "easeIn" } },
};

const slideBackward = {
  hidden: { opacity: 0, x: -56, filter: "blur(10px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.48, ease: EXPO_OUT } },
  exit: { opacity: 0, x: 40, filter: "blur(8px)", transition: { duration: 0.22, ease: "easeIn" } },
};

// ─── Coordinate Grid ──────────────────────────────────────────────
function MapGrid() {
  const h = [0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 0.94];
  const v = [0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88, 0.97];
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.18 }}>
      {h.map(y => (
        <line key={y} x1="0%" y1={`${y * 100}%`} x2="100%" y2={`${y * 100}%`} stroke="white" strokeWidth="0.6" />
      ))}
      {v.map(x => (
        <line key={x} x1={`${x * 100}%`} y1="0%" x2={`${x * 100}%`} y2="100%" stroke="white" strokeWidth="0.6" />
      ))}
      <ellipse cx="50%" cy="50%" rx="48%" ry="46%" stroke="white" strokeWidth="0.5" fill="none" opacity="0.35" />
      <ellipse cx="50%" cy="50%" rx="48%" ry="22%" stroke="white" strokeWidth="0.4" fill="none" opacity="0.2" />
      <ellipse cx="50%" cy="50%" rx="24%" ry="46%" stroke="white" strokeWidth="0.4" fill="none" opacity="0.2" />
    </svg>
  );
}

// ─── Compass Rose ─────────────────────────────────────────────────
function CompassRose() {
  return (
    <motion.div
      animate={{ rotate: [0, 2, 0, -2, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 64 64" style={{ width: 52, height: 52 }}>
        {/* N point (gold) */}
        <polygon points="32,4 37,28 32,24 27,28" fill={SB.gold} opacity="0.9" />
        {/* S point */}
        <polygon points="32,60 37,36 32,40 27,36" fill="rgba(255,255,255,0.45)" />
        {/* E point */}
        <polygon points="60,32 36,37 40,32 36,27" fill="rgba(255,255,255,0.45)" />
        {/* W point */}
        <polygon points="4,32 28,37 24,32 28,27" fill="rgba(255,255,255,0.45)" />
        {/* Center ring */}
        <circle cx="32" cy="32" r="5" fill={SB.gold} opacity="0.85" />
        <circle cx="32" cy="32" r="2.5" fill={SB.leather} />
        {/* Outer ring */}
        <circle cx="32" cy="32" r="16" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="none" />
        <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" strokeDasharray="3 5" />
        {/* N label */}
        <text x="30" y="15" fill={SB.gold} fontSize="7" fontFamily="'Courier New',monospace" fontWeight="bold" opacity="0.9">N</text>
      </svg>
    </motion.div>
  );
}

// ─── Animated Route Arc ───────────────────────────────────────────
function RouteArc({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.svg
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 4 }}
        >
          <motion.path
            d="M 15% 78% Q 50% 15% 82% 55%"
            stroke={SB.gold}
            strokeWidth="1.2"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.55"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          {/* Origin dot */}
          <circle cx="15%" cy="78%" r="3" fill={SB.gold} opacity="0.7" />
          {/* Destination pulsing dot */}
          <circle cx="82%" cy="55%" r="4" fill={SB.gold} opacity="0.8">
            <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Animated plane */}
          <motion.text fontSize="13" fill="white" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}
            initial={{ offsetDistance: "0%", offsetPath: "path('M 15% 78% Q 50% 15% 82% 55%')" } as any}
            animate={{ offsetDistance: "100%" } as any}
            transition={{ duration: 2.5, delay: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}>
            ✈
          </motion.text>
        </motion.svg>
      )}
    </AnimatePresence>
  );
}

// ─── Left Map Panel ───────────────────────────────────────────────
function MapPanel({ data, selectedDest }: { data: any; selectedDest: any }) {
  const img = selectedDest?.img || DEFAULT_IMG;

  return (
    <div className="relative overflow-hidden flex-shrink-0"
      style={{ width: "42%", background: SB.leather }}>

      {/* Background image with crossfade */}
      <AnimatePresence>
        <motion.img
          key={img}
          src={img}
          alt="destination"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(135deg, rgba(26,13,6,0.72) 0%, rgba(26,13,6,0.4) 50%, rgba(26,13,6,0.65) 100%)" }} />
      <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(200,116,50,0.12) 0%, transparent 60%)" }} />

      {/* Coordinate grid */}
      <div className="absolute inset-0 z-20"><MapGrid /></div>

      {/* Route arc */}
      <div className="absolute inset-0 z-25">
        <RouteArc visible={!!selectedDest} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-30 flex flex-col justify-between p-5">
        {/* Top: coordinates + compass */}
        <div className="flex items-start justify-between">
          <div>
            <AnimatePresence mode="wait">
              {selectedDest ? (
                <motion.div key={selectedDest.name}
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}>
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: SB.gold, letterSpacing: "0.2em", marginBottom: 2 }}>
                    DESTINATION LOCKED
                  </p>
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em" }}>
                    {selectedDest.coords}
                  </p>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: "white", lineHeight: 1.1, marginTop: 4 }}>
                    {selectedDest.emoji} {selectedDest.name}
                  </p>
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em" }}>
                    {selectedDest.region.toUpperCase()}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: SB.gold, letterSpacing: "0.2em", marginBottom: 2 }}>
                    TRAVELOOP DIARY
                  </p>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: "rgba(255,255,255,0.8)", lineHeight: 1.2 }}>
                    Where will your<br />story begin?
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <CompassRose />
        </div>

        {/* Middle: origin label */}
        {selectedDest && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="self-start"
            style={{ background: "rgba(250,246,238,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 3, padding: "4px 10px" }}>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.goldLight, letterSpacing: "0.14em" }}>
              ↗ FROM GUJARAT, INDIA · 23°02'N 72°34'E
            </p>
          </motion.div>
        )}

        {/* Bottom: trip summary overlay */}
        <div style={{ background: "rgba(26,13,6,0.72)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "14px 16px" }}>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.gold, letterSpacing: "0.22em", marginBottom: 8 }}>TRIP MANIFEST</p>
          <div className="space-y-2">
            <SummaryRow icon="✈️" label="Trip" value={data.name} placeholder="Untitled adventure" />
            <SummaryRow icon="📍" label="Dest." value={data.destination} placeholder="Unknown destination" />
            <SummaryRow icon="📅" label="Dates"
              value={data.startDate && data.endDate
                ? `${fmtDate(data.startDate)} → ${fmtDate(data.endDate)}`
                : data.startDate ? fmtDate(data.startDate) : ""}
              placeholder="Dates TBD" />
            {data.startDate && data.endDate && new Date(data.endDate) > new Date(data.startDate) && (
              <SummaryRow icon="🗓️" label="Days"
                value={`${Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / 86400000)} days`}
                placeholder="" />
            )}
            <SummaryRow icon="💰" label="Budget" value={data.budget ? `$${Number(data.budget).toLocaleString()}` : ""} placeholder="Budget TBD" />
          </div>
        </div>
      </div>

      {/* Film grain texture */}
      <div className="absolute inset-0 z-40 pointer-events-none opacity-20"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")" }} />
    </div>
  );
}

function SummaryRow({ icon, label, value, placeholder }: { icon: string; label: string; value: string; placeholder: string }) {
  const text = value || placeholder;
  const isFilled = !!value;
  return (
    <motion.div
      className="flex items-center gap-2"
      animate={{ opacity: isFilled ? 1 : 0.38 }}
      transition={{ duration: 0.35 }}
    >
      <span style={{ fontSize: 11, width: 16 }}>{icon}</span>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.gold, letterSpacing: "0.1em", width: 30, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: isFilled ? "'Caveat', cursive" : "'Courier New', monospace", fontSize: isFilled ? 13 : 8, color: isFilled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)", letterSpacing: isFilled ? "0" : "0.08em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>
        {text}
      </span>
    </motion.div>
  );
}

function fmtDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Progress Timeline ────────────────────────────────────────────
const STEP_META = [
  { num: 1, label: "The Adventure", sub: "Name & Destination" },
  { num: 2, label: "The Journey", sub: "Dates & Duration" },
  { num: 3, label: "The Budget", sub: "Spend & Notes" },
];

function ProgressTimeline({ step, stampingStep }: { step: number; stampingStep: number }) {
  return (
    <div className="relative flex items-start gap-0 mb-6 px-1">
      {STEP_META.map((s, idx) => {
        const isCompleted = step > s.num;
        const isActive = step === s.num;
        const isStamping = stampingStep === s.num;
        return (
          <div key={s.num} className="flex items-center flex-1">
            {/* Step node */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative" style={{ width: 38, height: 38 }}>
                {/* Background circle */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: isCompleted ? SB.green : isActive ? SB.copper : "#e8d8c0",
                  border: `2px solid ${isCompleted ? SB.green : isActive ? SB.copper : SB.cardBorder}`,
                  boxShadow: isActive ? `0 0 0 3px ${SB.copper}25, 0 0 16px ${SB.copper}30` : "none",
                  transition: "all 0.4s ease",
                }} />

                {/* Stamp animation overlay */}
                <AnimatePresence>
                  {isStamping && (
                    <motion.div
                      className="absolute inset-0 rounded-full flex items-center justify-center"
                      initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
                      animate={{ scale: 1, opacity: 1, rotate: -8 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 480, damping: 28 }}
                      style={{ background: SB.green, border: `3px solid ${SB.green}`, zIndex: 20 }}
                    >
                      <Check style={{ width: 16, height: 16, color: "white" }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon/number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isCompleted && !isStamping ? (
                      <motion.div key="check"
                        initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                        <Check style={{ width: 16, height: 16, color: "white" }} />
                      </motion.div>
                    ) : (
                      <motion.span key="num"
                        style={{ fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: "bold", color: isActive ? "white" : SB.inkFaded }}>
                        {s.num}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Label below node */}
              <p className="mt-1.5 text-center" style={{
                fontFamily: "'Caveat', cursive", fontSize: 12,
                color: isActive ? SB.copper : isCompleted ? SB.green : SB.inkFaded,
                lineHeight: 1.2, transition: "color 0.3s",
              }}>{s.label}</p>
              <p style={{
                fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: "0.08em",
                color: SB.inkFaded, textAlign: "center",
              }}>{s.sub}</p>
            </div>

            {/* Connector line */}
            {idx < 2 && (
              <div className="flex-1 mx-1 relative" style={{ height: 2, marginTop: -24 }}>
                <div className="absolute inset-0" style={{ background: SB.cardBorder, borderRadius: 2 }} />
                <motion.div
                  className="absolute inset-y-0 left-0"
                  animate={{ width: step > s.num ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: EXPO_OUT }}
                  style={{ background: SB.green, borderRadius: 2 }}
                />
                {/* Moving dot */}
                {step === s.num && (
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    animate={{ x: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: 4, height: 4, borderRadius: "50%", background: SB.copper }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Diary Input ──────────────────────────────────────────────────
function DiaryInput({
  label, type = "text", placeholder, value, onChange, error, icon, multiline = false, rows = 3,
}: {
  label: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; error?: string; icon?: React.ReactNode; multiline?: boolean; rows?: number;
}) {
  const [focused, setFocused] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", outline: "none",
    color: SB.ink, fontFamily: "Georgia, serif", fontSize: 14,
    paddingLeft: icon ? 26 : 0,
    paddingRight: 0, paddingTop: 4, paddingBottom: 8,
    borderBottom: `1.5px solid ${focused ? SB.copper : error ? "#c0392b" : SB.cardBorder}`,
    transition: "border-color 0.22s ease",
    resize: "none" as const,
  };

  return (
    <motion.div variants={childV} className="relative">
      {/* Caveat label */}
      <motion.label
        animate={{ color: focused ? SB.copper : error ? "#c0392b" : SB.inkMed }}
        transition={{ duration: 0.2 }}
        style={{ display: "block", fontFamily: "'Caveat', cursive", fontSize: 18, marginBottom: 2 }}
      >
        {label}
      </motion.label>

      {/* Input wrapper with left margin accent */}
      <div className="relative" style={{ paddingLeft: 12, borderLeft: `2px solid ${focused ? SB.copper : error ? "#c0392b" : "rgba(192,57,43,0.18)"}`, transition: "border-color 0.22s ease" }}>
        {icon && (
          <div className="absolute left-3 top-3.5" style={{ color: focused ? SB.copper : SB.inkFaded, transition: "color 0.2s" }}>{icon}</div>
        )}
        {multiline ? (
          <textarea
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ ...inputStyle, paddingTop: 8 }}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={inputStyle}
          />
        )}
        {/* Animated underline highlight */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5, background: SB.copper, transformOrigin: "left", zIndex: 5 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 12, color: "#c0392b", marginTop: 3 }}>
            ✗ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Luggage Tag Destination Chip ─────────────────────────────────
function DestChip({ dest, selected, onClick }: { dest: typeof DESTINATIONS[0]; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -3, rotate: selected ? -1.5 : 0 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="relative flex-shrink-0"
      style={{ transform: selected ? "rotate(-1.5deg)" : "none", transition: "transform 0.3s ease" }}
    >
      {/* Washi tape on selected */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} exit={{ scaleX: 0 }}
            className="absolute -top-2 left-1/2 pointer-events-none"
            style={{ width: "70%", height: 12, background: dest.color, borderRadius: 2, transform: "translateX(-50%)", zIndex: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.14)" }}
          />
        )}
      </AnimatePresence>

      {/* Tag body */}
      <div style={{
        background: selected ? "white" : SB.cream,
        border: `1.5px solid ${selected ? SB.copper : SB.cardBorder}`,
        borderRadius: "4px 4px 4px 16px",
        padding: "7px 10px 7px 10px",
        boxShadow: selected
          ? `2px 3px 0 #d8c8a0, 3px 5px 10px ${SB.copper}30`
          : "1px 1px 4px rgba(100,60,20,0.08)",
        minWidth: 76, textAlign: "center",
        transition: "all 0.22s ease",
        position: "relative",
      }}>
        {/* Passport stamp check mark */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: -8, opacity: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -top-1.5 -right-1.5"
              style={{
                width: 16, height: 16, borderRadius: "50%",
                background: SB.green, border: "1.5px solid white",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 15,
              }}
            >
              <Check style={{ width: 8, height: 8, color: "white" }} />
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ fontSize: 18, lineHeight: 1, marginBottom: 2 }}>{dest.emoji}</p>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 11, color: selected ? SB.ink : SB.inkMed, lineHeight: 1.2 }}>{dest.name}</p>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded, letterSpacing: "0.08em" }}>{dest.region.toUpperCase()}</p>
      </div>

      {/* Punch hole string */}
      <div style={{ position: "absolute", bottom: 6, left: 8, width: 7, height: 7, borderRadius: "50%", border: `1.5px solid ${selected ? SB.copper : SB.cardBorder}`, background: "transparent", transition: "border-color 0.2s" }} />
    </motion.button>
  );
}

// ─── Step One ─────────────────────────────────────────────────────
function StepOne({ data, errors, up, onDestSelect }: { data: any; errors: any; up: (k: string, v: string) => void; onDestSelect: (d: any) => void }) {
  const selectedDest = DESTINATIONS.find(d => d.name === data.destination);

  return (
    <motion.div key="step1" variants={containerV} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      {/* Handwritten heading */}
      <motion.div variants={childV}>
        <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: 26, color: SB.ink, marginBottom: 2, lineHeight: 1.1 }}>
          What's the adventure? ✍️
        </h3>
        <svg width="180" height="10" viewBox="0 0 180 10">
          <motion.path d="M4,6 Q45,2 90,7 Q135,10 176,4" stroke={SB.copper} strokeWidth="1.5" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} />
        </svg>
      </motion.div>

      <DiaryInput label="Trip Name" placeholder="e.g. European Summer Escape" value={data.name}
        onChange={v => up("name", v)} error={errors.name} icon={<Plane style={{ width: 14, height: 14 }} />} />

      <DiaryInput label="Destination" placeholder="Type a destination or pick one below" value={data.destination}
        onChange={v => { up("destination", v); onDestSelect(DESTINATIONS.find(d => d.name === v) || null); }}
        error={errors.destination} icon={<MapPin style={{ width: 14, height: 14 }} />} />

      {/* Destination chips */}
      <motion.div variants={childV}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: SB.inkFaded, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
          ✦ Popular Destinations
        </p>
        <div className="flex flex-wrap gap-3">
          {DESTINATIONS.map(dest => (
            <DestChip
              key={dest.name}
              dest={dest}
              selected={data.destination === dest.name}
              onClick={() => { up("destination", dest.name); onDestSelect(dest); }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Step Two ─────────────────────────────────────────────────────
function StepTwo({ data, errors, up }: { data: any; errors: any; up: (k: string, v: string) => void }) {
  const days = data.startDate && data.endDate && new Date(data.endDate) > new Date(data.startDate)
    ? Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / 86400000)
    : null;

  return (
    <motion.div key="step2" variants={containerV} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <motion.div variants={childV}>
        <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: 26, color: SB.ink, marginBottom: 2, lineHeight: 1.1 }}>
          When are you going? 🗓️
        </h3>
        <svg width="200" height="10" viewBox="0 0 200 10">
          <motion.path d="M4,6 Q50,2 100,7 Q150,10 196,4" stroke={SB.copper} strokeWidth="1.5" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
        </svg>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        <DiaryInput label="Departure" type="date" value={data.startDate} onChange={v => up("startDate", v)}
          error={errors.startDate} icon={<Calendar style={{ width: 13, height: 13 }} />} />
        <DiaryInput label="Return" type="date" value={data.endDate} onChange={v => up("endDate", v)}
          error={errors.endDate} icon={<Calendar style={{ width: 13, height: 13 }} />} />
      </div>

      {/* Duration badge */}
      <AnimatePresence>
        {days && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            variants={childV}
          >
            <div style={{ background: WASHI[3], border: `1px solid ${SB.cardBorder}`, borderRadius: 4, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              {/* Large day count stamp */}
              <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 4, background: SB.copper, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `2px 2px 8px ${SB.copper}50` }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "white", lineHeight: 1, fontWeight: "bold" }}>{days}</p>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "rgba(255,255,255,0.8)", letterSpacing: "0.15em" }}>DAYS</p>
              </div>
              <div>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: SB.ink, lineHeight: 1.1 }}>
                  {days <= 3 ? "A quick escape! 🌿" : days <= 7 ? "A perfect week! ✨" : days <= 14 ? "A grand journey! 🗺️" : "An epic expedition! 🌍"}
                </p>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: SB.inkFaded, letterSpacing: "0.08em", marginTop: 2 }}>
                  {fmtDate(data.startDate)} — {fmtDate(data.endDate)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar visual hint */}
      <motion.div variants={childV}>
        <div style={{ background: "#fdf9f0", border: `1px solid ${SB.cardBorder}60`, borderRadius: 4, padding: "10px 14px" }}>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: SB.inkFaded, fontStyle: "italic" }}>
            💡 Tip: Book flights 4–8 weeks in advance for the best deals!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Step Three ────────────────────────────────────────────────────
function StepThree({ data, up }: { data: any; up: (k: string, v: string) => void }) {
  const budgetTiers = [
    { label: "Budget", range: "$500–$1,500", emoji: "🎒" },
    { label: "Mid-range", range: "$1,500–$4,000", emoji: "✈️" },
    { label: "Luxury", range: "$4,000+", emoji: "🥂" },
  ];
  const selectedTier = data.budget
    ? Number(data.budget) >= 4000 ? 2 : Number(data.budget) >= 1500 ? 1 : 0
    : -1;

  return (
    <motion.div key="step3" variants={containerV} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <motion.div variants={childV}>
        <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: 26, color: SB.ink, marginBottom: 2, lineHeight: 1.1 }}>
          Budget & field notes 💰
        </h3>
        <svg width="210" height="10" viewBox="0 0 210 10">
          <motion.path d="M4,6 Q55,2 105,7 Q155,10 206,4" stroke={SB.copper} strokeWidth="1.5" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
        </svg>
      </motion.div>

      {/* Budget tier chips */}
      <motion.div variants={childV}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: SB.inkFaded, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Budget Range</p>
        <div className="flex gap-2 mb-4">
          {budgetTiers.map((t, i) => (
            <motion.button key={t.label} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => up("budget", i === 0 ? "1000" : i === 1 ? "2500" : "5000")}
              style={{
                flex: 1, padding: "8px 6px",
                background: selectedTier === i ? WASHI[i % WASHI.length] : SB.cream,
                border: `1.5px solid ${selectedTier === i ? SB.copper : SB.cardBorder}`,
                borderRadius: 4, textAlign: "center",
                boxShadow: selectedTier === i ? `1px 2px 6px ${SB.copper}30` : "none",
                transition: "all 0.2s",
              }}>
              <p style={{ fontSize: 16 }}>{t.emoji}</p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 10, color: SB.ink }}>{t.label}</p>
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded }}>{t.range}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <DiaryInput label="Exact Budget (USD)" type="number" placeholder="e.g. 2500"
        value={data.budget} onChange={v => up("budget", v)}
        icon={<DollarSign style={{ width: 13, height: 13 }} />} />

      <DiaryInput label="Travel Notes" placeholder="Visa requirements, packing ideas, must-sees…"
        value={data.notes} onChange={v => up("notes", v)} multiline rows={4} />

      {/* Full trip summary ticket */}
      <motion.div variants={childV}>
        <div style={{ background: WASHI[2], border: `1px solid ${SB.cardBorder}`, borderRadius: 4, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
          {/* Ticket perforations */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16, display: "flex", flexDirection: "column", justifyContent: "space-evenly", pointerEvents: "none" }}>
            {[...Array(7)].map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: SB.parchment, border: `1px solid ${SB.cardBorder}`, marginLeft: -4 }} />
            ))}
          </div>
          <div style={{ marginLeft: 14 }}>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.copper, letterSpacing: "0.22em", marginBottom: 8 }}>✦ BOARDING PASS PREVIEW</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "PASSENGER", value: "Khushi Patel" },
                { label: "FLIGHT", value: data.name || "—" },
                { label: "TO", value: data.destination || "—" },
                { label: "DURATION", value: data.days_count || (data.startDate && data.endDate ? `${Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / 86400000)} DAYS` : "—") },
                { label: "DEPARTS", value: data.startDate ? fmtDate(data.startDate) : "—" },
                { label: "BUDGET", value: data.budget ? `$${Number(data.budget).toLocaleString()}` : "—" },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded, letterSpacing: "0.12em" }}>{item.label}</p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: SB.ink, fontWeight: item.label === "FLIGHT" ? "bold" : "normal" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────
export function CreateTripSection({ onSave, onCancel }: { onSave: (trip: any) => void; onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [stampingStep, setStampingStep] = useState(0);
  const [selectedDest, setSelectedDest] = useState<typeof DESTINATIONS[0] | null>(null);
  const [data, setData] = useState({ name: "", destination: "", startDate: "", endDate: "", budget: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!data.name.trim()) e.name = "Give your trip a name";
      if (!data.destination.trim()) e.destination = "Choose a destination";
    }
    if (s === 2) {
      if (!data.startDate) e.startDate = "Pick a departure date";
      if (!data.endDate) e.endDate = "Pick a return date";
      if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate))
        e.endDate = "Return must be after departure";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const up = useCallback((k: string, v: string) => {
    setData(d => ({ ...d, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  }, [errors]);

  const handleNext = () => {
    if (!validate(step)) return;
    setStampingStep(step);
    setTimeout(() => {
      setStampingStep(0);
      setDirection(1);
      setStep(s => s + 1);
    }, 560);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleSubmit = () => {
    if (validate(3)) {
      setStampingStep(3);
      setTimeout(() => onSave(data), 500);
    }
  };

  const slideV = direction === 1 ? slideForward : slideBackward;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Back button + title */}
      <div className="flex items-center gap-3 mb-5">
        <motion.button
          whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          style={{ padding: "8px 10px", background: SB.cream, border: `1px solid ${SB.cardBorder}`, borderRadius: 3, color: SB.inkMed, display: "flex", alignItems: "center", gap: 4, boxShadow: "1px 1px 4px rgba(100,60,20,0.08)" }}
        >
          <ChevronLeft style={{ width: 18, height: 18 }} />
        </motion.button>
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", color: SB.ink, letterSpacing: "-0.01em" }}>Plan New Trip</h2>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: SB.inkFaded }}>
            Step {step} of 3 — {["Trip Details", "Travel Dates", "Budget & Notes"][step - 1]}
          </p>
        </div>
      </div>

      {/* Main panel */}
      <div className="flex overflow-hidden" style={{
        borderRadius: 4,
        boxShadow: `3px 4px 0 #d8c8a0, 5px 8px 24px rgba(100,60,20,0.16)`,
        border: `1px solid ${SB.cardBorder}`,
        minHeight: 520,
      }}>
        {/* ── Left: Map panel (hidden on mobile) ── */}
        <div className="hidden md:block" style={{ width: "42%" }}>
          <MapPanel data={data} selectedDest={selectedDest} />
        </div>

        {/* ── Right: Diary / notebook panel ── */}
        <div className="flex-1 flex flex-col" style={{ background: SB.cream, position: "relative", overflow: "hidden" }}>
          {/* Notebook lines */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 33px, rgba(139,90,43,0.07) 33px, rgba(139,90,43,0.07) 34px)",
            backgroundPosition: "0 48px",
            zIndex: 0,
          }} />
          {/* Margin line */}
          <div className="absolute pointer-events-none" style={{ top: 0, bottom: 0, left: 42, width: 1, background: "rgba(192,57,43,0.12)", zIndex: 1 }} />
          {/* Spiral holes */}
          <div className="absolute top-0 bottom-0 left-4 flex flex-col justify-evenly pointer-events-none" style={{ zIndex: 2 }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${SB.cardBorder}`, background: SB.parchment, marginLeft: -2 }} />
            ))}
          </div>

          {/* Content area */}
          <div className="relative flex-1 flex flex-col" style={{ padding: "24px 24px 20px 56px", zIndex: 3 }}>
            {/* Progress timeline */}
            <ProgressTimeline step={step} stampingStep={stampingStep} />

            {/* Step content */}
            <div className="flex-1 overflow-y-auto" style={{ minHeight: 280, paddingRight: 4 }}>
              <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                  <motion.div key="s1" custom={direction} variants={slideV} initial="hidden" animate="visible" exit="exit">
                    <StepOne data={data} errors={errors} up={up} onDestSelect={setSelectedDest} />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="s2" custom={direction} variants={slideV} initial="hidden" animate="visible" exit="exit">
                    <StepTwo data={data} errors={errors} up={up} />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="s3" custom={direction} variants={slideV} initial="hidden" animate="visible" exit="exit">
                    <StepThree data={data} up={up} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: `1px dashed ${SB.cardBorder}` }}>
              {step > 1 && (
                <motion.button
                  whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={handleBack}
                  style={{
                    padding: "11px 20px", border: `1px solid ${SB.cardBorder}`,
                    background: SB.parchment, color: SB.inkMed, borderRadius: 3,
                    fontFamily: "Georgia, serif", fontSize: 13,
                    boxShadow: "1px 1px 4px rgba(100,60,20,0.08)",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <ChevronLeft style={{ width: 15, height: 15 }} /> Back
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={step < 3 ? handleNext : handleSubmit}
                disabled={stampingStep > 0}
                style={{
                  flex: 1, padding: "11px 20px",
                  background: stampingStep > 0
                    ? SB.green
                    : `linear-gradient(135deg, ${SB.copper}, #e8943a)`,
                  color: "white", borderRadius: 3,
                  fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 600,
                  boxShadow: `2px 3px 0 #b05a20, 3px 5px 14px ${SB.copper}40`,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  border: "none", cursor: stampingStep > 0 ? "not-allowed" : "pointer",
                  transition: "background 0.3s ease",
                }}
              >
                <AnimatePresence mode="wait">
                  {stampingStep > 0 ? (
                    <motion.span key="stamping" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Check style={{ width: 16, height: 16 }} /> Stamped!
                    </motion.span>
                  ) : step < 3 ? (
                    <motion.span key="next" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      Continue <ChevronRight style={{ width: 16, height: 16 }} />
                    </motion.span>
                  ) : (
                    <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Plane style={{ width: 16, height: 16 }} /> Save Trip to Diary
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="mt-4 flex items-center gap-3 justify-center">
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${SB.cardBorder})` }} />
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: SB.inkFaded }}>✦ your story starts here</p>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${SB.cardBorder})` }} />
      </div>

      {/* Global keyframe */}
      <style>{`@keyframes ping { 75%,100%{transform:scale(2.2);opacity:0} }`}</style>
    </div>
  );
}
