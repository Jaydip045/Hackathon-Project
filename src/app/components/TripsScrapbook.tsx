import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Plus, Trash2, Plane, Calendar } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
interface Trip {
  id: number; name: string; destination: string;
  startDate: string; endDate: string; budget: string;
  days_count: string; img: string; status: "upcoming" | "past" | "planning";
}

interface TripsProps {
  trips: Trip[];
  onDelete: (id: number) => void;
  onCreateNew: () => void;
}

// ─── Design tokens ────────────────────────────────────────────────
const SB = {
  parchment: "#f0e8d8",
  cream: "#faf6ee",
  cardBorder: "#ddd0b4",
  ink: "#3d2414",
  inkMed: "#7a5c42",
  inkFaded: "#b09478",
  copper: "#c87432",
  gold: "#d4a853",
  goldLight: "#f0cc80",
  cardShadow: "2px 3px 0 #d8c8a0, 3px 6px 14px rgba(100,60,20,0.13)",
};

const WASHI = [
  "rgba(248,192,160,0.88)",
  "rgba(176,208,240,0.88)",
  "rgba(248,228,144,0.88)",
  "rgba(176,224,192,0.88)",
  "rgba(216,192,240,0.88)",
];

// ─── Destination metadata (map coords + stamp info) ───────────────
const DEST_META: Record<string, { code: string; flag: string; mapX: number; mapY: number; region: string }> = {
  europe: { code: "EUR", flag: "🌍", mapX: 52, mapY: 33, region: "Europe" },
  paris: { code: "CDG", flag: "🇫🇷", mapX: 51, mapY: 34, region: "France" },
  bali: { code: "DPS", flag: "🇮🇩", mapX: 79, mapY: 58, region: "Indonesia" },
  japan: { code: "NRT", flag: "🇯🇵", mapX: 83, mapY: 37, region: "Japan" },
  tokyo: { code: "NRT", flag: "🇯🇵", mapX: 84, mapY: 37, region: "Japan" },
  iceland: { code: "KEF", flag: "🇮🇸", mapX: 42, mapY: 20, region: "Iceland" },
  santorini: { code: "JTR", flag: "🇬🇷", mapX: 55, mapY: 39, region: "Greece" },
  greece: { code: "ATH", flag: "🇬🇷", mapX: 55, mapY: 39, region: "Greece" },
  italy: { code: "FCO", flag: "🇮🇹", mapX: 52, mapY: 37, region: "Italy" },
  spain: { code: "MAD", flag: "🇪🇸", mapX: 48, mapY: 38, region: "Spain" },
  usa: { code: "JFK", flag: "🇺🇸", mapX: 25, mapY: 38, region: "North America" },
  india: { code: "DEL", flag: "🇮🇳", mapX: 71, mapY: 45, region: "India" },
};

function getDestMeta(destination: string) {
  const key = Object.keys(DEST_META).find(k => destination.toLowerCase().includes(k));
  return key ? DEST_META[key] : { code: "INT", flag: "🌍", mapX: 50, mapY: 45, region: "International" };
}

// ─── Coordinate Grid Overlay ─────────────────────────────────────
function CoordGrid({ mouseX = 0, mouseY = 0 }: { mouseX?: number; mouseY?: number }) {
  const lats = [0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88];
  const lngs = [0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88, 0.98];
  const shift = { x: mouseX * 8, y: mouseY * 6 };
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.13, transform: `translate(${shift.x}px, ${shift.y}px)`, transition: "transform 0.15s ease-out" }}
      preserveAspectRatio="xMidYMid slice"
    >
      {lats.map(y => (
        <line key={y} x1="0%" y1={`${y * 100}%`} x2="100%" y2={`${y * 100}%`}
          stroke="white" strokeWidth="0.7" />
      ))}
      {lngs.map(x => (
        <line key={x} x1={`${x * 100}%`} y1="0%" x2={`${x * 100}%`} y2="100%"
          stroke="white" strokeWidth="0.7" />
      ))}
      {/* Curved "great circle" suggestions */}
      <ellipse cx="50%" cy="50%" rx="48%" ry="48%" stroke="white" strokeWidth="0.5" fill="none" opacity="0.5" />
      <ellipse cx="50%" cy="50%" rx="48%" ry="20%" stroke="white" strokeWidth="0.4" fill="none" opacity="0.3" />
      <ellipse cx="50%" cy="50%" rx="20%" ry="48%" stroke="white" strokeWidth="0.4" fill="none" opacity="0.3" />
    </svg>
  );
}

