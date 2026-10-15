import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      const extractedUsername = email.split("@")[0];
      const formattedUsername =
        extractedUsername.charAt(0).toUpperCase() + extractedUsername.slice(1);
      
      localStorage.setItem("username", formattedUsername);
      navigate("/home");
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-[95%] sm:w-[70%] max-w-md mx-auto">
        
        {/* Floating Corporate Sign-in Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 space-y-6">
          
          <Link
            to="/start"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#001A70] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#1E88E5]" />
            <span>Back to Overview</span>
          </Link>

          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <img
                src="/images/header.png"
                alt="Albedrozes Logo"
                className="h-16 w-auto object-contain transition-transform hover:scale-105"
              />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Operator Sign In</h1>
            <p className="text-xs text-slate-500 font-semibold">Sign in to control Albedrozes Autonomous Surface Rovers</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Corporate Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white transition-all"
                  placeholder="operator@albedrozes.com"
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
              <LogIn className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400 font-semibold">
              Authorized Operator: <strong className="text-slate-700">operator@albedrozes.com</strong>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Login;
