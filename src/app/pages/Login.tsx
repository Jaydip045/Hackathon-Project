import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, MapPin, Plane, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const doLogin = (name: string, email: string, provider = "email") => {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    login({ name, email, initials, level: 12, provider });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    const name = form.email.split("@")[0].replace(/[^a-zA-Z ]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    doLogin(name, form.email);
    toast.success("Welcome back, Explorer! 🌍");
    navigate("/dashboard");
  };

  const handleSocial = async (provider: string) => {
    setSocialLoading(provider);
    await new Promise(r => setTimeout(r, 1600));
    setSocialLoading(null);
    const mockUsers: Record<string, { name: string; email: string }> = {
      Google: { name: "Khushi Patel", email: "khushipatel@gmail.com" },
      Facebook: { name: "Khushi Patel", email: "khushipatel@facebook.com" },
    };
    const u = mockUsers[provider];
    doLogin(u.name, u.email, provider);
    toast.success(`Signed in with ${provider}! ✈️`, { description: "Welcome to Traveloop!" });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1584212882409-aef913bb81ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/75 via-gray-900/55 to-amber-900/40" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 w-fit">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>Traveloop</span>
          </button>
          <div>
            <p className="text-amber-300 text-sm mb-3 uppercase tracking-widest">Explorer's Quote</p>
            <blockquote className="text-white text-2xl mb-5" style={{ fontFamily: "Georgia, serif", lineHeight: 1.5 }}>
              "The world is a book, and those who do not travel read only one page."
            </blockquote>
            <p className="text-gray-400 text-sm">— Saint Augustine</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {["🗼 Paris", "🏝️ Bali", "🗻 Swiss Alps", "🎭 Venice", "🏛️ Rome"].map(d => (
                <span key={d} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-5 sm:px-10 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[420px]"
        >
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-400 hover:text-amber-600 transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "Georgia, serif" }}>Traveloop</span>
          </div>

          <h1 className="text-gray-900 mb-1" style={{ fontFamily: "Georgia, serif" }}>Sign in to your account</h1>
          <p className="text-gray-500 text-sm mb-8">
            New here?{" "}
            <button onClick={() => navigate("/signup")} className="text-amber-600 hover:text-amber-700 font-medium">
              Create a free account
            </button>
          </p>

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocial("Google")}
              disabled={!!socialLoading}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all disabled:opacity-60 group"
            >
              {socialLoading === "Google" ? (
                <div className="w-5 h-5 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
              ) : <GoogleIcon />}
              <span className="text-sm font-medium text-gray-700 flex-1 text-left group-hover:text-gray-900">
                {socialLoading === "Google" ? "Signing in with Google..." : "Continue with Google"}
              </span>
            </button>

            <button
              onClick={() => handleSocial("Facebook")}
              disabled={!!socialLoading}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm transition-all disabled:opacity-60 group"
            >
              {socialLoading === "Facebook" ? (
                <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              ) : <FacebookIcon />}
              <span className="text-sm font-medium text-gray-700 flex-1 text-left group-hover:text-blue-700">
                {socialLoading === "Facebook" ? "Signing in with Facebook..." : "Continue with Facebook"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 whitespace-nowrap">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none bg-gray-50 focus:bg-white transition-all ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-gray-700">Password</label>
                <button type="button" className="text-xs text-amber-600 hover:text-amber-700">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); if (errors.password) setErrors({ ...errors, password: "" }); }}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm outline-none bg-gray-50 focus:bg-white transition-all ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="rem" className="w-4 h-4 accent-amber-500 rounded" />
              <label htmlFor="rem" className="text-sm text-gray-500">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><Plane className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-amber-700 text-xs leading-relaxed">
              <span className="font-semibold">Demo mode:</span> Use any email or click Google/Facebook to instantly access the dashboard.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
