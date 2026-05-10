import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Plus, Trash2, Calendar, ChevronDown,
  Plane, Clock, Map as MapIcon,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────
interface ItineraryDay {
  id: number; day: number; date: string; city: string;
  activity: string; notes: string; img: string; expanded: boolean;
}

// ─── Design Tokens ───────────────────────────────────────────────
const SB = {
  parchment: "#f0e8d8", cream: "#fdf9f0", cardBorder: "#ddd0b4",
  ink: "#3d2414", inkMed: "#7a5c42", inkFaded: "#b09478",
  copper: "#c87432", gold: "#d4a853", goldLight: "#f0cc80",
  green: "#4a7c59", leather: "#0c1520", leatherMid: "#1a2840",
};

// ─── City Database (lat/lng → SVG coords) ────────────────────────
// Map: viewBox "0 0 640 480", lat 36-62°N, lng -12-32°E
// x = (lng + 12) / 44 * 640,  y = (62 - lat) / 26 * 480
const CITY_DB: Record<string, [number, number]> = {
  "paris": [209, 241], "paris, france": [209, 241],
  "lucerne": [296, 274], "lucerne, switzerland": [296, 274],
  "interlaken": [289, 281], "interlaken, switzerland": [289, 281],
  "venice": [354, 302], "venice, italy": [354, 302],
  "rome": [357, 373], "rome, italy": [357, 373],
  "london": [171, 196], "london, uk": [171, 196],
  "amsterdam": [246, 181], "amsterdam, netherlands": [246, 181],
  "barcelona": [206, 383], "barcelona, spain": [206, 383],
  "madrid": [121, 394], "madrid, spain": [121, 394],
  "munich": [343, 249], "munich, germany": [343, 249],
  "berlin": [370, 191], "berlin, germany": [370, 191],
  "vienna": [414, 247], "vienna, austria": [414, 247],
  "prague": [386, 215], "prague, czech republic": [386, 215],
  "naples": [382, 386], "naples, italy": [382, 386],
  "florence": [338, 329], "florence, italy": [338, 329],
  "milan": [307, 284], "milan, italy": [307, 284],
  "zurich": [299, 266], "zurich, switzerland": [299, 266],
  "geneva": [265, 282], "geneva, switzerland": [265, 282],
  "santorini": [450, 420], "santorini, greece": [450, 420],
  "athens": [462, 412], "athens, greece": [462, 412],
  "lisbon": [63, 375], "lisbon, portugal": [63, 375],
};

function getCityPos(city: string): [number, number] {
  const key = city.toLowerCase().trim();
  if (CITY_DB[key]) return CITY_DB[key];
  const partKey = Object.keys(CITY_DB).find(k => key.includes(k.split(",")[0]) || k.split(",")[0].includes(key.split(",")[0]));
  return CITY_DB[partKey!] || [320, 280]; // center fallback
}

function getCityCode(city: string): string {
  const codes: Record<string, string> = {
    paris: "CDG", lucerne: "ZRH", interlaken: "BSL", venice: "VCE",
    rome: "FCO", london: "LHR", amsterdam: "AMS", barcelona: "BCN",
    madrid: "MAD", munich: "MUC", berlin: "BER", vienna: "VIE",
    prague: "PRG", naples: "NAP", florence: "FLR", milan: "MXP",
    zurich: "ZRH", geneva: "GVA", santorini: "JTR", athens: "ATH", lisbon: "LIS",
  };
  const key = city.toLowerCase().split(",")[0].trim();
  return codes[key] || key.slice(0, 3).toUpperCase();
}

function getCountryFlag(city: string): string {
  const flags: Record<string, string> = {
    france: "🇫🇷", switzerland: "🇨🇭", italy: "🇮🇹", spain: "🇪🇸",
    germany: "🇩🇪", uk: "🇬🇧", netherlands: "🇳🇱", austria: "🇦🇹",
    "czech republic": "🇨🇿", greece: "🇬🇷", portugal: "🇵🇹",
  };
  const low = city.toLowerCase();
  const flag = Object.entries(flags).find(([k]) => low.includes(k));
  return flag ? flag[1] : "🌍";
}

// ─── Bezier curve point computation ──────────────────────────────
function bezierPt(t: number, p0: [number, number], p1: [number, number], p2: [number, number]): [number, number] {
  const mt = 1 - t;
  return [mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
    mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1]];
}

function midControl(a: [number, number], b: [number, number]): [number, number] {
  return [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 40];
}

