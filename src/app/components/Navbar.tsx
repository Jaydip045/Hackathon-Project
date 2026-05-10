import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Menu, X, Plane, ChevronDown, Bell, Search,
  LogOut, Settings, User, Compass, Globe, Users, BookOpen,
  Heart, Award
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  {
    label: "Destinations",
    path: "#destinations",
    children: [
      { label: "🏰 Europe", path: "#europe", desc: "Art, culture & history" },
      { label: "🌸 Asia", path: "#asia", desc: "Ancient wonders & food" },
      { label: "🗽 Americas", path: "#americas", desc: "Adventure & nature" },
      { label: "🦁 Africa", path: "#africa", desc: "Wildlife & safaris" },
    ],
  },
  { label: "Community", path: "#community" },
  { label: "About", path: "#about" },
];

export function Navbar() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuth();

  const isDashboard = location.pathname === "/dashboard";
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDashboard) setVisible(true);
  }, [isDashboard]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-navbar]")) {
        setProfileOpen(false);
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showNav = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setVisible(true);
  };

  const scheduleHide = () => {
    if (isDashboard) return;
    hideTimer.current = setTimeout(() => {
      if (!mobileOpen) setVisible(false);
    }, 400);
  };

  const handleNavLink = (path: string) => {
    if (path.startsWith("#")) {
      if (location.pathname !== "/") navigate("/");
      setTimeout(() => {
        const el = document.querySelector(path);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      navigate(path);
    }
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileOpen(false);
  };

  if (isAuthPage) return null;

  return (
    <>
      {/* Hover trigger strip */}
      {!isDashboard && (
        <div
          className="fixed top-0 left-0 right-0 h-3 z-50"
          onMouseEnter={showNav}
        />
      )}

      <AnimatePresence>
        {(visible || isDashboard) && (
          <motion.header
            data-navbar
            initial={isDashboard ? false : { y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -72, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={showNav}
            onMouseLeave={scheduleHide}
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
              scrolled || isDashboard
                ? "bg-white shadow-[0_1px_20px_rgba(0,0,0,0.08)] border-b border-gray-100"
                : "bg-white/95 backdrop-blur-md shadow-sm"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center h-[60px] gap-4">

                {/* ─── Logo ─── */}
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2.5 flex-shrink-0 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span
                    className="text-[19px] font-bold text-gray-900 tracking-tight hidden sm:block"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Traveloop
                  </span>
                </button>

                {/* ─── Center Nav Links (Desktop) ─── */}
                <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
                  {navLinks.map((link) =>
                    link.children ? (
                      <div
                        key={link.label}
                        className="relative"
                        onMouseEnter={() => setOpenDropdown(link.label)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all font-medium">
                          {link.label}
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                              openDropdown === link.label ? "rotate-180 text-amber-500" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === link.label && (
                            <motion.div
                              initial={{ opacity: 0, y: 6, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.97 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                            >
                              {link.children.map((child) => (
                                <button
                                  key={child.label}
                                  onClick={() => handleNavLink(child.path)}
                                  className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-amber-50 transition-colors text-left group/item"
                                >
                                  <div>
                                    <p className="text-sm text-gray-800 font-medium group-hover/item:text-amber-700">
                                      {child.label}
                                    </p>
                                    {child.desc && (
                                      <p className="text-xs text-gray-400 mt-0.5">{child.desc}</p>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <button
                        key={link.label}
                        onClick={() => handleNavLink(link.path)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          location.pathname === link.path
                            ? "text-amber-600 bg-amber-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {link.label}
                      </button>
                    )
                  )}
                </nav>

                {/* ─── Right Side ─── */}
                <div className="flex items-center gap-2 ml-auto flex-shrink-0">

                  {/* Search icon */}
                  <div className="relative">
                    <button
                      onClick={() => setSearchOpen(!searchOpen)}
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {searchOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: 20 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50"
                        >
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                              autoFocus
                              placeholder="Search destinations..."
                              className="bg-transparent outline-none text-sm flex-1 text-gray-800 placeholder-gray-400"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  navigate("/signup");
                                  setSearchOpen(false);
                                }
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {isLoggedIn ? (
                    <>
                      {/* Notifications */}
                      <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      </button>

                      {/* Profile Avatar + Dropdown */}
                      <div className="relative" data-navbar>
                        <button
                          onClick={() => setProfileOpen(!profileOpen)}
                          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all bg-white"
                        >
                          <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user?.initials || "U"}
                          </div>
                          <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[80px] truncate">
                            {user?.name?.split(" ")[0] || "User"}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block ${
                              profileOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {profileOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 6 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                            >
                              {/* Profile header */}
                              <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {user?.initials || "U"}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-gray-900 font-semibold text-sm truncate">{user?.name}</p>
                                    <p className="text-amber-600 text-xs">Explorer Level {user?.level || 1}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Menu items */}
                              <div className="py-1">
                                {[
                                  { icon: User, label: "My Profile", action: () => { navigate("/dashboard"); setProfileOpen(false); } },
                                  { icon: Compass, label: "Dashboard", action: () => { navigate("/dashboard"); setProfileOpen(false); } },
                                  { icon: Heart, label: "Saved Trips", action: () => { navigate("/dashboard"); setProfileOpen(false); } },
                                  { icon: Award, label: "My Stamps", action: () => { navigate("/dashboard"); setProfileOpen(false); } },
                                ].map((item) => (
                                  <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                                  >
                                    <item.icon className="w-4 h-4 text-gray-400" />
                                    {item.label}
                                  </button>
                                ))}
                              </div>

                              <div className="border-t border-gray-100 py-1">
                                <button
                                  onClick={handleLogout}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <LogOut className="w-4 h-4" />
                                  Sign Out
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/login")}
                        className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => navigate("/signup")}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                      >
                        <Plane className="w-3.5 h-3.5" />
                        <span className="hidden sm:block">Get Started</span>
                        <span className="sm:hidden">Join</span>
                      </button>
                    </>
                  )}

                  {/* Mobile hamburger */}
                  <button
                    className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={() => { setMobileOpen(!mobileOpen); showNav(); }}
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── Mobile Menu ─── */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden overflow-hidden border-t border-gray-100 bg-white"
                >
                  <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
                    {navLinks.map((link) => (
                      <div key={link.label}>
                        <button
                          onClick={() => handleNavLink(link.path)}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors font-medium text-sm"
                        >
                          {link.label}
                        </button>
                        {link.children && (
                          <div className="ml-4 mt-1 space-y-0.5 mb-1">
                            {link.children.map((child) => (
                              <button
                                key={child.label}
                                onClick={() => handleNavLink(child.path)}
                                className="w-full text-left px-3 py-2 rounded-lg text-gray-500 hover:bg-amber-50 hover:text-amber-600 transition-colors text-sm"
                              >
                                {child.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      {isLoggedIn ? (
                        <>
                          <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user?.initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                              <p className="text-xs text-amber-600">Level {user?.level} Explorer</p>
                            </div>
                          </div>
                          <button
                            onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}
                            className="w-full px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Compass className="w-4 h-4" /> Go to Dashboard
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 text-red-500 border border-red-200 rounded-xl text-sm flex items-center justify-center gap-2"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { navigate("/login"); setMobileOpen(false); }}
                            className="w-full px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium"
                          >
                            Sign In
                          </button>
                          <button
                            onClick={() => { navigate("/signup"); setMobileOpen(false); }}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Plane className="w-4 h-4" /> Get Started Free
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Hover hint when navbar is hidden */}
      {!visible && !isDashboard && !isAuthPage && (
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
          onMouseEnter={showNav}
        >
          <div className="mt-0.5 px-4 py-1.5 bg-gray-900/60 backdrop-blur-sm rounded-b-xl text-white/80 text-xs flex items-center gap-1.5 hover:bg-gray-900/80 transition-colors">
            <Menu className="w-3 h-3" />
            Hover to show menu
          </div>
        </div>
      )}
    </>
  );
}
