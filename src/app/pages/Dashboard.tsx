import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Plus, Bell, Search, Calendar, DollarSign,
  Users, Plane, ChevronRight, TrendingUp, Map, Camera,
  Award, Menu, LogOut, Settings, User, Heart, Share2,
  ChevronDown, Package, Edit3, Trash2, Check, X,
  Globe, Star, Shield, Bell as BellIcon, Eye, Moon,
  HelpCircle, ChevronLeft, Image, Pencil, Flag,
  BookOpen, Compass, Coffee, Utensils, Car, Hotel,
  Phone, CreditCard, FileText, Stethoscope, Stamp
} from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "../context/AuthContext";
import { TripsSection } from "../components/TripsScrapbook";
import { CreateTripSection } from "../components/CreateTripDiary";
import { ItinerarySection } from "../components/ItineraryRoute";
import { CommunitySection } from "../components/CommunityStories";
import { MemoriesSection } from "../components/MemoryAlbum";

// ─── Types ───────────────────────────────────────────────────────
interface Trip {
  id: number; name: string; destination: string;
  startDate: string; endDate: string; budget: string;
  days_count: string; img: string; status: "upcoming" | "past" | "planning";
}
interface ItineraryDay {
  id: number; day: number; date: string; city: string;
  activity: string; notes: string; img: string; expanded: boolean;
}
interface PackItem { id: number; text: string; done: boolean; category: string; }

// ─── Initial Data ────────────────────────────────────────────────
const DEFAULT_TRIPS: Trip[] = [
  { id: 1, name: "European Escape", destination: "Europe", startDate: "2026-05-20", endDate: "2026-06-05", budget: "2450", days_count: "16 DAYS", img: "https://images.unsplash.com/photo-1560462063-c724abddaf9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", status: "upcoming" },
];
const DEFAULT_ITINERARY: ItineraryDay[] = [
  { id: 1, day: 1, date: "May 20", city: "Paris, France", activity: "Eiffel Tower, City Tour", notes: "Check in at Le Marais hotel. Evening Seine river cruise.", img: "https://images.unsplash.com/photo-1595441857632-71570ef36580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300", expanded: false },
  { id: 2, day: 2, date: "May 22", city: "Lucerne, Switzerland", activity: "Lake Geneva, Chapel Bridge", notes: "Train from Paris Gare de Lyon. Must try cheese fondue!", img: "https://images.unsplash.com/photo-1584212882409-aef913bb81ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300", expanded: false },
  { id: 3, day: 3, date: "May 25", city: "Interlaken, Switzerland", activity: "Jungfraujoch, Adventure", notes: "Book gondola ticket in advance. Weather can change quickly.", img: "https://images.unsplash.com/photo-1673505413397-0cd0dc4f5854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300", expanded: false },
  { id: 4, day: 4, date: "May 29", city: "Venice, Italy", activity: "Gondola Ride, Murano Island", notes: "No cars in Venice! Walk or take vaporetto water bus.", img: "https://images.unsplash.com/photo-1653670477141-0a91c4f09408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300", expanded: false },
  { id: 5, day: 5, date: "Jun 02", city: "Rome, Italy", activity: "Colosseum, Vatican City", notes: "Pre-book Vatican & Colosseum tickets. Dress code required.", img: "https://images.unsplash.com/photo-1560462063-c724abddaf9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300", expanded: false },
];
const PACK_ITEMS: PackItem[] = [
  { id: 1, text: "T-shirts", done: true, category: "Clothing" },
  { id: 2, text: "Jeans / Pants", done: true, category: "Clothing" },
  { id: 3, text: "Light Jacket", done: true, category: "Clothing" },
  { id: 4, text: "Socks (7 pairs)", done: false, category: "Clothing" },
  { id: 5, text: "Underwear", done: false, category: "Clothing" },
  { id: 6, text: "Sleepwear", done: false, category: "Clothing" },
  { id: 7, text: "Sneakers", done: false, category: "Clothing" },
  { id: 8, text: "Sunscreen SPF 50", done: false, category: "Essentials" },
  { id: 9, text: "First Aid Kit", done: false, category: "Essentials" },
  { id: 10, text: "Medications", done: true, category: "Essentials" },
  { id: 11, text: "Hand Sanitizer", done: true, category: "Essentials" },
  { id: 12, text: "Insect Repellent", done: false, category: "Essentials" },
  { id: 13, text: "Phone Charger", done: true, category: "Gadgets" },
  { id: 14, text: "Camera + SD Cards", done: false, category: "Gadgets" },
  { id: 15, text: "Power Bank", done: true, category: "Gadgets" },
  { id: 16, text: "Universal Adapter", done: false, category: "Gadgets" },
  { id: 17, text: "Earphones", done: true, category: "Gadgets" },
  { id: 18, text: "Passport", done: true, category: "Documents" },
  { id: 19, text: "Visa / e-Visa", done: true, category: "Documents" },
  { id: 20, text: "Travel Insurance", done: false, category: "Documents" },
  { id: 21, text: "Hotel Booking Printouts", done: false, category: "Documents" },
  { id: 22, text: "Emergency Contact List", done: false, category: "Documents" },
  { id: 23, text: "Travel Pillow", done: false, category: "Others" },
  { id: 24, text: "Umbrella", done: false, category: "Others" },
  { id: 25, text: "Reusable Water Bottle", done: true, category: "Others" },
];
const budgetData = [
  { name: "Accommodation", value: 40, color: "#c87432" },
  { name: "Food", value: 20, color: "#4a7c59" },
  { name: "Transport", value: 30, color: "#3a6b8a" },
  { name: "Activities", value: 10, color: "#7a4a8a" },
];
const communityTrips = [
  { user: "WanderWithMe", location: "Bali, Indonesia", likes: "1.2K", comments: 86, days: "7 DAYS", img: "https://images.unsplash.com/photo-1581665334521-ac9a6f6b4be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", avatar: "WM", avatarColor: "from-blue-400 to-purple-500" },
  { user: "RoamNExplore", location: "Iceland Roadtrip", likes: "892", comments: 54, days: "10 DAYS", img: "https://images.unsplash.com/photo-1774787474172-289b52895472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", avatar: "RE", avatarColor: "from-green-400 to-teal-500" },
  { user: "SunsetChaser", location: "Santorini, Greece", likes: "2.4K", comments: 142, days: "5 DAYS", img: "https://images.unsplash.com/photo-1497339047006-39f2b26f005d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", avatar: "SC", avatarColor: "from-orange-400 to-red-500" },
];
const memories = [
  { id: 1, label: "Santorini, Greece", img: "https://images.unsplash.com/photo-1497339047006-39f2b26f005d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300" },
  { id: 2, label: "Venice, Italy", img: "https://images.unsplash.com/photo-1653670477141-0a91c4f09408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300" },
  { id: 3, label: "Swiss Alps", img: "https://images.unsplash.com/photo-1584212882409-aef913bb81ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300" },
  { id: 4, label: "Paris, France", img: "https://images.unsplash.com/photo-1595441857632-71570ef36580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300" },
];
const stamps = [
  { label: "🇫🇷 France" }, { label: "🇨🇭 Switzerland" }, { label: "🇮🇹 Italy" },
  { label: "🇬🇷 Greece" }, { label: "🇯🇵 Japan" }, { label: "🇮🇩 Indonesia" },
  { label: "🇺🇸 USA" }, { label: "🇪🇸 Spain" },
];
const expenses = [
  { desc: "Hotel in Paris (3 nights)", date: "May 20, 2026", amount: "$450", cat: "🏨" },
  { desc: "Train Paris → Lucerne", date: "May 22, 2026", amount: "$120", cat: "🚂" },
  { desc: "Gondola Ride, Venice", date: "May 29, 2026", amount: "$85", cat: "⛵" },
  { desc: "Dinner at Trattoria Roma", date: "Jun 02, 2026", amount: "$65", cat: "🍝" },
];
const PACK_CATEGORIES = ["All", "Clothing", "Essentials", "Gadgets", "Documents", "Others"];
const sidebarNav = [
  { group: "MY JOURNEY", items: [
    { id: "my-trips", label: "My Trips", icon: Calendar },
    { id: "create-trip", label: "Create Trip", icon: Plus },
    { id: "itinerary", label: "Itinerary Builder", icon: Map },
    { id: "budget", label: "Budget Analytics", icon: TrendingUp },
    { id: "packing", label: "Packing Checklist", icon: Package },
  ]},
  { group: "EXPLORE", items: [
    { id: "community", label: "Community", icon: Users },
    { id: "memories", label: "Memory Journal", icon: Camera },
  ]},
];