// ─── Barcode Generator ────────────────────────────────────────────
function Barcode({ seed }: { seed: number }) {
  const bars = Array.from({ length: 28 }, (_, i) => {
    const w = Math.max(1, Math.round(Math.abs(Math.sin(seed * 13 + i * 4.7)) * 3));
    return w;
  });
  let x = 0;
  return (
    <svg width="72" height="20" style={{ opacity: 0.55 }}>
      {bars.map((w, i) => {
        const rect = <rect key={i} x={x} y={0} width={w} height={20} fill="currentColor" />;
        x += w + 1;
        return rect;
      })}
    </svg>
  );
}

// ─── Europe SVG Map ──────────────────────────────────────────────
const GHOST_CITIES = [
  { name: "London", pos: [171, 196] as [number, number] },
  { name: "Amsterdam", pos: [246, 181] as [number, number] },
  { name: "Munich", pos: [343, 249] as [number, number] },
  { name: "Berlin", pos: [370, 191] as [number, number] },
  { name: "Vienna", pos: [414, 247] as [number, number] },
  { name: "Prague", pos: [386, 215] as [number, number] },
  { name: "Madrid", pos: [121, 394] as [number, number] },
  { name: "Barcelona", pos: [206, 383] as [number, number] },
];

function EuropeMap({ itinerary, activeDayId }: { itinerary: ItineraryDay[]; activeDayId: number | null }) {
  const activeItem = itinerary.find(d => d.id === activeDayId);
  const activePos = activeItem ? getCityPos(activeItem.city) : null;
  const activeIdx = itinerary.findIndex(d => d.id === activeDayId);

  // Build routes between consecutive cities
  const routes = itinerary.slice(0, -1).map((d, i) => ({
    from: getCityPos(d.city),
    to: getCityPos(itinerary[i + 1].city),
    fromName: d.city,
    toName: itinerary[i + 1].city,
    idx: i,
    isActive: activeDayId !== null && i === activeIdx - 1,
    isPast: activeDayId !== null && i < activeIdx - 1,
  }));

  // Map zoom: animate towards the active city
  const svgRef = useRef<SVGSVGElement>(null);
  const zoom = activePos
    ? { scale: 1.28, tx: (320 - activePos[0]) * 0.28, ty: (240 - activePos[1]) * 0.28 }
    : { scale: 1, tx: 0, ty: 0 };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-sm" style={{ background: SB.leather, minHeight: 380 }}>
      {/* Outer atmosphere glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 60% 40%, rgba(200,116,50,0.08) 0%, transparent 65%)",
        zIndex: 5,
      }} />

      {/* Label */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3, padding: "3px 8px" }}>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.gold, letterSpacing: "0.2em" }}>
            ROUTE MAP · EUROPE
          </p>
        </div>
      </div>

      {/* Active city overlay */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key={activeDayId}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute top-3 right-3 z-20"
            style={{ background: "rgba(212,168,83,0.15)", border: `1px solid ${SB.gold}40`, borderRadius: 3, padding: "5px 10px", backdropFilter: "blur(8px)" }}
          >
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.gold, letterSpacing: "0.15em" }}>NOW VIEWING</p>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: "white" }}>
              {getCountryFlag(activeItem.city)} {activeItem.city.split(",")[0]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main SVG */}
      <motion.div
        className="w-full h-full"
        animate={{ scale: zoom.scale, x: zoom.tx, y: zoom.ty }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: activePos ? `${activePos[0] / 640 * 100}% ${activePos[1] / 480 * 100}%` : "50% 50%" }}
      >
        <svg ref={svgRef} viewBox="0 0 640 480" className="w-full h-full" style={{ display: "block" }}>
          {/* ── Background ── */}
          <rect width="640" height="480" fill={SB.leather} />

          {/* ── Latitude / Longitude Grid ── */}
          {[0.1, 0.22, 0.35, 0.48, 0.6, 0.72, 0.85, 0.97].map(y => (
            <line key={`h${y}`} x1="0" y1={y * 480} x2="640" y2={y * 480} stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" />
          ))}
          {[0.05, 0.15, 0.25, 0.36, 0.47, 0.58, 0.68, 0.78, 0.88, 0.97].map(x => (
            <line key={`v${x}`} x1={x * 640} y1="0" x2={x * 640} y2="480" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" />
          ))}

          {/* ── Country Outlines ── */}
          {/* UK */}
          <path d="M 90,220 L 171,213 L 165,195 L 132,162 L 120,128 L 108,90 L 85,90 L 74,124 L 84,156 L 70,195 Z"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" strokeLinejoin="round" />
          {/* France */}
          <path d="M 218,200 L 287,246 L 280,336 L 210,358 L 138,338 L 98,265 L 135,230 L 171,213 Z"
            fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeLinejoin="round" />
          {/* Spain */}
          <path d="M 138,338 L 210,358 L 238,370 L 206,383 L 148,396 L 89,374 L 68,343 Z"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeLinejoin="round" />
          {/* Germany */}
          <path d="M 218,200 L 312,185 L 385,198 L 366,248 L 312,258 L 289,262 L 253,250 L 236,228 Z"
            fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeLinejoin="round" />
          {/* Switzerland */}
          <path d="M 253,282 L 289,262 L 316,270 L 310,292 L 262,294 Z"
            fill="rgba(176,208,240,0.07)" stroke="rgba(176,208,240,0.25)" strokeWidth="0.8" strokeLinejoin="round" />
          {/* Austria */}
          <path d="M 313,258 L 420,248 L 416,268 L 352,278 L 290,272 Z"
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7" strokeLinejoin="round" />
          {/* Italy (boot) */}
          <path d="M 265,248 C 325,238 362,237 402,264 C 418,290 422,312 420,355 C 410,382 398,402 416,432 C 398,446 376,440 370,416 C 360,436 354,453 334,442 C 344,413 326,372 312,330 C 302,300 300,278 265,274 Z"
            fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeLinejoin="round" />
          {/* Mediterranean hint */}
          <ellipse cx="340" cy="430" rx="180" ry="40" fill="rgba(20,50,90,0.35)" />
          {/* Atlantic coast */}
          <path d="M 0,130 Q 35,200 20,280 Q 10,340 30,400 L 0,480" fill="rgba(20,50,90,0.3)" />

          {/* ── Coord labels (decorative) ── */}
          {["48°N", "46°N", "44°N", "42°N"].map((lbl, i) => (
            <text key={lbl} x="4" y={200 + i * 48} fill="rgba(255,255,255,0.18)" fontSize="7" fontFamily="'Courier New',monospace">{lbl}</text>
          ))}
          {["0°", "5°E", "10°E", "15°E"].map((lbl, i) => (
            <text key={lbl} x={195 + i * 73} y="474" fill="rgba(255,255,255,0.18)" fontSize="7" fontFamily="'Courier New',monospace">{lbl}</text>
          ))}

          {/* ── Ghost cities (background) ── */}
          {GHOST_CITIES.map(gc => (
            <g key={gc.name}>
              <circle cx={gc.pos[0]} cy={gc.pos[1]} r="2.5" fill="rgba(255,255,255,0.15)" />
              <text x={gc.pos[0] + 5} y={gc.pos[1] + 4} fill="rgba(255,255,255,0.18)"
                fontSize="6" fontFamily="'Courier New',monospace">{gc.name.toUpperCase()}</text>
            </g>
          ))}

          {/* ── Route paths ── */}
          {routes.map((route, i) => {
            const ctrl = midControl(route.from, route.to);
            const pathD = `M ${route.from[0]} ${route.from[1]} Q ${ctrl[0]} ${ctrl[1]} ${route.to[0]} ${route.to[1]}`;
            return (
              <g key={i}>
                {/* Base dashed line */}
                <path d={pathD} fill="none" stroke="rgba(212,168,83,0.18)"
                  strokeWidth="1.2" strokeDasharray="5 4" />
                {/* Active / past highlight */}
                {(route.isPast || route.isActive) && (
                  <motion.path
                    d={pathD} fill="none"
                    stroke={route.isActive ? SB.gold : "rgba(212,168,83,0.5)"}
                    strokeWidth={route.isActive ? 1.8 : 1.2}
                    strokeDasharray="5 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                )}
              </g>
            );
          })}

          {/* ── Itinerary city markers ── */}
          {itinerary.map((day, i) => {
            const pos = getCityPos(day.city);
            const isActive = day.id === activeDayId;
            const isPast = activeDayId !== null && i < activeIdx;
            return (
              <g key={day.id}>
                {/* Outer glow rings */}
                {isActive && (
                  <>
                    <circle cx={pos[0]} cy={pos[1]} r={22} fill="none" stroke={SB.gold} strokeWidth="0.5" opacity="0.25">
                      <animate attributeName="r" values="18;26;18" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={pos[0]} cy={pos[1]} r={12} fill="none" stroke={SB.gold} strokeWidth="0.8" opacity="0.5">
                      <animate attributeName="r" values="10;15;10" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
                {/* City dot */}
                <circle cx={pos[0]} cy={pos[1]} r={isActive ? 6 : 4}
                  fill={isActive ? SB.gold : isPast ? "rgba(212,168,83,0.65)" : "rgba(200,116,50,0.55)"}
                  stroke={isActive ? "white" : "rgba(255,255,255,0.3)"}
                  strokeWidth={isActive ? 1.5 : 1}
                  style={{ transition: "all 0.4s ease" }}
                />
                {/* Day number badge */}
                <circle cx={pos[0] + 8} cy={pos[1] - 8} r="7"
                  fill={isActive ? SB.copper : "rgba(30,40,60,0.85)"}
                  stroke={isActive ? SB.gold : "rgba(255,255,255,0.2)"} strokeWidth="0.8" />
                <text x={pos[0] + 8} y={pos[1] - 4.5} textAnchor="middle" fill="white"
                  fontSize="6.5" fontFamily="'Courier New',monospace" fontWeight="bold">{day.day}</text>
                {/* City label */}
                <text x={pos[0]} y={pos[1] + 18} textAnchor="middle"
                  fill={isActive ? "white" : "rgba(255,255,255,0.5)"}
                  fontSize={isActive ? 8.5 : 7} fontFamily="'Courier New',monospace"
                  fontWeight={isActive ? "bold" : "normal"}
                  style={{ transition: "all 0.3s ease" }}>
                  {day.city.split(",")[0].toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* ── Animated Airplane ── */}
          {activeDayId !== null && activeIdx > 0 && (
            <AnimatedPlane
              key={`plane-${activeDayId}`}
              from={getCityPos(itinerary[activeIdx - 1].city)}
              to={getCityPos(itinerary[activeIdx].city)}
            />
          )}

          {/* ── Compass Rose ── */}
          <g transform="translate(590,42)">
            <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7" />
            <polygon points="0,-14 3,0 0,-4 -3,0" fill={SB.gold} opacity="0.8" />
            <polygon points="0,14 3,0 0,4 -3,0" fill="rgba(255,255,255,0.35)" />
            <polygon points="14,0 0,3 4,0 0,-3" fill="rgba(255,255,255,0.35)" />
            <polygon points="-14,0 0,3 -4,0 0,-3" fill="rgba(255,255,255,0.35)" />
            <circle cx="0" cy="0" r="2.5" fill={SB.gold} opacity="0.85" />
            <text x="0" y="-18" textAnchor="middle" fill={SB.gold} fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" opacity="0.8">N</text>
          </g>

          {/* ── Scale bar ── */}
          <g transform="translate(16, 465)">
            <line x1="0" y1="0" x2="48" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="48" y1="-3" x2="48" y2="3" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="24" y="-5" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="5.5" fontFamily="'Courier New',monospace">500 km</text>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

// ─── Animated Plane Component ─────────────────────────────────────
function AnimatedPlane({ from, to }: { from: [number, number]; to: [number, number] }) {
  const ctrl = midControl(from, to);
  const numPts = 30;
  const pts = Array.from({ length: numPts }, (_, i) => bezierPt(i / (numPts - 1), from, ctrl, to));
  const xs = pts.map(p => p[0] - 8);
  const ys = pts.map(p => p[1] - 8);
  const times = pts.map((_, i) => i / (numPts - 1));

  // Compute rotation angle at midpoint
  const mid = bezierPt(0.5, from, ctrl, to);
  const next = bezierPt(0.55, from, ctrl, to);
  const angle = Math.atan2(next[1] - mid[1], next[0] - mid[0]) * 180 / Math.PI;

  return (
    <motion.foreignObject
      x={xs[0]} y={ys[0]} width="16" height="16"
      animate={{ x: xs, y: ys }}
      transition={{ duration: 2.4, ease: "easeInOut", times }}
      style={{ overflow: "visible" }}
    >
      <div style={{ fontSize: 13, transform: `rotate(${angle + 45}deg)`, lineHeight: 1 }}>✈</div>
    </motion.foreignObject>
  );
}

// ─── Route Connector Between Cards ───────────────────────────────
function RouteConnector({ fromCity, toCity, idx }: { fromCity: string; toCity: string; idx: number }) {
  const from = fromCity.split(",")[0];
  const to = toCity.split(",")[0];
  return (
    <div className="relative flex items-center justify-center py-0.5 z-10" style={{ marginLeft: 0 }}>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${SB.gold}50)` }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: idx * 0.1, type: "spring", bounce: 0.3 }}
        className="flex items-center gap-1.5 mx-3 flex-shrink-0 px-3 py-1 rounded-sm"
        style={{ background: "rgba(212,168,83,0.08)", border: `1px solid ${SB.gold}25` }}
      >
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded, letterSpacing: "0.1em" }}>{from.toUpperCase()}</span>
        <Plane style={{ width: 10, height: 10, color: SB.gold }} />
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded, letterSpacing: "0.1em" }}>{to.toUpperCase()}</span>
      </motion.div>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${SB.gold}50)` }} />
    </div>
  );
}

// ─── Boarding Pass Card ───────────────────────────────────────────
function BoardingPassCard({
  day, idx, onToggle, onDelete, isActive,
}: {
  day: ItineraryDay; idx: number; onToggle: () => void; onDelete: () => void; isActive: boolean;
}) {
  const code = getCityCode(day.city);
  const flag = getCountryFlag(day.city);
  const [hovered, setHovered] = useState(false);

  const flightNum = `EPC-${String(day.day).padStart(2, "0")}`;
  const seat = `${String.fromCharCode(65 + (idx % 6))}${(idx % 12) + 14}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotate: -0.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: idx * 0.08, type: "spring", bounce: 0.25 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative"
      style={{ zIndex: isActive ? 10 : 1 }}
    >
      {/* Active washi tape */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} exit={{ scaleX: 0 }}
            className="absolute pointer-events-none"
            style={{ top: -8, left: "50%", transform: "translateX(-50%)", width: "42%", height: 14, background: "rgba(248,192,160,0.9)", borderRadius: 2, boxShadow: "0 2px 5px rgba(0,0,0,0.12)", zIndex: 20 }}
          />
        )}
      </AnimatePresence>

      {/* Card shell */}
      <div
        style={{
          overflow: "hidden", borderRadius: 4,
          boxShadow: isActive
            ? `3px 5px 0 #c8b890, 4px 8px 22px rgba(100,60,20,0.22), 0 0 0 1.5px ${SB.gold}55`
            : hovered
              ? "3px 4px 0 #d0c0a0, 3px 6px 16px rgba(100,60,20,0.16)"
              : "2px 3px 0 #d8c8a0, 2px 5px 12px rgba(100,60,20,0.12)",
          border: `1px solid ${isActive ? SB.gold + "55" : SB.cardBorder}`,
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* ── Main boarding pass row ── */}
        <button
          onClick={onToggle}
          className="w-full flex items-stretch text-left"
          style={{ minHeight: 90, cursor: "pointer" }}
        >
          {/* LEFT: Dark departure stub */}
          <div className="flex-shrink-0 flex flex-col justify-between p-3 pr-4"
            style={{
              width: "38%",
              background: isActive
                ? `linear-gradient(135deg, #1a0d06, #3d1a08)`
                : `linear-gradient(135deg, ${SB.leatherMid}, #0c1a2e)`,
              transition: "background 0.4s ease",
            }}>
            {/* Top row */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 7, color: "rgba(255,255,255,0.38)", letterSpacing: "0.2em" }}>BOARDING PASS</p>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: SB.gold, letterSpacing: "0.1em", marginTop: 1 }}>{flightNum}</p>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 7, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>SEAT</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "white", fontWeight: "bold" }}>{seat}</p>
              </div>
            </div>

            {/* Airport codes */}
            <div className="flex items-center gap-2 mb-1">
              <div className="text-center">
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 7, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>FROM</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "bold" }}>GUJ</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
                <div style={{ fontSize: 8, color: SB.gold, marginTop: 1 }}>✈</div>
              </div>
              <div className="text-center">
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 7, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>TO</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "white", fontWeight: "bold" }}>{code}</p>
              </div>
            </div>

            {/* Barcode */}
            <div style={{ color: "rgba(255,255,255,0.6)" }}>
              <Barcode seed={day.id} />
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: 5, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", marginTop: 2 }}>
                TRL-{String(day.id * 7 + 1042).padStart(6, "0")}-{code}
              </p>
            </div>
          </div>

          {/* Perforated tear line */}
          <div className="flex-shrink-0 flex flex-col items-center justify-between relative"
            style={{ width: 18, background: "#fdf9f0", paddingTop: 6, paddingBottom: 6 }}>
            {/* Half-circles cut-outs on edges */}
            <div style={{ position: "absolute", top: -6, width: 12, height: 12, borderRadius: "50%", background: isActive ? "#1a0d00" : SB.leather, left: "50%", transform: "translateX(-50%)" }} />
            <div style={{ position: "absolute", bottom: -6, width: 12, height: 12, borderRadius: "50%", background: isActive ? "#1a0d00" : SB.leather, left: "50%", transform: "translateX(-50%)" }} />
            {/* Dashed center line */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2" style={{ width: 1, borderLeft: `1.5px dashed ${SB.cardBorder}` }} />
            {/* Punch holes */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: isActive ? "#1a0d00" : SB.leather, border: `1px solid ${SB.cardBorder}`, zIndex: 1, flexShrink: 0 }} />
            ))}
          </div>

          {/* RIGHT: Light arrival stub */}
          <div className="flex-1 flex flex-col justify-between p-3 pl-2"
            style={{ background: "#fdf9f0", position: "relative", overflow: "hidden" }}>
            {/* Notebook lines */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, rgba(139,90,43,0.06) 23px, rgba(139,90,43,0.06) 24px)",
              backgroundPosition: "0 10px",
            }} />

            <div className="relative">
              {/* Day header */}
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.gold, letterSpacing: "0.18em", background: `${SB.gold}18`, padding: "1px 5px", borderRadius: 2 }}>
                      DAY {day.day}
                    </span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded }}>{day.date}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: SB.ink, lineHeight: 1.1 }}>
                    {flag} {day.city.split(",")[0]}
                  </h3>
                  {day.city.includes(",") && (
                    <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded, letterSpacing: "0.08em" }}>
                      {day.city.split(",").slice(1).join(",").trim().toUpperCase()}
                    </p>
                  )}
                </div>
                {/* Destination stamp */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center"
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    border: `2px solid ${isActive ? SB.copper : SB.cardBorder}`,
                    background: isActive ? `${SB.copper}15` : "transparent",
                    transform: `rotate(${-6 + idx * 4}deg)`,
                    transition: "all 0.3s ease",
                  }}>
                  <p style={{ fontSize: 14, lineHeight: 1 }}>{flag}</p>
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: 6, color: isActive ? SB.copper : SB.inkFaded, letterSpacing: "0.1em" }}>{code}</p>
                </div>
              </div>

              {/* Activity preview */}
              <p style={{ fontFamily: "Georgia, serif", fontSize: 11.5, color: SB.inkMed, fontStyle: "italic", marginTop: 2 }}>
                {day.activity || "No activities yet"}
              </p>
            </div>

            {/* Expand chevron */}
            <div className="relative flex items-center justify-end mt-1">
              <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown style={{ width: 14, height: 14, color: SB.inkFaded }} />
              </motion.div>
            </div>
          </div>
        </button>

        {/* ── Expanded content ── */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ borderTop: `1px dashed ${SB.cardBorder}`, background: "#fdf9f0" }}>
                {/* Day photo strip */}
                <div className="relative overflow-hidden" style={{ height: 140 }}>
                  <img src={day.img} alt={day.city} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,13,6,0.7) 0%, transparent 60%)" }} />
                  {/* Film grain texture overlay */}
                  <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.35) 100%)", mixBlendMode: "multiply" }} />
                  {/* Date stamp watermark */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-sm"
                    style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "rgba(255,255,255,0.8)", letterSpacing: "0.12em" }}>
                      📅 {day.date.toUpperCase()}
                    </p>
                  </div>
                  {/* City name overlay */}
                  <div className="absolute bottom-3 left-3">
                    <p style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                      {day.city.split(",")[0]}
                    </p>
                  </div>
                  {/* Delete button */}
                  <button onClick={onDelete}
                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-sm transition-all"
                    style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,120,100,0.9)", backdropFilter: "blur(4px)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(192,57,43,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.35)")}
                  >
                    <Trash2 style={{ width: 10, height: 10 }} />
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: "0.1em" }}>REMOVE</span>
                  </button>
                </div>

                {/* Detail cards */}
                <div className="grid grid-cols-2 gap-0" style={{ borderTop: `1px solid ${SB.cardBorder}40` }}>
                  {/* Activities */}
                  <div className="p-4" style={{ borderRight: `1px solid ${SB.cardBorder}40` }}>
                    <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.gold, letterSpacing: "0.18em", marginBottom: 6 }}>🎯 ACTIVITIES</p>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: SB.ink }}>{day.activity || "—"}</p>
                  </div>
                  {/* Notes */}
                  <div className="p-4" style={{ background: "rgba(248,228,144,0.12)" }}>
                    <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded, letterSpacing: "0.18em", marginBottom: 6 }}>📝 FIELD NOTES</p>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: 12, color: SB.inkMed, fontStyle: "italic" }}>{day.notes || "No notes yet."}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Add Day Form ─────────────────────────────────────────────────
