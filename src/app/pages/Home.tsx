import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Plane, Star, Users, Globe, Calendar, Camera,
  TrendingUp, Heart, ArrowRight, ChevronDown, Search,
  Award, Map, Compass
} from "lucide-react";

const heroImages = [
  "https://images.unsplash.com/photo-1673505413397-0cd0dc4f5854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzgyMjI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1497339047006-39f2b26f005d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW50b3JpbmklMjBHcmVlY2UlMjB3aGl0ZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NzgzODg5MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1560462063-c724abddaf9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFdXJvcGVhbiUyMGNpdHklMjB0cmF2ZWwlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4MzkwMjgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
];

const destinations = [
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1595441857632-71570ef36580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMEVpZmZlbCUyMFRvd2VyJTIwdHJhdmVsfGVufDF8fHx8MTc3ODM4ODkyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    trips: "12.4K",
    tag: "Trending",
  },
  {
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1497339047006-39f2b26f005d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW50b3JpbmklMjBHcmVlY2UlMjB3aGl0ZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NzgzODg5MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    trips: "8.7K",
    tag: "Romantic",
  },
  {
    name: "Venice, Italy",
    image: "https://images.unsplash.com/photo-1653670477141-0a91c4f09408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWZW5pY2UlMjBJdGFseSUyMGNhbmFsJTIwZ29uZG9sYXxlbnwxfHx8fDE3NzgzODg5MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    trips: "6.2K",
    tag: "Cultural",
  },
  {
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1581665334521-ac9a6f6b4be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYWxpJTIwSW5kb25lc2lhJTIwdGVtcGxlJTIwdHJhdmVsfGVufDF8fHx8MTc3ODM5MDI3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    trips: "15.1K",
    tag: "Adventure",
  },
];

const features = [
  {
    icon: Map,
    title: "Itinerary Builder",
    desc: "Craft perfect day-by-day trip plans with our intuitive drag-and-drop builder.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "Budget Analytics",
    desc: "Track spending in real-time. Never go over budget with smart alerts and insights.",
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-50",
  },
  {
    icon: Camera,
    title: "Memory Journal",
    desc: "Capture and organize your travel memories with photos, notes, and stamps.",
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-50",
  },
  {
    icon: Users,
    title: "Travel Community",
    desc: "Share itineraries, discover hidden gems, and connect with fellow explorers.",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
  },
  {
    icon: Globe,
    title: "Global Destinations",
    desc: "Explore curated content for 190+ countries with local tips and recommendations.",
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
  },
  {
    icon: Award,
    title: "Explorer Passport",
    desc: "Earn stamps for every destination. Level up your explorer profile and rank.",
    color: "from-amber-500 to-yellow-500",
    bg: "bg-amber-50",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "World Explorer · Level 15",
    avatar: "SM",
    text: "Traveloop completely transformed how I plan trips. The itinerary builder saved me hours of research!",
    rating: 5,
    trips: 34,
  },
  {
    name: "James Chen",
    role: "Adventure Traveler · Level 9",
    avatar: "JC",
    text: "The budget tracker is a game-changer. I can finally enjoy trips without financial stress.",
    rating: 5,
    trips: 18,
  },
  {
    name: "Priya Sharma",
    role: "Cultural Explorer · Level 22",
    avatar: "PS",
    text: "The community features are amazing. I've connected with travelers worldwide and discovered hidden gems.",
    rating: 5,
    trips: 67,
  },
];

const stats = [
  { label: "Happy Travelers", value: "2M+", icon: Users },
  { label: "Destinations", value: "190+", icon: Globe },
  { label: "Trips Planned", value: "5M+", icon: Calendar },
  { label: "Countries Covered", value: "195", icon: Compass },
];

