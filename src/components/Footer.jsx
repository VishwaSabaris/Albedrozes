import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Send, Droplet } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Hardware Specs", path: "/start" },
        { label: "Autonomous Rover", path: "/start" },
        { label: "Water Metrics", path: "/about" },
        { label: "Live Telemetry", path: "/login" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Founders & Team", path: "/about" },
        { label: "Mission & Tech", path: "/about" },
        { label: "Contact Us", path: "/contact" },
      ]
    },
    {
      title: "Enterprise",
      links: [
        { label: "Operator Portal", path: "/login" },
        { label: "API Reference", path: "/about" },
        { label: "Raspberry Pi Node", path: "/start" },
        { label: "Compliance & CIN", path: "/about" },
      ]
    }
  ];

  const socialLinks = [
    { icon: FaFacebookF, label: "Facebook", url: "#" },
    { icon: FaXTwitter, label: "Twitter", url: "#" },
    { icon: FaLinkedinIn, label: "LinkedIn", url: "#" },
    { icon: FaYoutube, label: "YouTube", url: "#" }
  ];

  return (
    <footer className="relative w-full mt-20 pb-12">
      <div className="w-[96%] md:w-[75%] mx-auto bg-white text-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-md space-y-12">
        
        {/* Top Newsletter Row */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Stay Connected with Albedrozes</h3>
              <Droplet className="w-4 h-4 text-[#1E88E5]" />
            </div>
            <p className="text-xs font-bold text-slate-500">Subscribe for autonomous robotics updates & aquatic conservation field notes.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! You have subscribed to Albedrozes updates."); }} className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <input
                type="email"
                required
                placeholder="Enter corporate email"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#001A70] to-[#1E88E5] hover:from-[#00124D] hover:to-[#1565C0] flex items-center gap-2 shadow-md shadow-[#001A70]/20 hover:shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/images/header.png"
                alt="Albedrozes Logo"
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-[#001A70] leading-tight">
                  Albedrozes
                </span>
                <span className="text-[10px] font-extrabold text-[#1E88E5] tracking-widest uppercase">
                  PRIVATE LIMITED
                </span>
              </div>
            </Link>
            
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              Designing weightless, autonomous robotic vessels to clean aquatic environments, manage floating debris, and stream environmental telemetry in real time.
            </p>

            <div className="flex gap-2.5 pt-1">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-[#001A70] text-slate-600 hover:text-white flex items-center justify-center border border-slate-200 transition-all duration-200 shadow-xs"
                  >
                    <IconComponent className="text-sm" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links columns */}
          {footerLinks.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.path}
                      className="text-xs text-slate-500 hover:text-[#001A70] font-semibold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
          <div>
            © {currentYear} Albedrozes Private Limited (CIN: U62013TZ2026PTC038703). All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-600">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-600">Terms of Deployment</Link>
            <Link to="/contact" className="hover:text-slate-600">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