function AddDayForm({ onAdd, onClose, nextDay }: { onAdd: (d: any) => void; onClose: () => void; nextDay: number }) {
  const [form, setForm] = useState({ day: nextDay, date: "", city: "", activity: "", notes: "" });
  const up = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.city.trim() || !form.date) { toast.error("City and date are required!"); return; }
    onAdd({
      ...form,
      img: "https://images.unsplash.com/photo-1560462063-c724abddaf9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scaleY: 0.9 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
      transition={{ type: "spring", bounce: 0.2 }}
      style={{ transformOrigin: "top" }}
    >
      <div className="relative rounded-sm overflow-hidden mb-4"
        style={{ background: "#fdf9f0", border: `1px solid ${SB.cardBorder}`, boxShadow: "2px 3px 0 #d8c8a0, 3px 5px 14px rgba(100,60,20,0.12)" }}>
        {/* Washi tape top */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ width: "35%", height: 14, background: "rgba(176,224,192,0.9)", borderRadius: 2, zIndex: 10, transform: "translateX(-50%) rotate(-0.5deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />

        {/* Notebook lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(139,90,43,0.06) 31px, rgba(139,90,43,0.06) 32px)",
          backgroundPosition: "0 40px",
        }} />
        {/* Margin line */}
        <div className="absolute top-0 bottom-0" style={{ left: 40, width: 1, background: "rgba(192,57,43,0.12)" }} />
        {/* Spiral holes */}
        <div className="absolute top-0 bottom-0 left-3 flex flex-col justify-evenly pointer-events-none" style={{ zIndex: 2 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", border: `1.5px solid ${SB.cardBorder}`, background: SB.parchment }} />
          ))}
        </div>

        <div className="relative pl-12 pr-5 pt-7 pb-5">
          <h4 style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: SB.ink, marginBottom: 16 }}>✍️ Add New Day</h4>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: "Day #", key: "day", type: "number" },
              { label: "Date *", key: "date", type: "date" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontFamily: "'Caveat', cursive", fontSize: 16, color: SB.inkMed, marginBottom: 2 }}>{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={e => up(f.key, f.type === "number" ? +e.target.value : e.target.value)}
                  className="w-full py-2 outline-none"
                  style={{ background: "transparent", borderBottom: `1.5px solid ${SB.cardBorder}`, color: SB.ink, fontFamily: "Georgia, serif", fontSize: 13, paddingLeft: 0 }} />
              </div>
            ))}
          </div>

          {[
            { label: "City / Location *", key: "city", ph: "e.g. Barcelona, Spain" },
            { label: "Activities", key: "activity", ph: "e.g. Sagrada Família, La Boqueria" },
            { label: "Field Notes", key: "notes", ph: "Tips, reminders, must-tries..." },
          ].map(f => (
            <div key={f.key} className="mb-4">
              <label style={{ display: "block", fontFamily: "'Caveat', cursive", fontSize: 16, color: SB.inkMed, marginBottom: 2 }}>{f.label}</label>
              <input type="text" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => up(f.key, e.target.value)}
                className="w-full py-2 outline-none"
                style={{ background: "transparent", borderBottom: `1.5px solid ${SB.cardBorder}`, color: SB.ink, fontFamily: "Georgia, serif", fontSize: 13, paddingLeft: 0 }} />
            </div>
          ))}

          <div className="flex gap-3 mt-5 pt-4" style={{ borderTop: `1px dashed ${SB.cardBorder}` }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
              style={{ flex: 1, padding: "10px 18px", background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`, color: "white", borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 600, boxShadow: `2px 2px 0 #b05a20`, border: "none", cursor: "pointer" }}>
              Save to Itinerary ✦
            </motion.button>
            <button onClick={onClose}
              style={{ padding: "10px 16px", border: `1px solid ${SB.cardBorder}`, background: SB.parchment, color: SB.inkMed, borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────
export function ItinerarySection({
  itinerary, onToggle, onDelete, onAdd,
}: {
  itinerary: ItineraryDay[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd: (d: any) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const activeDayId = itinerary.find(d => d.expanded)?.id ?? null;

  const handleToggle = useCallback((id: number) => {
    onToggle(id);
  }, [onToggle]);

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span style={{ fontSize: 28 }}>📖</span>
            <h2 style={{ fontFamily: "Georgia, serif", color: SB.ink, letterSpacing: "-0.01em" }}>Itinerary Builder</h2>
          </div>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: SB.inkFaded, marginLeft: 44 }}>
            {itinerary.length} {itinerary.length === 1 ? "day" : "days"} planned · click any day to highlight the route
          </p>
          <div className="mt-1.5 ml-11 h-px w-40" style={{ background: `linear-gradient(90deg, ${SB.copper}60, transparent)` }} />
        </div>
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto"
          style={{
            background: showForm ? SB.parchment : `linear-gradient(135deg, ${SB.copper}, #e8943a)`,
            color: showForm ? SB.inkMed : "white",
            padding: "10px 18px", borderRadius: 3,
            fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 600,
            boxShadow: showForm ? "none" : `2px 3px 0 #b05a20, 3px 5px 12px ${SB.copper}35`,
            border: showForm ? `1px solid ${SB.cardBorder}` : "none",
          }}
        >
          <motion.div animate={{ rotate: showForm ? 45 : 0 }} transition={{ duration: 0.25 }}>
            <Plus style={{ width: 15, height: 15 }} />
          </motion.div>
          {showForm ? "Cancel" : "Add Day"}
        </motion.button>
      </div>

      {/* ── Add Day Form ── */}
      <AnimatePresence>
        {showForm && (
          <AddDayForm
            onAdd={d => { onAdd(d); setShowForm(false); }}
            onClose={() => setShowForm(false)}
            nextDay={itinerary.length + 1}
          />
        )}
      </AnimatePresence>

      {/* ── Main Layout: Cards left + Map right ── */}
      <div className="flex gap-5 items-start">

        {/* Cards Panel */}
        <div className="flex-1 min-w-0" style={{ maxWidth: "55%" }}>
          {itinerary.length === 0 ? (
            <div className="py-16 text-center rounded-sm"
              style={{ background: "#fdf9f0", border: `1px solid ${SB.cardBorder}`, boxShadow: "2px 3px 0 #d8c8a0" }}>
              <Plane style={{ width: 32, height: 32, color: SB.copper, opacity: 0.6, margin: "0 auto 12px" }} />
              <h3 style={{ color: SB.ink, fontFamily: "Georgia, serif", marginBottom: 6 }}>No days yet</h3>
              <p style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 17 }}>Add your first destination to begin</p>
            </div>
          ) : (
            <div className="space-y-1">
              {itinerary.map((day, i) => (
                <div key={day.id}>
                  <BoardingPassCard
                    day={day}
                    idx={i}
                    onToggle={() => handleToggle(day.id)}
                    onDelete={() => onDelete(day.id)}
                    isActive={day.expanded}
                  />
                  {i < itinerary.length - 1 && (
                    <RouteConnector
                      fromCity={day.city}
                      toCity={itinerary[i + 1].city}
                      idx={i}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          {itinerary.length > 0 && (
            <div className="flex items-center gap-3 mt-5 justify-center">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${SB.cardBorder})` }} />
              <p style={{ fontFamily: "'Caveat', cursive", color: SB.inkFaded, fontSize: 14 }}>
                ✦ {itinerary.length} stop{itinerary.length !== 1 ? "s" : ""} · click a card to explore
              </p>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${SB.cardBorder})` }} />
            </div>
          )}
        </div>

        {/* ── Sticky Map Panel ── */}
        <div className="flex-shrink-0 hidden lg:block" style={{ width: "44%", position: "sticky", top: 24 }}>
          {/* Map card */}
          <div style={{
            borderRadius: 4, overflow: "hidden",
            boxShadow: "3px 4px 0 #1a2840, 4px 8px 22px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <EuropeMap itinerary={itinerary} activeDayId={activeDayId} />
          </div>

          {/* Map legend */}
          <div className="mt-3 flex flex-wrap gap-3 justify-center">
            {[
              { dot: SB.gold, label: "Active city" },
              { dot: "rgba(212,168,83,0.55)", label: "Visited" },
              { dot: "rgba(200,116,50,0.5)", label: "Upcoming" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.dot }} />
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.inkFaded, letterSpacing: "0.08em" }}>{item.label.toUpperCase()}</p>
              </div>
            ))}
          </div>

          {/* Active day info overlay */}
          <AnimatePresence>
            {activeDayId !== null && (() => {
              const active = itinerary.find(d => d.id === activeDayId);
              return active ? (
                <motion.div
                  key={activeDayId}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  className="mt-3 p-3 rounded-sm"
                  style={{ background: "#fdf9f0", border: `1px solid ${SB.cardBorder}`, boxShadow: "1px 2px 6px rgba(100,60,20,0.1)" }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: SB.gold, boxShadow: `0 0 6px ${SB.gold}` }} />
                    <p style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: SB.gold, letterSpacing: "0.15em" }}>CURRENTLY VIEWING</p>
                  </div>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: SB.ink }}>
                    {getCountryFlag(active.city)} {active.city} — Day {active.day}
                  </p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 12, color: SB.inkFaded, fontStyle: "italic", marginTop: 2 }}>
                    {active.activity}
                  </p>
                </motion.div>
              ) : null;
            })()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