// ─── Scrapbook Design Tokens ─────────────────────────────────────
const SB = {
  parchment: "#f0e8d8",
  cream: "#faf6ee",
  cardBorder: "#ddd0b4",
  ink: "#3d2414",
  inkMed: "#7a5c42",
  inkFaded: "#b09478",
  copper: "#c87432",
  leather: "#1a0d06",
  leatherMid: "#2d1a0e",
  leatherLight: "#3d2418",
  gold: "#d4a853",
  goldLight: "#f0cc80",
  cardShadow: "2px 3px 0 #d8c8a0, 3px 6px 14px rgba(100,60,20,0.13)",
  cardShadowHover: "3px 5px 0 #c8b890, 4px 8px 20px rgba(100,60,20,0.2)",
};

// ─── Scrapbook Utility Components ────────────────────────────────
const WASHI = [
  "rgba(248,192,160,0.82)",
  "rgba(176,208,240,0.82)",
  "rgba(248,228,144,0.82)",
  "rgba(176,224,192,0.82)",
  "rgba(216,192,240,0.82)",
];

function WashiTape({ idx = 0, rotate = -0.8, width = "45%" }: { idx?: number; rotate?: number; width?: string }) {
  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        top: -8, left: "50%",
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        width, height: 14,
        background: WASHI[idx % WASHI.length],
        borderRadius: 3,
        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
      }}
    />
  );
}

function PaperPin({ color = "#c0392b" }: { color?: string }) {
  return (
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>
      <div className="w-4 h-4 rounded-full border-2 border-white" style={{ background: color }} />
    </div>
  );
}

function PassportRing({ text, color = "#8b2020", size = 52 }: { text: string; color?: string; size?: number }) {
  return (
    <div className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: size, height: size, border: `2.5px solid ${color}`, opacity: 0.75 }}>
      <span style={{ color, fontFamily: "'Courier New', monospace", fontSize: 7, fontWeight: "bold", letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.2 }}>
        {text}
      </span>
    </div>
  );
}

function TornDivider() {
  return (
    <div className="relative h-3 overflow-hidden my-1">
      <svg viewBox="0 0 400 12" className="w-full h-full" preserveAspectRatio="none">
        <path d="M0,6 Q20,0 40,6 Q60,12 80,6 Q100,0 120,6 Q140,12 160,6 Q180,0 200,6 Q220,12 240,6 Q260,0 280,6 Q300,12 320,6 Q340,0 360,6 Q380,12 400,6 L400,12 L0,12 Z"
          fill="#e8d8c0" opacity="0.6" />
      </svg>
    </div>
  );
}

function ScrapLabel({ children, rotate = 0 }: { children: React.ReactNode; rotate?: number }) {
  return (
    <span className="inline-flex px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase"
      style={{
        background: SB.gold, color: SB.leather,
        fontFamily: "'Courier New', monospace",
        transform: `rotate(${rotate}deg)`, display: "inline-block",
        boxShadow: "1px 1px 3px rgba(0,0,0,0.2)",
      }}>
      {children}
    </span>
  );
}

function SectionHeading({ title, subtitle, emoji = "✈️" }: { title: string; subtitle?: string; emoji?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", color: SB.ink, letterSpacing: "-0.01em" }}>{title}</h2>
          {subtitle && <p className="text-sm" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 15 }}>{subtitle}</p>}
        </div>
      </div>
      <div className="mt-2 h-px" style={{ background: `linear-gradient(90deg, ${SB.copper}60, transparent)` }} />
    </div>
  );
}

function ScrapInput({ label, error, className = "", ...props }: any) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: SB.inkMed, fontFamily: "'Courier New', monospace" }}>{label}</label>}
      <input
        {...props}
        className={`w-full px-4 py-2.5 text-sm outline-none transition-all rounded-sm ${className}`}
        style={{
          background: "#fdf9f2",
          border: `1px solid ${error ? "#c0392b" : "#d8c8a8"}`,
          color: SB.ink,
          fontFamily: "Georgia, serif",
          boxShadow: error ? "0 0 0 2px rgba(192,57,43,0.12)" : "inset 0 1px 3px rgba(100,60,20,0.08)",
        }}
      />
      {error && <p className="mt-1 text-xs" style={{ color: "#c0392b", fontFamily: "Georgia, serif", fontStyle: "italic" }}>{error}</p>}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────
