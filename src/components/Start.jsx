import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bot, Compass, ShieldCheck, Cpu, Waves, Sparkles, Eye, CheckCircle2, Layers } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Start = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const productPhotos = [
    {
      url: "/images/rover1.jpeg",
      title: "Archimedes Screw Twin-Hull Vessel",
      subtitle: "Anti-clogging propulsion system with onboard Raspberry Pi & sensor enclosure",
      tag: "Propulsion & Control"
    },
    {
      url: "/images/rover2.jpeg",
      title: "High-Capacity Surface Debris Collection Hopper",
      subtitle: "Wide-mouth green mesh catchment system for microplastics and floating waste",
      tag: "Debris Collection"
    }
  ];

  const productFeatures = [
    {
      icon: Waves,
      title: "Archimedes Screw Propulsion",
      desc: "Twin helical screw drive delivers high-torque thrust across weed-infested waters without propeller tangling or debris stalling.",
      highlight: "Tangle-Free Drive"
    },
    {
      icon: Bot,
      title: "Autonomous MAVLink Navigation",
      desc: "Pixhawk / ArduPilot integration with autonomous GPS waypoint navigation, real-time heading orientation, and fail-safe return-to-base.",
      highlight: "Autonomous Waypoints"
    },
    {
      icon: Cpu,
      title: "Raspberry Pi Edge Intelligence",
      desc: "Onboard Raspberry Pi computer handles real-time computer vision, low-latency video streaming, and multi-sensor acquisition.",
      highlight: "Edge Computing"
    },
    {
      icon: ShieldCheck,
      title: "6-Parameter Water Quality Suite",
      desc: "Continuous automated monitoring of pH, Turbidity, TDS, Dissolved Oxygen (DO), BOD, and COD with timestamped logging.",
      highlight: "Real-Time Telemetry"
    },
    {
      icon: Layers,
      title: "High-Volume Catchment Hopper",
      desc: "Aerodynamically contoured collection funnel with heavy-duty permeable green mesh that traps floating debris while minimizing drag.",
      highlight: "50L Capacity"
    },
    {
      icon: Compass,
      title: "Cloud & AWS Integration",
      desc: "Seamless bridge between Raspberry Pi edge rover and AWS cloud frontend for global monitoring, telemetry reports, and fleet control.",
      highlight: "AWS Cloud Bridge"
    }
  ];

  useGSAP(
    () => {
      gsap.fromTo(
        ".gsap-hero-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        ".gsap-text",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, delay: 0.2, ease: "power2.out" }
      );

      gsap.fromTo(
        ".gsap-product-showcase",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: "power2.out" }
      );

      gsap.fromTo(
        ".gsap-feature-card",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.5, ease: "power2.out" }
      );
    },
    { scope: containerRef }
  );

  return (
    <div id="start" ref={containerRef} className="min-h-screen bg-slate-50 py-10 sm:py-14 px-4 sm:px-6">
      <div className="w-[96%] md:w-[75%] mx-auto space-y-12">
        
        {/* Corporate Hero Card */}
        <div className="gsap-hero-card bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-12 shadow-xl border border-slate-200 text-center space-y-8">
          
          {/* Official Brand Logo */}
          <div className="inline-flex items-center justify-center mx-auto">
            <img
              src="/images/header.png"
              alt="Albedrozes Logo"
              className="h-20 sm:h-24 w-auto object-contain transition-transform hover:scale-105 duration-300"
            />
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="gsap-text">
              <span className="text-xs font-black text-[#001A70] tracking-widest uppercase bg-blue-50/80 px-4 py-1.5 rounded-full border border-blue-200/80 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1E88E5]" />
                ALBEDROZES PRIVATE LIMITED
              </span>
            </div>

            <h1 className="gsap-text text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Autonomous Water Cleanup & Environmental Telemetry
            </h1>

            <p className="gsap-text text-slate-600 text-sm sm:text-base leading-relaxed pt-1 max-w-2xl mx-auto">
              Empowering aquatic restoration with robotic surface vessels. Integrated Raspberry Pi edge computing, live visual stream, MAVLink positioning, and multi-sensor water quality monitoring.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="gsap-text flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#001A70] to-[#1E88E5] hover:from-[#00124D] hover:to-[#1565C0] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#001A70]/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>Launch Operator Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("product-showcase");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#1E88E5]" />
              <span>Explore Product & Specs</span>
            </button>
          </div>
        </div>

        {/* ---------------- PRODUCT PHOTO SHOWCASE ---------------- */}
        <section id="product-showcase" className="gsap-product-showcase bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold text-[#1E88E5] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                HARDWARE SPECIFICATIONS & PROTOTYPE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Albedrozes Surface Rover Prototype
              </h2>
            </div>

            {/* Photo Selector Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {productPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhoto(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    selectedPhoto === idx
                      ? "bg-white text-[#001A70] shadow-sm border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {photo.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Active Photo Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group relative">
              <img
                src={productPhotos[selectedPhoto].url}
                alt={productPhotos[selectedPhoto].title}
                className="w-full h-80 sm:h-96 object-contain bg-slate-950 p-2 transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-4 left-4 bg-[#001A70]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1E88E5] animate-ping"></span>
                Official Hardware Unit
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black text-[#001A70] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md border border-blue-200 inline-block">
                {productPhotos[selectedPhoto].tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {productPhotos[selectedPhoto].title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {productPhotos[selectedPhoto].subtitle}
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1E88E5] shrink-0" />
                  <span>Dual twin-pontoon flotation with marine-grade waterproof sealant</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1E88E5] shrink-0" />
                  <span>Modular quick-release electronics compartment for field servicing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1E88E5] shrink-0" />
                  <span>Onboard telemetry link connecting Raspberry Pi to AWS cloud</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 pt-3">
                {productPhotos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhoto(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedPhoto === i ? "border-[#1E88E5] shadow-md scale-105" : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={p.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- PRODUCT FEATURES GRID ---------------- */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-[#1E88E5] uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block">
              ENGINEERING EXCELLENCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Comprehensive Product Features
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Built from the ground up for reliable autonomous operation in lakes, rivers, ports, and industrial reservoirs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {productFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="gsap-feature-card bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#1E88E5]/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#001A70] group-hover:bg-[#001A70] group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-[#1E88E5] uppercase tracking-wider bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-200">
                      {feat.highlight}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#001A70] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Start;
