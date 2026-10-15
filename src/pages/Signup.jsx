import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, UserPlus, ArrowLeft, User } from "lucide-react";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (email && password) {
      const formattedUsername = name.trim() || email.split("@")[0];
      localStorage.setItem("username", formattedUsername);
      navigate("/home");
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-[95%] sm:w-[70%] max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 space-y-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#001A70] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#1E88E5]" />
            <span>Back to Sign In</span>
          </Link>

          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <img
                src="/images/header.png"
                alt="Albedrozes Logo"
                className="h-16 w-auto object-contain transition-transform hover:scale-105"
              />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Operator Account</h1>
            <p className="text-xs text-slate-500 font-semibold">Join the Albedrozes Autonomous Rover Network</p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white transition-all"
                  placeholder="Operator Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Corporate Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white transition-all"
                  placeholder="operator@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#001A70] to-[#1E88E5] hover:from-[#00124D] hover:to-[#1565C0] text-white text-sm font-extrabold shadow-md shadow-[#001A70]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Account</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs text-[#1E88E5] hover:text-[#001A70] font-bold">
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