export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("my-trips");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [trips, setTrips] = useState<Trip[]>(DEFAULT_TRIPS);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(DEFAULT_ITINERARY);
  const [packItems, setPackItems] = useState<PackItem[]>(PACK_ITEMS);

  const handleLogout = () => { logout(); toast.info("See you soon! 👋"); navigate("/"); };

  const addTrip = (trip: Omit<Trip, "id" | "status" | "img" | "days_count">) => {
    const imgs = ["https://images.unsplash.com/photo-1560462063-c724abddaf9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", "https://images.unsplash.com/photo-1497339047006-39f2b26f005d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", "https://images.unsplash.com/photo-1581665334521-ac9a6f6b4be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"];
    const days = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));
    setTrips(prev => [...prev, { ...trip, id: Date.now(), status: "upcoming", img: imgs[trips.length % imgs.length], days_count: `${days} DAYS` }]);
    toast.success("🌍 Trip created & saved!", { description: `${trip.name} added to My Trips.` });
    setActiveSection("my-trips");
  };
  const deleteTrip = (id: number) => { setTrips(prev => prev.filter(t => t.id !== id)); toast.success("Trip removed."); };
  const addItineraryDay = (day: Omit<ItineraryDay, "id" | "expanded">) => { setItinerary(prev => [...prev, { ...day, id: Date.now(), expanded: false }]); toast.success("Day added to itinerary!"); };
  const toggleItineraryExpand = (id: number) => { setItinerary(prev => prev.map(d => d.id === id ? { ...d, expanded: !d.expanded } : d)); };
  const deleteItineraryDay = (id: number) => { setItinerary(prev => prev.filter(d => d.id !== id)); toast.success("Day removed."); };
  const togglePackItem = (id: number) => { setPackItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i)); };
  const addPackItem = (text: string, category: string) => { if (!text.trim()) return; setPackItems(prev => [...prev, { id: Date.now(), text: text.trim(), done: false, category }]); toast.success(`Added "${text}" to ${category}`); };
  const deletePackItem = (id: number) => { setPackItems(prev => prev.filter(i => i.id !== id)); };

  const renderSection = () => {
    switch (activeSection) {
      case "my-trips": return <TripsSection trips={trips} onDelete={deleteTrip} onCreateNew={() => setActiveSection("create-trip")} />;
      case "create-trip": return (
        <CreateTripSection onSave={addTrip} onCancel={() => setActiveSection("my-trips")} />
      );
      case "itinerary": return <ItinerarySection itinerary={itinerary} onToggle={toggleItineraryExpand} onDelete={deleteItineraryDay} onAdd={addItineraryDay} />;
      case "budget": return <BudgetSection expenses={expenses} />;
      case "packing": return <PackingSection items={packItems} onToggle={togglePackItem} onAdd={addPackItem} onDelete={deletePackItem} />;
      case "community": return <CommunitySection communityTrips={communityTrips} />;
      case "memories": return <MemoriesSection memories={memories} />;
      case "profile": return <ProfileSection user={user} stamps={stamps} trips={trips} />;
      case "settings": return <SettingsSection darkMode={darkMode} setDarkMode={setDarkMode} />;
      default: return <TripsSection trips={trips} onDelete={deleteTrip} onCreateNew={() => setActiveSection("create-trip")} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: SB.parchment, fontFamily: "Georgia, serif" }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden" style={{ background: "rgba(30,10,0,0.6)", backdropFilter: "blur(2px)" }}
            onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* ─── Sidebar — Leather Journal Cover ─── */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen z-40 w-60 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: `linear-gradient(175deg, ${SB.leatherMid} 0%, ${SB.leather} 60%, #120a04 100%)`, borderRight: `3px solid ${SB.leatherLight}`, boxShadow: "4px 0 24px rgba(0,0,0,0.4)" }}
      >
        {/* Leather texture stripes */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 8px)" }} />

        {/* Spine gold line */}
        <div className="absolute top-0 bottom-0 right-0 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${SB.gold}50, ${SB.gold}40, transparent)` }} />

        {/* User card */}
        <div className="p-4 border-b" style={{ borderColor: `${SB.leatherLight}` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border-2"
              style={{ background: `linear-gradient(135deg, ${SB.copper}, #e8a040)`, borderColor: SB.goldLight, boxShadow: `0 0 12px ${SB.gold}40` }}>
              {user?.initials || "U"}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: SB.goldLight, fontFamily: "'Caveat', cursive", fontSize: 16 }}>{user?.name || "Explorer"}</p>
              <p className="text-xs" style={{ color: SB.gold, fontFamily: "'Courier New', monospace", letterSpacing: "0.08em" }}>Lvl {user?.level || 1} ✦ Explorer</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {sidebarNav.map(group => (
            <div key={group.group} className="mb-5">
              <p className="px-3 mb-2 text-[9px] font-bold tracking-[0.3em]"
                style={{ color: `${SB.gold}60`, fontFamily: "'Courier New', monospace" }}>{group.group}</p>
              {group.items.map(item => {
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-left text-sm mb-0.5 transition-all relative"
                    style={{
                      background: isActive ? `rgba(212,168,83,0.15)` : "transparent",
                      color: isActive ? SB.goldLight : `${SB.gold}70`,
                      borderLeft: isActive ? `2px solid ${SB.gold}` : "2px solid transparent",
                    }}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? SB.gold : `${SB.gold}55` }} />
                    <span style={{ fontFamily: isActive ? "Georgia, serif" : "system-ui", letterSpacing: isActive ? "0.01em" : "normal" }}>{item.label}</span>
                    {isActive && <motion.div layoutId="navDot" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: SB.gold }} />}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t" style={{ borderColor: SB.leatherLight }}>
          <div className="p-3 rounded-sm mb-2 text-center" style={{ background: "rgba(212,168,83,0.1)", border: `1px solid ${SB.gold}30` }}>
            <p className="text-xs font-semibold" style={{ color: SB.gold, fontFamily: "'Caveat', cursive", fontSize: 14 }}>📍 Collect Moments</p>
            <p className="text-xs" style={{ color: `${SB.gold}70`, fontFamily: "'Caveat', cursive" }}>Not Things. ✨</p>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-sm transition-colors"
            style={{ color: "#e87070" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(232,112,112,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar — Newspaper header aesthetic */}
        <div className="border-b px-4 lg:px-6 py-3 flex items-center gap-3"
          style={{ background: SB.cream, borderColor: SB.cardBorder, boxShadow: "0 2px 8px rgba(100,60,20,0.08)" }}>
          <button className="lg:hidden p-2 rounded-sm transition-colors"
            style={{ color: SB.inkMed }}
            onClick={() => setSidebarOpen(true)}
            onMouseEnter={e => (e.currentTarget.style.background = "#f0e8d8")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>Good morning, {user?.name?.split(" ")[0] || "Explorer"}! ✨</p>
            <h2 className="text-base" style={{ fontFamily: "Georgia, serif", color: SB.ink, letterSpacing: "-0.01em" }}>Where to next?</h2>
          </div>
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 rounded-sm px-3 py-2 max-w-xs flex-1 border"
            style={{ background: "#fdf9f2", borderColor: SB.cardBorder, boxShadow: "inset 0 1px 3px rgba(100,60,20,0.06)" }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: SB.inkFaded }} />
            <input placeholder="Search trips, destinations..." className="bg-transparent outline-none text-sm flex-1"
              style={{ color: SB.ink, fontFamily: "Georgia, serif" }}
              onFocus={e => e.target.parentElement!.style.borderColor = SB.copper}
              onBlur={e => e.target.parentElement!.style.borderColor = SB.cardBorder} />
          </div>
          <button className="relative p-2 rounded-sm" style={{ color: SB.inkMed }}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: SB.copper }} />
          </button>
          {/* Profile dropdown */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-sm border transition-all"
              style={{ borderColor: profileOpen ? SB.copper : SB.cardBorder, background: SB.cream }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${SB.copper}, #e8a040)` }}>
                {user?.initials || "U"}
              </div>
              <ChevronDown className="w-3 h-3 transition-transform" style={{ color: SB.inkFaded, transform: profileOpen ? "rotate(180deg)" : "" }} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-sm overflow-hidden z-50"
                  style={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, boxShadow: SB.cardShadow }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: SB.cardBorder, background: "#f5eddc" }}>
                    <p className="font-semibold text-sm" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{user?.name}</p>
                    <p className="text-xs" style={{ color: SB.copper }}>{user?.email}</p>
                  </div>
                  {[{ label: "My Profile", icon: User, id: "profile" }, { label: "Settings", icon: Settings, id: "settings" }].map(item => (
                    <button key={item.label} onClick={() => { setActiveSection(item.id); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: SB.inkMed }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f0e8d8")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <item.icon className="w-4 h-4" style={{ color: SB.inkFaded }} />{item.label}
                    </button>
                  ))}
                  <div className="border-t" style={{ borderColor: SB.cardBorder }}>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "#c0392b" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(192,57,43,0.06)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section Content */}
        <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: SB.parchment }}>
          {/* Parchment grain overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-30"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")" }} />
          <div className={activeSection === "create-trip" ? "flex-1 flex items-center justify-center p-4 lg:p-6" : "p-4 lg:p-6 max-w-5xl mx-auto w-full"}>
            <AnimatePresence mode="wait">
              <motion.div key={activeSection}
                className="w-full"
                initial={{ opacity: 0, y: 16, rotate: 0.3 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}>
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scrapbook Card Wrapper ───────────────────────────────────────
function SCard({ children, className = "", rotate = 0, washi = -1, style = {}, hover = true }: {
  children: React.ReactNode; className?: string; rotate?: number;
  washi?: number; style?: React.CSSProperties; hover?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div className={`relative ${className}`}
      whileHover={hover ? { y: -3, rotate: rotate * 0.5 } : {}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: SB.cream,
        border: `1px solid ${SB.cardBorder}`,
        borderRadius: 4,
        transform: `rotate(${rotate}deg)`,
        boxShadow: hovered ? SB.cardShadowHover : SB.cardShadow,
        transition: "box-shadow 0.25s ease",
        ...style,
      }}>
      {washi >= 0 && <WashiTape idx={washi} />}
      {children}
    </motion.div>
  );
}

// ─── CTA Button ─────────────────────────────────────────────────
function ScrapBtn({ children, onClick, className = "", variant = "primary" }: any) {
  return (
    <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
      onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-sm transition-all ${className}`}
      style={variant === "primary"
        ? { background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`, color: "#fff", boxShadow: `2px 2px 8px ${SB.copper}50` }
        : { background: SB.cream, color: SB.inkMed, border: `1px solid ${SB.cardBorder}`, boxShadow: "1px 1px 4px rgba(100,60,20,0.1)" }
      }>
      {children}
    </motion.button>
  );
}

// ─── [ITINERARY REPLACED] ─────────────────────────────────────────
// Now imported from /components/ItineraryRoute.tsx
// ─── INLINE_OLD_ITINERARY_STUB ───────────��────────────────────────────────
function _DEPRECATED_ItinerarySection({ itinerary, onToggle, onDelete, onAdd }: {
  itinerary: ItineraryDay[]; onToggle: (id: number) => void;
  onDelete: (id: number) => void; onAdd: (d: any) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDay, setNewDay] = useState({ day: itinerary.length + 1, date: "", city: "", activity: "", notes: "", img: "" });

  const handleAdd = () => {
    if (!newDay.city || !newDay.date) { toast.error("City and date are required!"); return; }
    onAdd({ ...newDay, img: "https://images.unsplash.com/photo-1560462063-c724abddaf9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300" });
    setShowAddForm(false);
    setNewDay({ day: itinerary.length + 2, date: "", city: "", activity: "", notes: "", img: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeading title="Itinerary Builder" subtitle={`${itinerary.length} days planned · tap a day to expand`} emoji="📖" />
        <ScrapBtn onClick={() => setShowAddForm(!showAddForm)}><Plus className="w-4 h-4" /> Add Day</ScrapBtn>
      </div>

      {/* Add day form — torn notepad */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-5">
            <div className="relative rounded-sm p-5" style={{ background: WASHI[3], border: `1px solid ${SB.cardBorder}`, boxShadow: SB.cardShadow }}>
              <WashiTape idx={3} rotate={0.5} />
              <h4 className="text-base mb-4" style={{ color: SB.ink, fontFamily: "'Caveat', cursive", fontSize: 20 }}>✍️ New Day</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: SB.inkMed, fontFamily: "'Courier New', monospace" }}>Day #</p>
                  <input type="number" value={newDay.day} onChange={e => setNewDay(d => ({ ...d, day: +e.target.value }))}
                    className="w-full px-3 py-2 text-sm outline-none rounded-sm" style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${SB.cardBorder}`, color: SB.ink }} />
                </div>
                <div>
                  <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: SB.inkMed, fontFamily: "'Courier New', monospace" }}>Date *</p>
                  <input type="date" value={newDay.date} onChange={e => setNewDay(d => ({ ...d, date: e.target.value }))}
                    className="w-full px-3 py-2 text-sm outline-none rounded-sm" style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${SB.cardBorder}`, color: SB.ink }} />
                </div>
              </div>
              {[{ label: "City / Location *", key: "city", ph: "e.g. Barcelona, Spain" }, { label: "Activities", key: "activity", ph: "e.g. Sagrada Família" }, { label: "Notes", key: "notes", ph: "Tips, reminders..." }].map(f => (
                <div key={f.key} className="mb-3">
                  <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: SB.inkMed, fontFamily: "'Courier New', monospace" }}>{f.label}</p>
                  <input type="text" placeholder={f.ph} value={(newDay as any)[f.key]} onChange={e => setNewDay(d => ({ ...d, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm outline-none rounded-sm" style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${SB.cardBorder}`, color: SB.ink, fontFamily: "Georgia, serif" }} />
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <ScrapBtn onClick={handleAdd} className="flex-1 justify-center">Save Day</ScrapBtn>
                <button onClick={() => setShowAddForm(false)} className="flex-1 py-2.5 text-sm rounded-sm" style={{ border: `1px solid ${SB.cardBorder}`, color: SB.inkMed, background: "rgba(255,255,255,0.5)" }}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal pages */}
      <div className="relative space-y-3">
        {/* Vertical thread line */}
        <div className="absolute left-7 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${SB.copper}40, ${SB.copper}20)`, zIndex: 0 }} />

        {itinerary.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="relative">
            {/* Day stamp circle on thread */}
            <div className="absolute left-3.5 top-4 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2"
              style={{ background: SB.cream, borderColor: SB.copper, color: SB.copper, fontFamily: "'Courier New', monospace", boxShadow: `0 0 0 3px ${SB.parchment}` }}>
              {item.day}
            </div>

            <div className="ml-14" style={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, borderRadius: 4, boxShadow: SB.cardShadow, overflow: "hidden" }}>
              <button onClick={() => onToggle(item.id)}
                className="w-full flex items-center gap-3 p-3 text-left transition-colors"
                style={{ borderBottom: item.expanded ? `1px solid ${SB.cardBorder}60` : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f5edd8")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <img src={item.img} alt={item.city} className="w-12 h-10 object-cover rounded-sm flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: SB.copper }} />
                    <p className="font-semibold text-sm truncate" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{item.city}</p>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>{item.date} · {item.activity || "No activities yet"}</p>
                </div>
                <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform" style={{ color: SB.inkFaded, transform: item.expanded ? "rotate(180deg)" : "" }} />
              </button>

              <AnimatePresence>
                {item.expanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <img src={item.img} alt={item.city} className="w-full h-32 object-cover rounded-sm mb-3" style={{ boxShadow: "2px 2px 8px rgba(100,60,20,0.15)" }} />
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: SB.copper }} />
                              <div>
                                <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace", letterSpacing: "0.08em" }}>LOCATION</p>
                                <p className="text-sm font-medium" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{item.city}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#3a6b8a" }} />
                              <div>
                                <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace", letterSpacing: "0.08em" }}>DATE</p>
                                <p className="text-sm" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{item.date}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs mb-1" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace", letterSpacing: "0.08em" }}>🎯 ACTIVITIES</p>
                            <p className="text-sm p-2.5 rounded-sm" style={{ color: SB.ink, background: "#f5edd8", border: `1px solid ${SB.cardBorder}`, fontFamily: "Georgia, serif" }}>{item.activity || "No activities added yet."}</p>
                          </div>
                          {item.notes && (
                            <div>
                              <p className="text-xs mb-1" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace", letterSpacing: "0.08em" }}>📝 NOTES</p>
                              <p className="text-sm p-2.5 rounded-sm italic" style={{ color: SB.inkMed, background: WASHI[2], border: `1px solid ${SB.cardBorder}`, fontFamily: "Georgia, serif" }}>{item.notes}</p>
                            </div>
                          )}
                          <button onClick={() => onDelete(item.id)} className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: "#c0392b" }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                            <Trash2 className="w-3.5 h-3.5" /> Remove this day
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── BUDGET ───────────────────────────────────────────────────────
function BudgetSection({ expenses }: { expenses: any[] }) {
  return (
    <div>
      <SectionHeading title="Budget Analytics" subtitle="Your travel ledger" emoji="💰" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview — vintage ledger card */}
        <SCard washi={0} className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace" }}>Total Budget</p>
              <p className="text-3xl font-bold" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>$2,450</p>
            </div>
            <div className="px-2.5 py-1 rounded-sm" style={{ background: "rgba(74,124,89,0.12)", border: "1px solid rgba(74,124,89,0.3)" }}>
              <p className="text-xs font-bold" style={{ color: "#4a7c59", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" }}>ON TRACK ✓</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[{ label: "Spent", val: "$1,620", bg: "#f5edd8" }, { label: "Remaining", val: "$830", bg: "rgba(74,124,89,0.08)", valColor: "#4a7c59" }].map(s => (
              <div key={s.label} className="rounded-sm p-3 text-center" style={{ background: s.bg, border: `1px solid ${SB.cardBorder}` }}>
                <p className="text-xl font-bold" style={{ color: (s as any).valColor || SB.ink, fontFamily: "Georgia, serif" }}>{s.val}</p>
                <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={budgetData} cx="50%" cy="50%" innerRadius={36} outerRadius={66} paddingAngle={3} dataKey="value">
                  {budgetData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, borderRadius: 4, fontFamily: "Georgia, serif" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {budgetData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                <span className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace" }}>{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </SCard>

        {/* Expenses — ticket stubs */}
        <SCard washi={1} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Recent Expenses</h4>
            <button className="text-xs transition-colors" style={{ color: SB.copper }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>+ Add Expense</button>
          </div>
          <div className="space-y-3 mb-5">
            {expenses.map((exp, i) => (
              <motion.div key={i} whileHover={{ x: 3 }}
                className="flex items-center gap-3 p-3 rounded-sm transition-colors"
                style={{ background: "#f8f3e8", border: `1px solid ${SB.cardBorder}` }}>
                <div className="w-9 h-9 rounded-sm flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, boxShadow: "1px 1px 3px rgba(100,60,20,0.1)" }}>
                  {exp.cat}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{exp.desc}</p>
                  <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace" }}>{exp.date}</p>
                </div>
                <span className="font-bold text-sm flex-shrink-0" style={{ color: SB.copper, fontFamily: "'Courier New', monospace" }}>{exp.amount}</span>
              </motion.div>
            ))}
          </div>
          <TornDivider />
          {/* Budget bars */}
          <div className="space-y-3 mt-2">
            {budgetData.map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: SB.inkMed, fontFamily: "'Courier New', monospace" }}>{d.name}</span>
                  <span style={{ color: SB.ink, fontFamily: "'Courier New', monospace" }}>{d.value}%</span>
                </div>
                <div className="h-2 rounded-sm overflow-hidden" style={{ background: "#e8d8c0" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.value}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-sm" style={{ background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </SCard>
      </div>
    </div>
  );
}

// ─── PACKING ─────────────────────────────────────────────────────
const CAT_ICONS: Record<string, any> = { All: Package, Clothing: User, Essentials: Stethoscope, Gadgets: Phone, Documents: FileText, Others: Coffee };
const CAT_WASHI: Record<string, string> = { All: WASHI[2], Clothing: WASHI[0], Essentials: WASHI[3], Gadgets: WASHI[1], Documents: WASHI[4], Others: WASHI[2] };

function PackingSection({ items, onToggle, onAdd, onDelete }: {
  items: PackItem[]; onToggle: (id: number) => void;
  onAdd: (text: string, cat: string) => void; onDelete: (id: number) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [newItem, setNewItem] = useState("");
  const [showInput, setShowInput] = useState(false);
  const filtered = activeCategory === "All" ? items : items.filter(i => i.category === activeCategory);
  const done = filtered.filter(i => i.done).length;
  const totalDone = items.filter(i => i.done).length;
  const handleAdd = () => { const cat = activeCategory === "All" ? "Others" : activeCategory; onAdd(newItem, cat); setNewItem(""); setShowInput(false); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <SectionHeading title="Packing Checklist" subtitle={`${totalDone}/${items.length} items packed overall`} emoji="🎒" />
        <ScrapBtn onClick={() => setShowInput(!showInput)}><Plus className="w-4 h-4" /> Add Item</ScrapBtn>
      </div>

      {/* Overall progress — like a ticket progress bar */}
      <SCard className="p-4 mb-5" washi={2}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: SB.inkMed, fontFamily: "Georgia, serif" }}>Overall Progress</span>
          <ScrapLabel>{Math.round((totalDone / items.length) * 100)}%</ScrapLabel>
        </div>
        <div className="h-3 rounded-sm overflow-hidden" style={{ background: "#e8d8c0" }}>
          <motion.div className="h-full rounded-sm" initial={{ width: 0 }} animate={{ width: `${(totalDone / items.length) * 100}%` }} transition={{ duration: 0.6 }}
            style={{ background: `linear-gradient(90deg, ${SB.copper}, #e8a040)` }} />
        </div>
        {totalDone === items.length && <p className="text-sm mt-2" style={{ color: "#4a7c59", fontFamily: "'Caveat', cursive", fontSize: 16 }}>🎉 All packed! Ready to explore the world!</p>}
      </SCard>

      {/* Category tabs — sticky tab style */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {PACK_CATEGORIES.map(cat => {
          const Icon = CAT_ICONS[cat];
          const catItems = cat === "All" ? items : items.filter(i => i.category === cat);
          const catDone = catItems.filter(i => i.done).length;
          const isActive = activeCategory === cat;
          return (
            <motion.button key={cat} whileHover={{ y: -2 }} onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold flex-shrink-0 transition-all rounded-sm"
              style={{
                background: isActive ? CAT_WASHI[cat] : SB.cream,
                color: isActive ? SB.ink : SB.inkFaded,
                border: `1px solid ${isActive ? SB.cardBorder : SB.cardBorder}`,
                fontFamily: "'Courier New', monospace", letterSpacing: "0.06em",
                boxShadow: isActive ? SB.cardShadow : "none",
              }}>
              <Icon className="w-3.5 h-3.5" />
              {cat}
              <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold"
                style={{ background: isActive ? "rgba(0,0,0,0.1)" : "#e8d8c0", color: isActive ? SB.ink : SB.inkFaded }}>
                {catDone}/{catItems.length}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Add item form */}
      <AnimatePresence>
        {showInput && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <div className="flex gap-2 p-3 rounded-sm" style={{ background: WASHI[2], border: `1px solid ${SB.cardBorder}` }}>
              <input autoFocus type="text" placeholder={`Add item to ${activeCategory === "All" ? "Others" : activeCategory}...`}
                value={newItem} onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowInput(false); }}
                className="flex-1 px-3 py-2 text-sm outline-none rounded-sm"
                style={{ background: "rgba(255,255,255,0.8)", border: `1px solid ${SB.cardBorder}`, color: SB.ink, fontFamily: "Georgia, serif" }} />
              <ScrapBtn onClick={handleAdd}>Add</ScrapBtn>
              <button onClick={() => setShowInput(false)} className="px-3 py-2 rounded-sm text-sm" style={{ border: `1px solid ${SB.cardBorder}`, color: SB.inkMed, background: "rgba(255,255,255,0.6)" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items — spiral notebook style */}
      <div style={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, borderRadius: 4, boxShadow: SB.cardShadow, overflow: "hidden" }}>
        {/* Notebook top binding */}
        <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: `${SB.cardBorder}60`, background: "#f5edd8" }}>
          <div className="flex gap-3 flex-1">
            {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-4 rounded-full border-2" style={{ borderColor: SB.cardBorder, background: SB.parchment }} />)}
          </div>
          {activeCategory !== "All" && <span className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 14 }}>{done}/{filtered.length} packed</span>}
        </div>
        {filtered.length === 0 ? (
          <div className="py-10 text-center" style={{ color: SB.inkFaded }}>
            <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm" style={{ fontFamily: "Georgia, serif" }}>No items in this category yet.</p>
            <button onClick={() => setShowInput(true)} className="mt-2 text-sm" style={{ color: SB.copper }}>+ Add first item</button>
          </div>
        ) : (
          <div>
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-4 py-3 border-b last:border-none group transition-colors"
                style={{ borderColor: `${SB.cardBorder}50` }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f2e4")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {/* Custom checkbox */}
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => onToggle(item.id)}
                  className="w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: item.done ? SB.copper : "transparent", borderColor: item.done ? SB.copper : SB.inkFaded }}>
                  {item.done && <Check className="w-3 h-3 text-white" />}
                </motion.button>
                <span className="flex-1 text-sm transition-all" style={{ color: item.done ? SB.inkFaded : SB.ink, textDecoration: item.done ? "line-through" : "none", fontFamily: "Georgia, serif" }}>
                  {item.text}
                </span>
                {activeCategory === "All" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-sm flex-shrink-0" style={{ background: CAT_WASHI[item.category], color: SB.ink, fontFamily: "'Courier New', monospace", letterSpacing: "0.08em" }}>{item.category}</span>
                )}
                <button onClick={() => onDelete(item.id)} className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: "#c0392b" }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMMUNITY & MEMORIES replaced by imported components ─────────
// See /src/app/components/CommunityStories.tsx and MemoryAlbum.tsx

// ─── [STUB — kept for reference only, not rendered] ───────────────
function _UNUSED_CommunitySection({ communityTrips }: { communityTrips: any[] }) {
  const [liked, setLiked] = useState<number[]>([]);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeading title="Travel Community" subtitle="Discover & share amazing itineraries" emoji="🌍" />
        <ScrapBtn><Share2 className="w-4 h-4" /> Share Trip</ScrapBtn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communityTrips.map((trip, i) => {
          const rotations = ["-1deg", "0.8deg", "-0.5deg"];
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24, rotate: -1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: i * 0.1, type: "spring", bounce: 0.3 }}
              whileHover={{ y: -5, rotate: 0, zIndex: 10 }}
              className="group"
              style={{ transform: `rotate(${rotations[i % rotations.length]})`, transformOrigin: "center" }}>
              {/* Postcard-style card */}
              <div style={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, borderRadius: 4, boxShadow: SB.cardShadow, overflow: "hidden" }}>
                {/* Washi tape */}
                <div className="relative h-0">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-16 h-4 z-20 rounded-sm"
                    style={{ background: WASHI[i % WASHI.length], boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
                </div>
                <div className="relative pt-2 px-2">
                  <div className="relative overflow-hidden" style={{ borderRadius: 2, height: 180 }}>
                    <img src={trip.img} alt={trip.location} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,10,0,0.7), transparent 60%)" }} />
                    {/* Days stamp */}
                    <div className="absolute top-3 right-3">
                      <div className="px-2 py-0.5" style={{
                        border: `2px solid ${SB.gold}`, color: SB.gold,
                        fontFamily: "'Courier New', monospace", fontSize: 8, fontWeight: "bold",
                        letterSpacing: "0.15em", background: "rgba(0,0,0,0.5)", transform: "rotate(3deg)"
                      }}>{trip.days}</div>
                    </div>
                    {/* Avatar + user */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${trip.avatarColor} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 border border-white/30`}>{trip.avatar}</div>
                      <div>
                        <p className="text-white text-xs font-semibold" style={{ fontFamily: "Georgia, serif" }}>{trip.user}</p>
                        <p className="text-gray-300 text-xs" style={{ fontFamily: "'Caveat', cursive", fontSize: 12 }}>{trip.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Postcard bottom */}
                <div className="px-3 py-2.5 flex items-center justify-between" style={{ borderTop: `1px solid ${SB.cardBorder}60` }}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setLiked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                      className="flex items-center gap-1.5 text-xs transition-colors"
                      style={{ color: liked.includes(i) ? "#c0392b" : SB.inkFaded }}>
                      <Heart className="w-4 h-4" fill={liked.includes(i) ? "#c0392b" : "none"} />
                      {trip.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs" style={{ color: SB.inkFaded }}>
                      <Share2 className="w-4 h-4" />{trip.comments}
                    </button>
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 text-xs rounded-sm font-semibold"
                    style={{ background: WASHI[0], color: SB.ink, border: `1px solid ${SB.cardBorder}`, fontFamily: "'Courier New', monospace" }}>
                    View Trip
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── [STUB — kept for reference only, not rendered] ───────────────
function _UNUSED_MemoriesSection({ memories }: { memories: any[] }) {
  const polaroidRotations = ["-2.5deg", "1.8deg", "-1.2deg", "2.2deg", "-1.5deg"];
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeading title="Memory Journal" subtitle="Your cinematic travel album" emoji="📸" />
        <ScrapBtn><Plus className="w-4 h-4" /> Add Memory</ScrapBtn>
      </div>

      {/* Cork board feel */}
      <div className="relative p-6 rounded-sm" style={{
        background: "linear-gradient(135deg, #c8a070 0%, #b8905a 100%)",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)",
      }}>
        {/* Cork texture */}
        <div className="absolute inset-0 rounded-sm opacity-30"
          style={{ backgroundImage: "radial-gradient(ellipse 3px 2px at 50% 50%, rgba(180,120,60,0.6) 0%, transparent 100%)", backgroundSize: "8px 8px" }} />

        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
          {memories.map((m, i) => (
            <motion.div key={m.id}
              initial={{ opacity: 0, scale: 0.85, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.08, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.08, rotate: 0, y: -8, zIndex: 10 }}
              className="cursor-pointer group"
              style={{ transform: `rotate(${polaroidRotations[i % polaroidRotations.length]})`, transformOrigin: "center bottom" }}>
              {/* Pin */}
              <PaperPin color={["#c0392b", "#2980b9", "#27ae60", "#8e44ad"][i % 4]} />
              {/* Polaroid frame */}
              <div style={{ background: "#fefefe", padding: "6px 6px 28px", boxShadow: "3px 4px 12px rgba(0,0,0,0.3)", borderRadius: 2 }}>
                <div className="relative overflow-hidden" style={{ height: 130, background: "#e8d8c0" }}>
                  <img src={m.img} alt={m.label} className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300" />
                </div>
                {/* Polaroid caption */}
                <p className="text-center mt-2 text-xs truncate px-1" style={{ color: SB.inkMed, fontFamily: "'Caveat', cursive", fontSize: 13 }}>{m.label}</p>
              </div>
            </motion.div>
          ))}

          {/* Add photo polaroid */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 0, y: -4 }}
            className="cursor-pointer group"
            style={{ transform: "rotate(1deg)", transformOrigin: "center bottom" }}>
            <div style={{ background: "#fefefe", padding: "6px 6px 28px", boxShadow: "3px 4px 12px rgba(0,0,0,0.2)", borderRadius: 2, border: `2px dashed ${SB.cardBorder}` }}>
              <div className="flex flex-col items-center justify-center" style={{ height: 130, background: "#f5edd8" }}>
                <Image className="w-6 h-6 mb-1.5 opacity-40" style={{ color: SB.copper }} />
                <span className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>Add Photo</span>
              </div>
              <p className="text-center mt-2 text-xs px-1" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>new memory</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────
function ProfileSection({ user, stamps, trips }: { user: any; stamps: any[]; trips: Trip[] }) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = ["overview", "trips", "badges", "stats"];

  return (
    <div>
      {/* Cover — passport-style header */}
      <div className="relative rounded-sm overflow-hidden mb-0 h-36" style={{ boxShadow: SB.cardShadow }}>
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497339047006-39f2b26f005d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${SB.copper}70, #2d1a0e80)` }} />
        <button className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs border border-white/30 text-white transition-colors" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}>
          <Pencil className="w-3 h-3" /> Edit Cover
        </button>
        {/* Decorative passport lines */}
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 4px, transparent 4px, transparent 12px)" }} />
      </div>

      {/* Profile card */}
      <div className="-mt-1 mb-5" style={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, borderRadius: 4, boxShadow: SB.cardShadow }}>
        <div className="px-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-sm border-4 flex items-center justify-center text-white text-2xl font-bold" style={{ background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`, borderColor: SB.cream, boxShadow: "3px 3px 12px rgba(100,60,20,0.3)" }}>
                {user?.initials || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-sm flex items-center justify-center border-2" style={{ background: SB.gold, borderColor: SB.cream }}>
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
            <ScrapBtn variant="secondary"><Pencil className="w-3.5 h-3.5" /> Edit Profile</ScrapBtn>
          </div>
          <div className="mb-4">
            <h2 style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{user?.name || "Explorer"}</h2>
            <p className="text-sm font-medium" style={{ color: SB.copper }}>🏅 Level {user?.level || 1} Explorer</p>
            {user?.email && <p className="text-sm mt-0.5" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace" }}>{user.email}</p>}
            <p className="text-sm mt-2 max-w-md italic" style={{ color: SB.inkMed, fontFamily: "Georgia, serif" }}>Passionate traveler exploring the world one adventure at a time. 34 countries and counting! ✈️</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[{ value: "34", label: "Countries", icon: Globe }, { value: "128", label: "Cities", icon: MapPin }, { value: `${trips.length}`, label: "Trips", icon: Plane }, { value: "18K", label: "Miles", icon: Compass }].map(stat => (
              <div key={stat.label} className="text-center p-3 rounded-sm" style={{ background: "#f5edd8", border: `1px solid ${SB.cardBorder}` }}>
                <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: SB.copper }} />
                <p className="text-lg font-bold" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{stat.value}</p>
                <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex border-t" style={{ borderColor: SB.cardBorder }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-sm font-medium capitalize transition-all"
              style={{ color: activeTab === tab ? SB.copper : SB.inkFaded, borderBottom: activeTab === tab ? `2px solid ${SB.copper}` : "2px solid transparent", fontFamily: "Georgia, serif" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SCard className="p-4">
                <h4 className="mb-3" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Recent Adventures</h4>
                {trips.length === 0 ? <p className="text-sm" style={{ color: SB.inkFaded }}>No trips yet. Start planning!</p> :
                  trips.slice(0, 3).map(t => (
                    <div key={t.id} className="flex items-center gap-3 py-2 border-b last:border-none" style={{ borderColor: `${SB.cardBorder}60` }}>
                      <img src={t.img} alt={t.name} className="w-10 h-10 rounded-sm object-cover" style={{ boxShadow: "1px 1px 4px rgba(100,60,20,0.15)" }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{t.name}</p>
                        <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>{t.destination}</p>
                      </div>
                      <ScrapLabel rotate={-2}>{t.status}</ScrapLabel>
                    </div>
                  ))}
              </SCard>
              <SCard className="p-4" washi={1}>
                <h4 className="mb-3" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Recent Activity</h4>
                {[{ icon: "🗺️", text: "Added Venice day to itinerary", time: "2h ago" }, { icon: "💰", text: "Logged $450 hotel expense", time: "5h ago" }, { icon: "✅", text: "Packed passport & visa", time: "1d ago" }, { icon: "✈️", text: "Created European Escape trip", time: "2d ago" }].map((a, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b last:border-none" style={{ borderColor: `${SB.cardBorder}60` }}>
                    <span className="text-lg leading-none mt-0.5">{a.icon}</span>
                    <div>
                      <p className="text-sm" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{a.text}</p>
                      <p className="text-xs mt-0.5" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </SCard>
            </div>
          )}
          {activeTab === "trips" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map(t => (
                <SCard key={t.id} className="overflow-hidden flex items-center gap-4 p-3">
                  <img src={t.img} alt={t.name} className="w-16 h-16 rounded-sm object-cover flex-shrink-0" style={{ boxShadow: "1px 1px 4px rgba(100,60,20,0.15)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>{t.destination}</p>
                    <ScrapLabel rotate={0}>{t.days_count}</ScrapLabel>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: SB.inkFaded }} />
                </SCard>
              ))}
              {trips.length === 0 && <p className="text-sm col-span-2" style={{ color: SB.inkFaded, fontFamily: "Georgia, serif" }}>No trips planned yet.</p>}
            </div>
          )}
          {activeTab === "badges" && (
            <SCard className="p-5">
              <h4 className="mb-4" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Country Stamps</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {stamps.map(s => (
                  <motion.span key={s.label} whileHover={{ scale: 1.1, y: -2, rotate: [-1, 1, -1, 0] }}
                    className="px-3 py-2 text-sm font-medium cursor-default rounded-sm"
                    style={{ background: WASHI[Math.floor(Math.random() * WASHI.length)], border: `1px solid ${SB.cardBorder}`, color: SB.ink, fontFamily: "Georgia, serif", boxShadow: "1px 1px 3px rgba(100,60,20,0.12)" }}>
                    {s.label}
                  </motion.span>
                ))}
              </div>
              <h4 className="mb-3" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Achievements</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{ icon: "🌏", label: "World Explorer", desc: "30+ countries" }, { icon: "📸", label: "Shutterbug", desc: "100+ memories" }, { icon: "✈️", label: "Frequent Flier", desc: "10+ trips" }, { icon: "💰", label: "Budget Master", desc: "On track always" }].map(a => (
                  <motion.div key={a.label} whileHover={{ y: -3, rotate: 1 }}
                    className="text-center p-3 rounded-sm" style={{ background: "#f5edd8", border: `1px solid ${SB.cardBorder}`, boxShadow: SB.cardShadow }}>
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <p className="text-xs font-semibold" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{a.label}</p>
                    <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 12 }}>{a.desc}</p>
                  </motion.div>
                ))}
              </div>
            </SCard>
          )}
          {activeTab === "stats" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SCard className="p-5" washi={4}>
                <h4 className="mb-4" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Explorer Progress</h4>
                {[{ label: "Countries visited", value: 34, max: 195, color: SB.copper }, { label: "Cities explored", value: 128, max: 500, color: "#4a7c59" }, { label: "Memories logged", value: 847, max: 1000, color: "#3a6b8a" }, { label: "Trips completed", value: trips.filter(t => t.status === "past").length + 5, max: 50, color: "#7a4a8a" }].map(s => (
                  <div key={s.label} className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span style={{ color: SB.inkMed, fontFamily: "Georgia, serif" }}>{s.label}</span>
                      <span style={{ color: SB.ink, fontFamily: "'Courier New', monospace" }}>{s.value} / {s.max}</span>
                    </div>
                    <div className="h-2 rounded-sm overflow-hidden" style={{ background: "#e8d8c0" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(s.value / s.max) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-sm" style={{ background: s.color }} />
                    </div>
                  </div>
                ))}
              </SCard>
              <SCard className="p-5">
                <h4 className="mb-4" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Level Progress</h4>
                <div className="text-center py-4">
                  <div className="w-24 h-24 rounded-sm flex items-center justify-center mx-auto mb-3 shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`, boxShadow: `4px 4px 16px ${SB.copper}50` }}>
                    <div className="text-white text-center">
                      <p className="text-2xl font-bold leading-none" style={{ fontFamily: "Georgia, serif" }}>{user?.level || 1}</p>
                      <p className="text-xs" style={{ fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" }}>LEVEL</p>
                    </div>
                  </div>
                  <p className="font-semibold" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>World Explorer</p>
                  <p className="text-sm mt-1" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 15 }}>6 more countries → Level {(user?.level || 1) + 1}</p>
                </div>
                <div className="h-2.5 rounded-sm overflow-hidden" style={{ background: "#e8d8c0" }}>
                  <div className="h-full rounded-sm" style={{ width: "72%", background: `linear-gradient(90deg, ${SB.copper}, #e8a040)` }} />
                </div>
                <div className="flex justify-between text-xs mt-1" style={{ color: SB.inkFaded, fontFamily: "'Courier New', monospace" }}>
                  <span>Level {user?.level || 1}</span><span>72%</span><span>Level {(user?.level || 1) + 1}</span>
                </div>
              </SCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────
const settingsSections = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Password & Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "appearance", label: "Appearance", icon: Moon },
  { id: "help", label: "Help & Support", icon: HelpCircle },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative rounded-full transition-colors flex-shrink-0"
      style={{ height: 22, width: 40, background: checked ? SB.copper : "#d8c8a8" }}>
      <span className="absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform"
        style={{ width: 18, height: 18, transform: checked ? "translateX(18px)" : "translateX(0)" }} />
    </button>
  );
}

