import { useState } from "react";
import api from "../api";
import { User, Lock, ShoppingCart, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ UserName: "", Password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", {
        UserName: form.UserName,
        Password: form.Password
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full blur-[100px] opacity-10 animate-pulse delay-2000"></div>
      
      <div className="relative w-full max-w-md px-4 z-10">
        <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
          
          {/* Decorative Header */}
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-xl">
                <ShoppingCart className="text-white" size={40} />
              </div>
            </div>
          </div>

          <div className="p-8 pt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-white/60 mt-2 text-sm">Sales Records Management System</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Sparkles size={12} className="text-purple-400" />
                <p className="text-white/40 text-xs">DAB Enterprise LTD</p>
                <Sparkles size={12} className="text-purple-400" />
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/20 border-l-4 border-red-500 p-4 rounded-xl animate-shake">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <div className={`relative transition-all duration-300 ${focused === 'username' ? 'transform scale-[1.02]' : ''}`}>
                  <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focused === 'username' ? 'text-indigo-400' : 'text-white/40'}`} size={18} />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-indigo-500 transition-all duration-300"
                    value={form.UserName}
                    onFocus={() => setFocused('username')}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setForm({ ...form, UserName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className={`relative transition-all duration-300 ${focused === 'password' ? 'transform scale-[1.02]' : ''}`}>
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focused === 'password' ? 'text-indigo-400' : 'text-white/40'}`} size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-indigo-500 transition-all duration-300"
                    value={form.Password}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setForm({ ...form, Password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <Link className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors inline-flex items-center gap-1 group" to="/register">
                  Register here
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs text-center mb-2">Demo Credentials</p>
                <div className="flex justify-center gap-6 text-xs">
                  <div className="text-white/60">
                    <span className="text-indigo-400">Username:</span> admin
                  </div>
                  <div className="text-white/60">
                    <span className="text-indigo-400">Password:</span> admin123
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}