// ─── Animated Airplane Path ────────────────────────────────────────
function AirplanePath({ idx }: { idx: number }) {
  const paths = [
    "M -10,55 C 50,20 150,35 410,15",
    "M -10,45 C 80,5 200,50 410,25",
    "M -10,60 C 100,10 250,45 410,10",
    "M -10,40 C 60,60 200,10 410,50",
  ];
  const path = paths[idx % paths.length];

  return (
    <div className="absolute inset-x-0 pointer-events-none" style={{ bottom: 90, height: 80, zIndex: 5 }}>
      <svg width="100%" height="80" viewBox="0 0 400 80" preserveAspectRatio="none">
        {/* Dashed route line */}
        <path d={path} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="7 5" fill="none" />
        {/* Origin dot */}
        <circle cx="8" cy={path.match(/M -10,(\d+)/)?.[1] ?? "50"} r="3" fill="rgba(255,255,255,0.6)" />
        {/* Destination dot */}
        <circle cx="400" cy={path.match(/(\d+)$/)?.[1] ?? "25"} r="3.5" fill={SB.gold} />
        <circle cx="400" cy={path.match(/(\d+)$/)?.[1] ?? "25"} r="6" fill={SB.gold} fillOpacity="0.25">
          <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Animated plane along path */}
      <motion.div
        className="absolute"
        style={{ top: 0, left: 0, fontSize: 15 }}
        animate={{
          x: ["-3%", "102%"],
          y: [
            `${idx % 2 === 0 ? 52 : 42}px`,
            `${idx % 2 === 0 ? 18 : 28}px`,
            `${idx % 2 === 0 ? 30 : 18}px`,
            `${idx % 2 === 0 ? 10 : 48}px`,
          ],
          rotate: [-8, -2, -5, 4],
        }}
        transition={{ duration: 5 + idx, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
      >
        ✈
      </motion.div>
    </div>
  );
}

// ─── Vintage Circular Stamp ────────────────────────────────────────
function CircleStamp({ code, flag, rotate = -12 }: { code: string; flag: string; rotate?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: 56, height: 56,
        border: "2.5px solid rgba(255,255,255,0.55)",
        borderRadius: "50%",
        transform: `rotate(${rotate}deg)`,
        opacity: 0.9,
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(3px)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.15) inset",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{flag}</span>
      <span style={{
        fontFamily: "'Courier New', monospace", fontSize: 7, letterSpacing: "0.18em",
        color: "white", textTransform: "uppercase", marginTop: 2,
      }}>{code}</span>
    </div>
  );
}

// ─── Location Pin ─────────────────────────────────────────────────
function LocationPin({ x, y, mouseX = 0, mouseY = 0 }: { x: number; y: number; mouseX?: number; mouseY?: number }) {
  return (
    <div className="absolute pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`,
        transform: `translate(-50%,-50%) translate(${mouseX * 12}px, ${mouseY * 10}px)`,
        transition: "transform 0.15s ease-out",
        zIndex: 6,
      }}>
      {/* Glow rings */}
      <div className="absolute" style={{
        width: 20, height: 20, borderRadius: "50%",
        background: SB.gold, opacity: 0.25,
        left: -8, top: -8,
        animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
      }} />
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: SB.gold, boxShadow: `0 0 6px ${SB.gold}, 0 0 12px ${SB.gold}80`,
      }} />
    </div>
  );
}

// ─── Perforations ─────────────────────────────────────────────────
function Perforations({ count = 8 }: { count?: number }) {
  return (
    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around pointer-events-none" style={{ width: 16, zIndex: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: SB.parchment,
          border: `1px solid ${SB.cardBorder}`,
          marginLeft: -4,
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
        }} />
      ))}
    </div>
  );
}