function SettingsSection({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  const [activeSettings, setActiveSettings] = useState("account");
  const [showMobileList, setShowMobileList] = useState(true);
  const [notifs, setNotifs] = useState({ email: true, push: false, trips: true, community: false, budget: true });
  const [privacy, setPrivacy] = useState({ publicProfile: true, showTrips: false, analytics: true });
  const [form, setForm] = useState({ name: "Khushi Patel", email: "khushipatel@gmail.com", bio: "Passionate world explorer ✈️", location: "Gujarat, India" });

  const handleSettingClick = (id: string) => { setActiveSettings(id); setShowMobileList(false); };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        {!showMobileList && (
          <button onClick={() => setShowMobileList(true)} className="md:hidden p-2 rounded-sm" style={{ color: SB.inkMed, border: `1px solid ${SB.cardBorder}` }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <SectionHeading title="Settings" subtitle="Manage your account & preferences" emoji="⚙️" />
      </div>

      <div className="flex gap-5">
        {/* Settings sidebar */}
        <div className={`${showMobileList ? "block" : "hidden"} md:block w-full md:w-52 flex-shrink-0`}>
          <div style={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, borderRadius: 4, boxShadow: SB.cardShadow, overflow: "hidden" }}>
            {settingsSections.map((s, i) => (
              <button key={s.id} onClick={() => handleSettingClick(s.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-all text-left"
                style={{
                  borderBottom: i < settingsSections.length - 1 ? `1px solid ${SB.cardBorder}50` : "none",
                  background: activeSettings === s.id ? "#f5edd8" : "transparent",
                  color: activeSettings === s.id ? SB.copper : SB.inkMed,
                  borderLeft: activeSettings === s.id ? `2px solid ${SB.copper}` : "2px solid transparent",
                  fontFamily: "Georgia, serif",
                }}>
                <s.icon className="w-4 h-4 flex-shrink-0" style={{ color: activeSettings === s.id ? SB.copper : SB.inkFaded }} />
                {s.label}
                {activeSettings === s.id && <ChevronRight className="ml-auto w-3.5 h-3.5" style={{ color: SB.copper }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Settings content */}
        <div className={`${showMobileList ? "hidden" : "block"} md:block flex-1 min-w-0`}>
          <AnimatePresence mode="wait">
            <motion.div key={activeSettings} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}
              style={{ background: SB.cream, border: `1px solid ${SB.cardBorder}`, borderRadius: 4, boxShadow: SB.cardShadow, padding: "1.25rem" }}>

              {activeSettings === "account" && (
                <div className="space-y-5">
                  <h3 style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Account Information</h3>
                  <div className="flex items-center gap-4 p-4 rounded-sm" style={{ background: "#f5edd8", border: `1px solid ${SB.cardBorder}` }}>
                    <div className="w-16 h-16 rounded-sm flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${SB.copper}, #e8943a)`, boxShadow: "2px 2px 8px rgba(100,60,20,0.2)" }}>KP</div>
                    <div>
                      <p className="text-sm mb-1" style={{ color: SB.inkMed, fontFamily: "Georgia, serif" }}>Profile photo</p>
                      <button className="px-3 py-1.5 rounded-sm text-xs transition-colors" style={{ border: `1px solid ${SB.cardBorder}`, color: SB.inkMed, background: SB.cream }}>Change Photo</button>
                    </div>
                  </div>
                  {[{ label: "Full Name", key: "name", type: "text" }, { label: "Email Address", key: "email", type: "email" }, { label: "Location", key: "location", type: "text" }].map(field => (
                    <ScrapInput key={field.key} label={field.label} type={field.type} value={(form as any)[field.key]} placeholder=""
                      onChange={(e: any) => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
                  ))}
                  <div>
                    <p className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: SB.inkMed, fontFamily: "'Courier New', monospace" }}>Bio</p>
                    <textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell the community about yourself..."
                      className="w-full px-4 py-2.5 text-sm outline-none rounded-sm resize-none"
                      style={{ background: "#fdf9f2", border: `1px solid ${SB.cardBorder}`, color: SB.ink, fontFamily: "Georgia, serif", fontStyle: "italic" }} />
                  </div>
                  <ScrapBtn onClick={() => toast.success("Profile saved!")}><Check className="w-4 h-4" /> Save Changes</ScrapBtn>
                </div>
              )}

              {activeSettings === "security" && (
                <div className="space-y-5">
                  <h3 style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Password & Security</h3>
                  {["Current Password", "New Password", "Confirm New Password"].map(f => (
                    <ScrapInput key={f} label={f} type="password" placeholder={`Enter ${f.toLowerCase()}`} value="" onChange={() => {}} />
                  ))}
                  <ScrapBtn onClick={() => toast.success("Password updated!")}>Update Password</ScrapBtn>
                  <div className="border-t pt-5" style={{ borderColor: `${SB.cardBorder}60` }}>
                    <h4 className="mb-3" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 rounded-sm" style={{ background: "#f5edd8", border: `1px solid ${SB.cardBorder}` }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Enable 2FA</p>
                        <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>Add extra security to your account</p>
                      </div>
                      <button onClick={() => toast.info("2FA setup coming soon!")} className="px-3 py-1.5 rounded-sm text-xs transition-colors" style={{ border: `1px solid ${SB.copper}`, color: SB.copper }}>Set Up</button>
                    </div>
                  </div>
                </div>
              )}

              {activeSettings === "notifications" && (
                <div className="space-y-4">
                  <h3 className="mb-4" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Notification Preferences</h3>
                  {[{ key: "email", label: "Email Notifications", desc: "Receive updates via email" }, { key: "push", label: "Push Notifications", desc: "Browser & mobile push alerts" }, { key: "trips", label: "Trip Reminders", desc: "Reminders before your trips" }, { key: "community", label: "Community Activity", desc: "Likes, comments on your trips" }, { key: "budget", label: "Budget Alerts", desc: "Get notified when near budget limit" }].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-sm transition-colors" style={{ background: "#f8f3e8", border: `1px solid ${SB.cardBorder}` }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>{item.desc}</p>
                      </div>
                      <Toggle checked={(notifs as any)[item.key]} onChange={() => setNotifs(n => ({ ...n, [item.key]: !(n as any)[item.key] }))} />
                    </div>
                  ))}
                </div>
              )}

              {activeSettings === "privacy" && (
                <div className="space-y-4">
                  <h3 className="mb-4" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Privacy Settings</h3>
                  {[{ key: "publicProfile", label: "Public Profile", desc: "Let other travelers find your profile" }, { key: "showTrips", label: "Show My Trips", desc: "Display your trips in the community" }, { key: "analytics", label: "Usage Analytics", desc: "Help improve Traveloop with usage data" }].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-sm" style={{ background: "#f8f3e8", border: `1px solid ${SB.cardBorder}` }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>{item.desc}</p>
                      </div>
                      <Toggle checked={(privacy as any)[item.key]} onChange={() => setPrivacy(p => ({ ...p, [item.key]: !(p as any)[item.key] }))} />
                    </div>
                  ))}
                  <div className="border-t pt-4" style={{ borderColor: `${SB.cardBorder}60` }}>
                    <button onClick={() => toast.error("Account deletion requires email confirmation.")}
                      className="flex items-center gap-2 text-sm transition-colors" style={{ color: "#c0392b" }}>
                      <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                  </div>
                </div>
              )}

              {activeSettings === "appearance" && (
                <div className="space-y-5">
                  <h3 style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Appearance</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-sm" style={{ background: "#f5edd8", border: `1px solid ${SB.cardBorder}` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: `${SB.copper}20` }}>
                        <Moon className="w-5 h-5" style={{ color: SB.copper }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Dark Mode</p>
                        <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>{darkMode ? "Dark theme is active" : "Switch to dark theme"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold" style={{ color: SB.copper, fontFamily: "'Courier New', monospace" }}>{darkMode ? "ON" : "OFF"}</span>
                      <Toggle checked={darkMode} onChange={() => { setDarkMode(!darkMode); toast.success(darkMode ? "☀️ Light mode!" : "🌙 Dark mode!"); }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-3" style={{ color: SB.inkMed, fontFamily: "Georgia, serif" }}>Accent Color</p>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                      {[{ name: "Amber", bg: "#f59e0b" }, { name: "Orange", bg: "#f97316" }, { name: "Blue", bg: "#3b82f6" }, { name: "Indigo", bg: "#6366f1" }, { name: "Green", bg: "#10b981" }, { name: "Teal", bg: "#14b8a6" }, { name: "Purple", bg: "#8b5cf6" }, { name: "Rose", bg: "#f43f5e" }].map(t => (
                        <motion.button key={t.name} whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.95 }}
                          onClick={() => toast.success(`${t.name} accent selected!`)} title={t.name}
                          className="aspect-square w-full rounded-sm shadow-sm" style={{ background: t.bg }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-3" style={{ color: SB.inkMed, fontFamily: "Georgia, serif" }}>Font Size</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["Small", "Medium", "Large"].map((size, i) => (
                        <button key={size} onClick={() => toast.info(`Font size: ${size}`)}
                          className="py-2.5 px-3 rounded-sm text-sm transition-all"
                          style={{ background: i === 1 ? SB.copper : SB.cream, color: i === 1 ? "white" : SB.inkMed, border: `1px solid ${i === 1 ? SB.copper : SB.cardBorder}`, fontFamily: "Georgia, serif" }}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-3" style={{ color: SB.inkMed, fontFamily: "Georgia, serif" }}>Language</p>
                    <select className="w-full px-4 py-2.5 rounded-sm text-sm outline-none"
                      style={{ background: "#fdf9f2", border: `1px solid ${SB.cardBorder}`, color: SB.ink, fontFamily: "Georgia, serif" }}>
                      <option>English (US)</option><option>Hindi</option><option>Gujarati</option>
                      <option>French</option><option>Spanish</option><option>German</option>
                    </select>
                  </div>
                  <div className="p-4 rounded-sm" style={{ background: "#f5edd8", border: `1px solid ${SB.cardBorder}` }}>
                    <p className="text-xs font-bold mb-2" style={{ color: SB.copper, fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" }}>PREVIEW</p>
                    <p className="text-sm font-medium" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>This is how your dashboard looks</p>
                    <p className="text-xs mt-1" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>Changes apply instantly across the entire dashboard.</p>
                    <div className="flex gap-2 mt-3">
                      <div className="h-2 flex-1 rounded-sm" style={{ background: SB.copper }} />
                      <div className="h-2 flex-1 rounded-sm" style={{ background: "#e8d8c0" }} />
                      <div className="h-2 flex-1 rounded-sm" style={{ background: "#e8d8c0" }} />
                    </div>
                  </div>
                </div>
              )}

              {activeSettings === "help" && (
                <div className="space-y-4">
                  <h3 className="mb-4" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Help & Support</h3>
                  {[{ icon: BookOpen, label: "Documentation", desc: "Learn how to use Traveloop", action: "Read Docs" }, { icon: Users, label: "Community Forum", desc: "Connect with other explorers", action: "Join Forum" }, { icon: Flag, label: "Report an Issue", desc: "Let us know if something's wrong", action: "Report" }].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-sm" style={{ background: "#f8f3e8", border: `1px solid ${SB.cardBorder}` }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: `${SB.copper}15`, border: `1px solid ${SB.copper}30` }}>
                          <item.icon className="w-4 h-4" style={{ color: SB.copper }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>{item.label}</p>
                          <p className="text-xs" style={{ color: SB.inkFaded, fontFamily: "'Caveat', cursive", fontSize: 13 }}>{item.desc}</p>
                        </div>
                      </div>
                      <button onClick={() => toast.info("Redirecting...")} className="px-3 py-1.5 rounded-sm text-xs transition-colors" style={{ border: `1px solid ${SB.copper}60`, color: SB.copper }}>{item.action}</button>
                    </div>
                  ))}
                  <div className="p-4 rounded-sm" style={{ background: WASHI[0], border: `1px solid ${SB.cardBorder}` }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: SB.ink, fontFamily: "Georgia, serif" }}>Still need help?</p>
                    <p className="text-xs mb-3" style={{ color: SB.inkMed, fontFamily: "'Caveat', cursive", fontSize: 14 }}>Our support team responds within 24 hours.</p>
                    <ScrapBtn onClick={() => toast.success("Support request sent!")}>Contact Support</ScrapBtn>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