export function Home() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={heroImages[heroIndex]}
              alt="Travel destination"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full text-amber-300 text-sm mb-6"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              Trusted by 2M+ explorers worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white mb-4"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontFamily: "Georgia, serif", lineHeight: 1.15 }}
            >
              Plan Stories,<br />
              <span className="text-amber-400">Not Just Trips.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-200 text-lg mb-8 max-w-lg"
            >
              Turn every destination into a living memory. Build itineraries, track budgets, and share your journey with the world.
            </motion.p>

            {/* Search bar */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSearch}
              className="flex gap-2 mb-8 max-w-lg"
            >
              <div className="flex-1 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search destinations, trips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-amber-500/25 font-medium"
              >
                Explore
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Plane className="w-4 h-4" />
                Start Your Journey
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Trusted avatars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 mt-8"
            >
              <div className="flex -space-x-2">
                {["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: color }}
                  >
                    {["JC", "SM", "PS", "AM", "RK"][i]}
                  </div>
                ))}
              </div>
              <span className="text-gray-300 text-sm">
                <span className="text-white font-semibold">+2K</span> explorers joined this week
              </span>
            </motion.div>
          </div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? "bg-amber-400 w-8" : "bg-white/50 w-4"}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 right-8 z-10 text-white/60"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm mb-4">
              Top Destinations
            </span>
            <h2 className="text-gray-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Where Will You Go Next?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the world's most breathtaking destinations, curated by our community of passionate explorers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                <div className="relative h-72">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Tag */}
                  <span className="absolute top-4 left-4 px-2 py-1 bg-amber-500 text-white text-xs rounded-md font-medium">
                    {dest.tag}
                  </span>

                  {/* Heart */}
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                    <Heart className="w-4 h-4 text-white" />
                  </button>

                  {/* Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>
                      {dest.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-amber-300 text-sm">{dest.rating}</span>
                      </div>
                      <span className="text-gray-300 text-sm">{dest.trips} trips</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-amber-500 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all font-medium"
            >
              View All Destinations
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm mb-4">
              Everything You Need
            </span>
            <h2 className="text-gray-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Plan Better. Travel Smarter.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From dream to destination — Traveloop gives you all the tools to craft unforgettable journeys.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-amber-100 group"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`w-6 h-6 bg-gradient-to-br ${feature.color} rounded-md flex items-center justify-center`}>
                    <feature.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm mb-4">
              Simple Process
            </span>
            <h2 className="text-gray-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Start in 3 Easy Steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-amber-200 to-orange-200" />

            {[
              { step: "01", title: "Create Account", desc: "Sign up for free and set up your explorer profile in under a minute.", icon: Users },
              { step: "02", title: "Pick Destination", desc: "Browse 190+ destinations or search for your dream location.", icon: MapPin },
              { step: "03", title: "Plan & Go!", desc: "Build your itinerary, track budget, and share your adventure.", icon: Plane },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-200 relative z-10">
                  <step.icon className="w-8 h-8 text-amber-600" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="community" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm mb-4">
              Traveler Stories
            </span>
            <h2 className="text-gray-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
              What Our Explorers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-amber-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-amber-600 font-bold text-sm">{t.trips}</div>
                    <div className="text-gray-400 text-xs">trips</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1619467416348-6a782839e95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBwYXNzcG9ydCUyMG1hcCUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NzgzOTAyODF8MA&ixlib=rb-4.1.0&q=80&w=1080)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full text-sm mb-6">
              🌍 Join 2M+ Travelers
            </span>
            <h2 className="text-white mb-6" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              Your Next Adventure<br />Starts Here
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Create your free account today and begin planning the trip of a lifetime. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl hover:shadow-amber-500/25 flex items-center justify-center gap-2 font-medium"
              >
                <Plane className="w-5 h-5" />
                Start Planning for Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Sign In to Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-xl" style={{ fontFamily: "Georgia, serif" }}>Traveloop</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Plan Beautiful Journeys. Craft your perfect itinerary.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Destinations", "Community", "Pricing"] },
              { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-amber-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
            <p className="text-sm">© 2026 Traveloop. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              {["🗺️ Plan", "📸 Track", "✈️ Travel Together", "💝 Relive"].map((item) => (
                <span key={item} className="text-xs">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
