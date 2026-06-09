import { useState } from "react";
import api from "../api";
import { User, Lock, ShoppingCart, ArrowRight, Sparkles, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ UserName: "", Password: "", ConfirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 4) strength++;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setForm({ ...form, Password: newPassword });
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.UserName.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }
    if (form.Password.length < 4) {
      setError("Password must be at least 4 characters");
      setLoading(false);
      return;
    }
    if (form.Password !== form.ConfirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", { UserName: form.UserName, Password: form.Password });
      alert("Account created! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4'];
    return colors[passwordStrength - 1] || '#6b7280';
  };

  const getStrengthText = () => {
    const texts = ['Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength - 1] || 'Very Weak';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-[100px] opacity-20 animate-pulse delay-1000"></div>
      
      <div className="relative w-full max-w-md px-4 z-10">
        <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
          
          <div className="relative h-32 bg-gradient-to-r from-emerald-600 to-teal-600">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl">
                <ShoppingCart className="text-white" size={40} />
              </div>
            </div>
          </div>

          <div className="p-8 pt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Create Account</h2>
              <p className="text-white/60 mt-2 text-sm">Join SRMS today</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Sparkles size={12} className="text-emerald-400" />
                <p className="text-white/40 text-xs">Start managing your sales</p>
                <Sparkles size={12} className="text-emerald-400" />
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/20 border-l-4 border-red-500 p-4 rounded-xl animate-shake">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <div className={`relative transition-all duration-300 ${focused === 'username' ? 'transform scale-[1.02]' : ''}`}>
                  <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focused === 'username' ? 'text-emerald-400' : 'text-white/40'}`} size={18} />
                  <input
                    type="text"
                    placeholder="Username (min. 3 chars)"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-emerald-500 transition-all duration-300"
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
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focused === 'password' ? 'text-emerald-400' : 'text-white/40'}`} size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (min. 4 chars)"
                    className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-emerald-500 transition-all duration-300"
                    value={form.Password}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.Password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-white/20'}`} />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: getStrengthColor() }}>Strength: {getStrengthText()}</p>
                  </div>
                )}
              </div>

              <div>
                <div className={`relative transition-all duration-300 ${focused === 'confirm' ? 'transform scale-[1.02]' : ''}`}>
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focused === 'confirm' ? 'text-emerald-400' : 'text-white/40'}`} size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-emerald-500 transition-all duration-300"
                    value={form.ConfirmPassword}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setForm({ ...form, ConfirmPassword: e.target.value })}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.ConfirmPassword && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${form.Password === form.ConfirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                    {form.Password === form.ConfirmPassword ? <><CheckCircle size={12} /> Passwords match</> : <><XCircle size={12} /> Passwords do not match</>}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Creating account...</> : <><span>Register</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">Already have an account? <Link className="text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center gap-1 group" to="/">Login here <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></Link></p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs text-center">By registering, you agree to our Terms of Service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}