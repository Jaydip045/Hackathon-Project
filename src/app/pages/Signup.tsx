import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, User, MapPin, Plane, AlertCircle, CheckCircle, ArrowLeft, Check } from "lucide-react";
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

function passwordStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const strength = passwordStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  const update = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.email) e.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.password) e.password = "Password required";
    else if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    if (!agreed) e.terms = "Please agree to terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const doLogin = (name: string, email: string, provider = "email") => {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    login({ name, email, initials, level: 1, provider });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    doLogin(form.name, form.email);
    toast.success("Welcome to Traveloop! ✈️", { description: "Your explorer account is ready!" });
    navigate("/dashboard");
  };

  const handleSocial = async (provider: string) => {
    setSocialLoading(provider);
    await new Promise(r => setTimeout(r, 1500));
    setSocialLoading(null);
    const users: Record<string, { name: string; email: string }> = {
      Google: { name: "Alex Johnson", email: "alex.johnson@gmail.com" },
      Facebook: { name: "Sam Williams", email: "sam.williams@fb.com" },
    };
    const u = users[provider];
    doLogin(u.name, u.email, provider);
    toast.success(`Account created with ${provider}! 🌍`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1774787474172-289b52895472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          alt="Iceland"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/60 to-amber-900/30" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 w-fit">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>Traveloop</span>
          </button>
          <div>
            <h2 className="text-white text-3xl mb-6" style={{ fontFamily: "Georgia, serif", lineHeight: 1.3 }}>
              Join 2 Million<br /><span className="text-amber-400">Global Explorers</span>
            </h2>
            <div className="space-y-3 mb-8">
              {["Free itinerary builder for unlimited trips", "Smart budget tracking & analytics", "Explorer passport & achievement stamps", "Global travel community"].map(b => (
                <div key={b} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-200 text-sm">{b}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  {["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                      {["A", "B", "C", "D"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-white text-sm font-medium">+2.1K joined this week</span>
              </div>
              <p className="text-gray-300 text-xs">Free forever · No credit card · Cancel anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-start justify-center bg-white px-5 sm:px-10 py-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[420px] py-4"
        >
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-400 hover:text-amber-600 transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>

          <div className="lg:hidden flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "Georgia, serif" }}>Traveloop</span>
          </div>

          <h1 className="text-gray-900 mb-1" style={{ fontFamily: "Georgia, serif" }}>Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">
            Already a member?{" "}
            <button onClick={() => navigate("/login")} className="text-amber-600 hover:text-amber-700 font-medium">Sign in</button>
          </p>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { name: "Google", Icon: GoogleIcon, hover: "hover:bg-gray-50 hover:border-gray-300" },
              { name: "Facebook", Icon: FacebookIcon, hover: "hover:bg-blue-50 hover:border-blue-200" },
            ].map(({ name, Icon, hover }) => (
              <button
                key={name}
                onClick={() => handleSocial(name)}
                disabled={!!socialLoading}
                className={`flex items-center justify-center gap-2.5 py-3 border border-gray-200 rounded-xl ${hover} transition-all disabled:opacity-60 text-sm font-medium text-gray-700`}
              >
                {socialLoading === name ? (
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
                ) : <Icon />}
                {name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or create with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Your full name" value={form.name}
                  onChange={e => update("name", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none bg-gray-50 focus:bg-white transition-all ${errors.name ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"}`} />
              </div>
              {errors.name && <p className="mt-1 text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => update("email", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none bg-gray-50 focus:bg-white transition-all ${errors.email ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"}`} />
              </div>
              {errors.email && <p className="mt-1 text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password}
                  onChange={e => update("password", e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm outline-none bg-gray-50 focus:bg-white transition-all ${errors.password ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"}`} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-gray-200"}`} />)}
                  </div>
                  <p className="text-xs text-gray-400">Strength: <span className={`font-medium ${strength >= 3 ? "text-green-600" : strength === 2 ? "text-yellow-600" : "text-red-600"}`}>{strengthLabel}</span></p>
                </div>
              )}
              {errors.password && <p className="mt-1 text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showCf ? "text" : "password"} placeholder="Repeat password" value={form.confirm}
                  onChange={e => update("confirm", e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm outline-none bg-gray-50 focus:bg-white transition-all ${errors.confirm ? "border-red-300 focus:ring-2 focus:ring-red-100" : form.confirm && form.password === form.confirm ? "border-green-300 focus:ring-2 focus:ring-green-100" : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"}`} />
                <button type="button" onClick={() => setShowCf(!showCf)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <p className="mt-1 text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirm}</p>}
              {form.confirm && form.password === form.confirm && (
                <p className="mt-1 text-green-600 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" />Passwords match</p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => { setAgreed(e.target.checked); if (errors.terms) setErrors(er => ({ ...er, terms: "" })); }}
                  className="w-4 h-4 mt-0.5 accent-amber-500 rounded flex-shrink-0"
                />
                <span className="text-sm text-gray-500">
                  I agree to Traveloop's{" "}
                  <span className="text-amber-600 hover:text-amber-700 cursor-pointer">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-amber-600 hover:text-amber-700 cursor-pointer">Privacy Policy</span>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : (
                <><Plane className="w-4 h-4" /> Create Account</>
              )}
            </button>
          </form>

          <div className="mt-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-amber-700 text-xs leading-relaxed">
              <span className="font-semibold">Demo mode:</span> Fill in any details or use Google/Facebook to instantly create an account and explore the dashboard.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
