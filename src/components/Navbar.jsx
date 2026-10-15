import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Home, Info, PhoneCall, User, LogOut, Menu, X, ChevronDown, Sliders, Radio } from "lucide-react";

const Navbar = ({ username: usernameProp, onToggleSimulation, isSimulationActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMenuRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (usernameProp) {
      setUsername(usernameProp);
    } else if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [usernameProp]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutMenuRef.current && !logoutMenuRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    };
    if (showLogoutMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLogoutMenu]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    setShowLogoutMenu(false);
    navigate("/login");
  };

  const handleLogoSecretClick = () => {
    const count = logoClickCount + 1;
    setLogoClickCount(count);
    if (count >= 3) {
      setLogoClickCount(0);
      if (onToggleSimulation) {
        onToggleSimulation();
      }
    }
    setTimeout(() => setLogoClickCount(0), 1500);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-xs transition-all duration-300">
      <nav className="w-full md:w-[85%] mx-auto flex items-center justify-between py-3.5 sm:py-4 px-4 sm:px-6">
        
        {/* Brand Logo Section */}
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            onClick={handleLogoSecretClick}
            className="flex items-center gap-3 group select-none"
            title="Albedrozes Private Limited"
          >
            <img
              src="/images/header.png"
              alt="Albedrozes Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#001A70] leading-none mb-0.5">
                Albedrozes
              </span>
              <span className="text-[10px] font-extrabold text-[#1E88E5] tracking-widest uppercase">
                PRIVATE LIMITED
              </span>
            </div>
          </Link>

          {/* Discreet Operator Status Badge if Simulation is actively toggled */}
          {isSimulationActive && (
            <span 
              onClick={onToggleSimulation}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 cursor-pointer animate-pulse"
              title="Simulation Active: Click to Stop and return to real Raspberry Pi sensors"
            >
              <Radio className="w-3 h-3 text-amber-500" />
              <span>SIMULATING SENSORS (CLICK TO STOP)</span>
            </span>
          )}
        </div>

        {/* Desktop Enterprise Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200">
            <Link
              to={username ? "/home" : "/start"}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-200 ${
                isActive("/home") || isActive("/start") || isActive("/")
                  ? "bg-white text-[#001A70] shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#1E88E5]" />
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-200 ${
                isActive("/about")
                  ? "bg-white text-[#001A70] shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Info className="w-3.5 h-3.5 text-[#1E88E5]" />
              <span>About</span>
            </Link>

            <Link
              to="/contact"
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-200 ${
                isActive("/contact")
                  ? "bg-white text-[#001A70] shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#1E88E5]" />
              <span>Contact</span>
            </Link>
          </div>

          {/* User Account / Profile */}
          {username ? (
            <div className="relative" ref={logoutMenuRef}>
              <button
                onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                className="flex items-center gap-2.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-slate-800 shadow-xs hover:border-[#1E88E5] transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#001A70] to-[#1E88E5] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate text-slate-900">{username}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showLogoutMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in Operator</p>
                    <p className="text-xs font-extrabold text-slate-800 truncate">{username}</p>
                  </div>

                  {/* Secret / Dedicated Operator Simulation Toggle in Dropdown */}
                  {onToggleSimulation && (
                    <button
                      onClick={() => {
                        onToggleSimulation();
                        setShowLogoutMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5 text-[#1E88E5]" />
                        <span>Random Demo Mode</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isSimulationActive ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"
                      }`}>
                        {isSimulationActive ? "ACTIVE" : "OFF"}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs font-extrabold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#001A70] to-[#1E88E5] hover:from-[#00124D] hover:to-[#1565C0] text-white text-xs font-extrabold shadow-md shadow-[#001A70]/20 hover:shadow-lg transition-all duration-200"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6 text-[#001A70]" /> : <Menu className="w-6 h-6 text-slate-700" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 px-6 py-4 space-y-3">
          <Link
            to={username ? "/home" : "/start"}
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-800 hover:text-[#001A70]"
          >
            <Home className="w-4 h-4 text-[#1E88E5]" />
            <span>Home</span>
          </Link>
          <Link
            to="/about"
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-800 hover:text-[#001A70]"
          >
            <Info className="w-4 h-4 text-[#1E88E5]" />
            <span>About</span>
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-800 hover:text-[#001A70]"
          >
            <PhoneCall className="w-4 h-4 text-[#1E88E5]" />
            <span>Contact</span>
          </Link>

          {username ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="px-3 text-xs font-bold text-slate-500">Operator: {username}</div>
              {onToggleSimulation && (
                <button
                  onClick={() => {
                    onToggleSimulation();
                    closeMenu();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between"
                >
                  <span>Simulation Toggle</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 rounded">
                    {isSimulationActive ? "ON" : "OFF"}
                  </span>
                </button>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#001A70] to-[#1E88E5] text-white text-xs font-extrabold"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