// ─── Folded Corner ────────────────────────────────────────────────
function FoldedCorner() {
  return (
    <div className="absolute bottom-0 right-0 pointer-events-none" style={{ zIndex: 10 }}>
      <div style={{
        width: 0, height: 0,
        borderStyle: "solid",
        borderWidth: "0 0 28px 28px",
        borderColor: `transparent transparent ${SB.parchment} transparent`,
        filter: "drop-shadow(-2px -2px 3px rgba(100,60,20,0.15))",
      }} />
    </div>
  );
}

// ─── WashiTag ────────────────────────────────────────────────────
function WashiTag({ label, color, rotate = 0 }: { label: string; color: string; rotate?: number }) {
  return (
    <span style={{
      background: color,
      color: SB.ink,
      fontFamily: "'Courier New', monospace",
      fontSize: 9,
      fontWeight: "bold",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      padding: "2px 8px",
      borderRadius: 2,
      transform: `rotate(${rotate}deg)`,
      display: "inline-block",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    }}>{label}</span>
  );
}

// ─── Status Stamp ─────────────────────────────────────────────────
function StatusStamp({ status }: { status: Trip["status"] }) {
  const cfg: Record<string, { color: string; label: string; rotate: number }> = {
    upcoming: { color: "rgba(200,116,50,0.9)", label: "UPCOMING", rotate: -8 },
    past: { color: "rgba(74,124,89,0.9)", label: "COMPLETED", rotate: 6 },
    planning: { color: "rgba(58,107,138,0.9)", label: "PLANNING", rotate: -5 },
  };
  const c = cfg[status] || cfg.upcoming;
  return (
    <div style={{
      border: `2.5px solid ${c.color}`,
      color: c.color,
      fontFamily: "'Courier New', monospace",
      fontSize: 8,
      fontWeight: "bold",
      letterSpacing: "0.18em",
      padding: "3px 8px",
      borderRadius: 3,
      transform: `rotate(${c.rotate}deg)`,
      background: "rgba(250,246,238,0.85)",
      backdropFilter: "blur(4px)",
      display: "inline-block",
    }}>{c.label}</div>
  );
}

// ─── Postcard Trip Card ────────────────────────────────────────────
function PostcardTripCard({ trip, onDelete, idx }: { trip: Trip; onDelete: () => void; idx: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, mx: 0, my: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const meta = getDestMeta(trip.destination);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: ny * 9, y: nx * -9, mx: nx, my: ny });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, mx: 0, my: 0 });
    setHovered(false);
  }, []);

  const baseRotations = ["-1.2deg", "0.8deg", "-0.5deg", "1.3deg", "-0.7deg", "0.4deg"];
  const washiColors = [WASHI[idx % WASHI.length]];

  const formatDate = (d: string) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: idx * 0.1, type: "spring", bounce: 0.32 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setHovered(true)}
      className="group relative cursor-default"
      style={{
        transformOrigin: "center bottom",
        transform: hovered
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) rotate(0deg)`
          : `rotate(${baseRotations[idx % baseRotations.length]})`,
        transition: hovered ? "transform 0.08s ease-out" : "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        zIndex: hovered ? 20 : 1,
      }}
    >
      {/* ── Washi tape top ── */}
      <div className="absolute pointer-events-none z-30"
        style={{
          top: -10, left: "50%",
          transform: `translateX(-50%) rotate(${idx % 2 === 0 ? -1 : 1.2}deg)`,
          width: "38%", height: 16,
          background: washiColors[0],
          borderRadius: 3,
          boxShadow: "0 2px 5px rgba(0,0,0,0.14)",
          opacity: 0.9,
        }}
      />

      {/* ── Card shell ── */}
      <div
        style={{
          background: SB.cream,
          border: `1px solid ${SB.cardBorder}`,
          borderRadius: 4,
          boxShadow: hovered
            ? `4px 6px 0 #c8b890, 6px 10px 28px rgba(100,60,20,0.22), 0 0 0 1.5px ${SB.gold}40`
            : SB.cardShadow,
          overflow: "hidden",
          transition: "box-shadow 0.25s ease",
          position: "relative",
        }}
      >
        {/* ── Photo area ── */}
        <div className="relative overflow-hidden" style={{ height: 210, padding: 8, paddingBottom: 0, background: "#1a0d06" }}>
          {/* Photo with parallax */}
          <div style={{ overflow: "hidden", borderRadius: 2, height: "100%", position: "relative" }}>
            <div
              style={{
                position: "absolute", inset: "-8px",
                transform: hovered ? `translate(${tilt.mx * -14}px, ${tilt.my * -10}px) scale(1.07)` : "translate(0,0) scale(1.02)",
                transition: hovered ? "transform 0.08s ease-out" : "transform 0.5s ease",
              }}
            >
              <img src={trip.img} alt={trip.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Cinematic vignette */}
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
              pointerEvents: "none",
            }} />
            {/* Bottom gradient */}
            <div className="absolute inset-x-0 bottom-0" style={{
              height: "55%",
              background: "linear-gradient(to top, rgba(15,5,0,0.82) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
              pointerEvents: "none",
            }} />

            {/* Coordinate grid */}
            <CoordGrid mouseX={tilt.mx} mouseY={tilt.my} />

            {/* Airplane path */}
            <AirplanePath idx={idx} />

            {/* Location pin on grid */}
            <LocationPin x={meta.mapX} y={meta.mapY} mouseX={tilt.mx} mouseY={tilt.my} />

            {/* Delete button */}
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                width: 28, height: 28,
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", zIndex: 15,
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(192,57,43,0.85)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.45)")}
            >
              <Trash2 style={{ width: 12, height: 12 }} />
            </button>

            {/* Status stamp — top left */}
            <div className="absolute top-3 left-3" style={{ zIndex: 12 }}>
              <StatusStamp status={trip.status} />
            </div>

            {/* Circular dest stamp — top right */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all" style={{ zIndex: 12 }}>
              {/* hidden when delete shows */}
            </div>

            {/* Destination name at bottom */}
            <div className="absolute bottom-0 inset-x-0 p-3 pb-2" style={{ zIndex: 10 }}>
              <div
                style={{
                  transform: hovered ? `translate(${tilt.mx * 5}px, ${tilt.my * 4}px)` : "translate(0,0)",
                  transition: hovered ? "transform 0.1s ease-out" : "transform 0.4s ease",
                }}
              >
                <h3 style={{
                  fontFamily: "'Caveat', cursive", fontSize: 26, fontWeight: 700,
                  color: "white", lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                  marginBottom: 2,
                }}>{trip.name}</h3>
                <div className="flex items-center gap-1.5">
                  <MapPin style={{ width: 11, height: 11, color: SB.goldLight }} />
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "'Courier New', monospace", letterSpacing: "0.06em" }}>
                    {trip.destination.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Postcard body ── */}
        <div className="relative" style={{ padding: "10px 16px 12px 22px", background: "#fdf9f0" }}>
          <Perforations count={6} />

          {/* Postcard horizontal rules */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 19px, rgba(139,90,43,0.1) 19px, rgba(139,90,43,0.1) 20px)",
            backgroundPosition: "0 8px",
          }} />

          <div className="relative flex items-end justify-between gap-2">
            {/* Left: dates + tags */}
            <div>
              {/* Date range stamp */}
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar style={{ width: 10, height: 10, color: SB.inkFaded }} />
                <span style={{
                  fontFamily: "'Courier New', monospace", fontSize: 10, color: SB.inkFaded,
                  letterSpacing: "0.08em",
                }}>
                  {formatDate(trip.startDate)}{trip.endDate ? ` — ${formatDate(trip.endDate)}` : ""}
                </span>
              </div>
              {/* Washi tags row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <WashiTag label={meta.region} color={WASHI[idx % WASHI.length]} rotate={-0.5} />
                <WashiTag label={trip.days_count.split(" ")[0] + "d"} color={WASHI[(idx + 2) % WASHI.length]} rotate={0.5} />
                {trip.budget && (
                  <WashiTag label={`$${Number(trip.budget).toLocaleString()}`} color={WASHI[(idx + 1) % WASHI.length]} rotate={-0.3} />
                )}
              </div>
            </div>

            {/* Right: circular stamp */}
            <div className="flex-shrink-0">
              <CircleStamp code={meta.code} flag={meta.flag} rotate={idx % 2 === 0 ? -10 : 8} />
            </div>
          </div>
        </div>

        {/* ── Animated border on hover ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                border: `1.5px solid ${SB.gold}`,
                borderRadius: 4,
                boxShadow: `0 0 12px ${SB.gold}30, inset 0 0 8px ${SB.gold}10`,
              }}
            />
          )}
        </AnimatePresence>

        <FoldedCorner />
      </div>
    </motion.div>
  );
}

// ─── Floating Sticker ─────────────────────────────────────────────
function FloatingSticker({ emoji, x, y, delay = 0, amplitude = 6, speed = 2.8 }: {
  emoji: string; x: number; y: number; delay?: number; amplitude?: number; speed?: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none text-xl"
      style={{ left: `${x}%`, top: `${y}%`, zIndex: 15, fontSize: 22 }}
      animate={{
        y: [-amplitude, amplitude, -amplitude * 0.7, amplitude * 0.5, -amplitude],
        rotate: [-4, 4, -2, 3, -4],
        scale: [1, 1.05, 0.98, 1.03, 1],
      }}
      transition={{ duration: speed, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {emoji}
    </motion.div>
  );
}

// ─── Torn Paper Add Card ─────────────────────────────────────────
function TornPaperAddCard({ onCreateNew }: { onCreateNew: () => void }) {
  const [hovered, setHovered] = useState(false);

  const stickers = [
    { emoji: "✈️", x: 8, y: 12, delay: 0, amplitude: 7, speed: 3.2 },
    { emoji: "🗺️", x: 82, y: 8, delay: 0.6, amplitude: 5, speed: 2.8 },
    { emoji: "📍", x: 88, y: 75, delay: 1.1, amplitude: 8, speed: 3.6 },
    { emoji: "🌍", x: 5, y: 78, delay: 0.4, amplitude: 6, speed: 2.5 },
    { emoji: "📸", x: 50, y: 5, delay: 0.9, amplitude: 5, speed: 3.4 },
    { emoji: "⭐", x: 20, y: 85, delay: 0.2, amplitude: 7, speed: 3.0 },
    { emoji: "🏔️", x: 75, y: 80, delay: 0.7, amplitude: 6, speed: 2.7 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, type: "spring", bounce: 0.3 }}
      className="relative cursor-pointer overflow-hidden"
      style={{
        minHeight: 340,
        background: `linear-gradient(145deg, #faf0e0 0%, #f5e8d0 50%, #f0e0c8 100%)`,
        border: `2px dashed ${SB.copper}50`,
        borderRadius: 4,
        transform: "rotate(0.4deg)",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02, rotate: 0, y: -4 }}
      onClick={onCreateNew}
    >
      {/* Torn paper top edge */}
      <div className="absolute top-0 inset-x-0 pointer-events-none" style={{ zIndex: 12 }}>
        <svg viewBox="0 0 400 22" className="w-full" style={{ height: 22 }} preserveAspectRatio="none">
          <path
            d="M0,0 L0,10 Q8,18 16,10 Q24,2 32,12 Q40,20 48,8 Q56,0 64,14 Q72,22 80,10 Q88,0 96,16 Q104,22 112,8 Q120,0 128,14 Q136,22 144,10 Q152,0 160,15 Q168,22 176,8 Q184,0 192,16 Q200,22 208,10 Q216,0 224,14 Q232,22 240,8 Q248,0 256,15 Q264,22 272,9 Q280,0 288,13 Q296,22 304,8 Q312,0 320,15 Q328,22 336,9 Q344,0 352,14 Q360,22 368,8 Q376,0 384,15 Q392,22 400,10 L400,0 Z"
            fill={SB.parchment}
          />
        </svg>
      </div>

      {/* Torn paper bottom edge */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none" style={{ zIndex: 12 }}>
        <svg viewBox="0 0 400 22" className="w-full" style={{ height: 22 }} preserveAspectRatio="none">
          <path
            d="M0,22 L0,12 Q10,2 20,14 Q30,22 40,8 Q50,0 60,16 Q70,22 80,9 Q90,0 100,14 Q110,22 120,8 Q130,0 140,15 Q150,22 160,8 Q170,0 180,14 Q190,22 200,8 Q210,0 220,16 Q230,22 240,9 Q250,0 260,14 Q270,22 280,8 Q290,0 300,15 Q310,22 320,9 Q330,0 340,14 Q350,22 360,8 Q370,0 380,14 Q390,22 400,10 L400,22 Z"
            fill={SB.parchment}
          />
        </svg>
      </div>

      {/* Paper texture lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(139,90,43,0.06) 27px, rgba(139,90,43,0.06) 28px)",
        backgroundPosition: "0 36px",
      }} />

      {/* Floating stickers */}
      {stickers.map((s, i) => (
        <FloatingSticker key={i} {...s} />
      ))}

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
        {/* Animated dashed circle around plus */}
        <div className="relative mb-5">
          <svg width={72} height={72} viewBox="0 0 72 72" className="absolute inset-0">
            <motion.circle
              cx={36} cy={36} r={32}
              stroke={SB.copper}
              strokeWidth={1.5}
              strokeDasharray="8 5"
              fill="none"
              opacity={0.6}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "36px 36px" }}
            />
            <motion.circle
              cx={36} cy={36} r={24}
              stroke={SB.gold}
              strokeWidth={1}
              strokeDasharray="5 8"
              fill="none"
              opacity={0.4}
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "36px 36px" }}
            />
          </svg>
          {/* Plus icon in center */}
          <div style={{ width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div
              animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{
                width: 36, height: 36,
                background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`,
                borderRadius: 4,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `2px 2px 10px ${SB.copper}50`,
              }}
            >
              <Plus style={{ width: 20, height: 20, color: "white" }} />
            </motion.div>
          </div>
        </div>

        <motion.h3
          animate={{ y: hovered ? -2 : 0 }}
          style={{
            fontFamily: "Georgia, serif",
            color: SB.ink,
            fontSize: 18,
            marginBottom: 4,
            textAlign: "center",
          }}
        >Plan New Trip</motion.h3>

        <motion.p
          animate={{ opacity: hovered ? 0.9 : 0.6 }}
          style={{
            fontFamily: "'Caveat', cursive",
            color: SB.inkMed,
            fontSize: 16,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >Start a new adventure ✦</motion.p>

        {/* Handwritten underline */}
        <svg width={140} height={12} viewBox="0 0 140 12" style={{ marginTop: 6, opacity: hovered ? 0.7 : 0.35 }}>
          <motion.path
            d="M10,6 Q35,2 70,7 Q105,10 130,5"
            stroke={SB.copper}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────
type FilterType = "all" | "upcoming" | "past" | "planning";

const filterCfg: { key: FilterType; label: string; emoji: string; washi: string }[] = [
  { key: "all", label: "All Trips", emoji: "🗺️", washi: WASHI[2] },
  { key: "upcoming", label: "Upcoming", emoji: "✈️", washi: WASHI[0] },
  { key: "past", label: "Completed", emoji: "📸", washi: WASHI[3] },
  { key: "planning", label: "Planning", emoji: "📋", washi: WASHI[1] },
];

// ─── Main Export ─────────────────────────────────────────────────
export function TripsSection({ trips, onDelete, onCreateNew }: TripsProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const filtered = filter === "all" ? trips : trips.filter(t => t.status === filter);

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span style={{ fontSize: 28 }}>🗺️</span>
            <h2 style={{ fontFamily: "Georgia, serif", color: SB.ink, letterSpacing: "-0.01em" }}>
              My Trips
            </h2>
          </div>
          <p style={{
            fontFamily: "'Caveat', cursive", fontSize: 16, color: SB.inkFaded,
            marginLeft: 44,
          }}>
            {trips.length} adventure{trips.length !== 1 ? "s" : ""} in the logbook ✦ where to next?
          </p>
          <div className="mt-1.5 ml-11 h-px w-48" style={{
            background: `linear-gradient(90deg, ${SB.copper}60, transparent)`,
          }} />
        </div>

        {/* Plan trip button */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onCreateNew}
          className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto"
          style={{
            background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`,
            color: "white",
            padding: "10px 18px",
            borderRadius: 3,
            fontFamily: "Georgia, serif",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: `2px 3px 0 #b05a20, 3px 6px 12px ${SB.copper}40`,
          }}
        >
          <Plane style={{ width: 15, height: 15 }} />
          Plan New Trip
        </motion.button>
      </div>

      {/* ── Filter tabs — vintage film strip ── */}
      <div className="flex gap-2 mb-7 overflow-x-auto pb-1">
        {filterCfg.map(({ key, label, emoji, washi }) => {
          const isActive = filter === key;
          const count = key === "all" ? trips.length : trips.filter(t => t.status === key).length;
          return (
            <motion.button
              key={key}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(key)}
              className="flex items-center gap-1.5 flex-shrink-0"
              style={{
                padding: "6px 14px",
                background: isActive ? washi : "transparent",
                border: `1px solid ${isActive ? "transparent" : SB.cardBorder}`,
                borderRadius: 2,
                color: isActive ? SB.ink : SB.inkFaded,
                fontFamily: isActive ? "'Courier New', monospace" : "system-ui",
                fontSize: 11,
                fontWeight: "bold",
                letterSpacing: isActive ? "0.1em" : "normal",
                textTransform: isActive ? "uppercase" : "none",
                boxShadow: isActive ? "1px 2px 5px rgba(100,60,20,0.15)" : "none",
                transition: "all 0.2s",
              }}
            >
              <span>{emoji}</span>
              {label}
              {count > 0 && (
                <span style={{
                  background: isActive ? "rgba(0,0,0,0.12)" : "#e8d8c0",
                  color: isActive ? SB.ink : SB.inkFaded,
                  fontSize: 9,
                  fontWeight: "bold",
                  padding: "1px 5px",
                  borderRadius: 2,
                  fontFamily: "'Courier New', monospace",
                }}>{count}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 ? (
        <div className="relative overflow-hidden rounded-sm py-16 text-center"
          style={{ background: "#fdf9f0", border: `1px solid ${SB.cardBorder}`, boxShadow: SB.cardShadow }}>
          {/* Torn top edge */}
          <div className="absolute top-0 inset-x-0" style={{ height: 20 }}>
            <svg viewBox="0 0 400 20" className="w-full h-5" preserveAspectRatio="none">
              <path d="M0,0 L0,8 Q20,18 40,8 Q60,0 80,12 Q100,20 120,8 Q140,0 160,14 Q180,20 200,8 Q220,0 240,12 Q260,20 280,8 Q300,0 320,14 Q340,20 360,8 Q380,0 400,10 L400,0Z"
                fill={SB.parchment} />
            </svg>
          </div>
          <div className="relative" style={{ zIndex: 5 }}>
            <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-4"
              style={{ background: `${SB.copper}15`, border: `2px dashed ${SB.copper}40` }}>
              <Plane style={{ width: 28, height: 28, color: SB.copper, opacity: 0.7 }} />
            </div>
            <h3 style={{ color: SB.ink, fontFamily: "Georgia, serif", marginBottom: 6 }}>No trips in this category</h3>
            <p style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 17, marginBottom: 20 }}>
              Your next adventure awaits you!
            </p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onCreateNew}
              style={{
                background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`,
                color: "white", padding: "10px 22px", borderRadius: 3,
                fontFamily: "Georgia, serif", fontSize: 14,
                boxShadow: `2px 2px 8px ${SB.copper}50`,
              }}>
              + Create Your First Trip
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
          {/* Trip cards */}
          {filtered.map((trip, i) => (
            <PostcardTripCard
              key={trip.id}
              trip={trip}
              onDelete={() => onDelete(trip.id)}
              idx={i}
            />
          ))}

          {/* Torn paper add card */}
          <TornPaperAddCard onCreateNew={onCreateNew} />
        </div>
      )}

      {/* ── Bottom decorative row ── */}
      {trips.length > 0 && (
        <div className="flex items-center gap-3 mt-6 justify-center">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${SB.cardBorder})` }} />
          <span style={{ fontFamily: "'Caveat', cursive", color: SB.inkFaded, fontSize: 15 }}>
            ✦ {trips.length} trip{trips.length !== 1 ? "s" : ""} logged
          </span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${SB.cardBorder})` }} />
        </div>
      )}

      {/* ── Keyframe for pin glow ── */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
