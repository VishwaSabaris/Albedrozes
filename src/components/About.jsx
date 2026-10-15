import { useRef } from "react";
import { Waves, Trash2, Droplets, MapPin, BarChart3, BatteryCharging, ChevronLeft, ChevronRight, Users, Award, Shield, Cpu, Building2, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const horizontalTrackRef = useRef(null);

  const stats = [
    { value: "98.4%", label: "Debris Capture Efficiency" },
    { value: "24/7", label: "Autonomous Telemetry" },
    { value: "6+", label: "Real-time Water Sensors" },
    { value: "50 L", label: "Onboard Catchment Hopper" }
  ];

  const founders = [
    {
      name: "Dhandapani Govardhan",
      role: "Co-Founder & Managing Director",
      bio: "Leads executive strategy, product vision, and operational execution at Albedrozes Private Limited, driving sustainable marine cleanup initiatives across aquatic ecosystems.",
      badge: "Founding Director"
    },
    {
      name: "Adithya Viswanathan",
      role: "Co-Founder & Director of Technology",
      bio: "Directs robotics architecture, embedded systems, and autonomous navigation pipelines, pioneering Albedrozes' Raspberry Pi edge stack and Pixhawk telemetry integration.",
      badge: "Founding Director"
    }
  ];

  const team = [
    {
      title: "Embedded Robotics & MAVLink Lead",
      area: "Hardware Integration & Autonomy",
      description: "Oversees Pixhawk flight controller calibration, MAVLink telemetry protocol, and dual Archimedes screw propulsion drivers."
    },
    {
      title: "Environmental Chemist & Sensor Specialist",
      area: "Water Quality Analytics",
      description: "Calibrates real-time sensor probes for pH, Turbidity, TDS, Dissolved Oxygen (DO), BOD, and COD, ensuring laboratory-grade telemetry accuracy."
    },
    {
      title: "AWS Cloud & Computer Vision Architect",
      area: "Cloud Infrastructure",
      description: "Architects the high-throughput AWS frontend cloud infrastructure, edge-to-cloud security, and low-latency MJPEG video streaming pipelines."
    },
    {
      title: "Mechanical & Marine Hull Engineer",
      area: "Structural Dynamics",
      description: "Specializes in hydrodynamic twin-pontoon vessel fabrication, anti-corrosion marine sealants, and high-capacity green mesh catchment hoppers."
    }
  ];

  const capabilities = [
    {
      icon: Waves,
      title: "Autonomous Navigation",
      description: "GPS-guided pathfinding with obstacle detection and adaptive route optimization for efficient water body coverage.",
      badge: "AI Pathfinding"
    },
    {
      icon: Trash2,
      title: "Debris Collection",
      description: "High-throughput Archimedes screw intake system for plastics, organic debris, and floating surface pollutants.",
      badge: "Tangle-Free Drive"
    },
    {
      icon: Droplets,
      title: "Water Quality Suite",
      description: "Real-time sensor arrays measure pH, turbidity, TDS, dissolved oxygen, BOD, and COD for instant compliance reporting.",
      badge: "Multi-Sensor"
    },
    {
      icon: MapPin,
      title: "Live GPS Telemetry",
      description: "Real-time OpenStreetMap spatial positioning and route visualization via the AWS-connected dashboard.",
      badge: "Real-Time Telemetry"
    },
    {
      icon: BarChart3,
      title: "Data Analytics Platform",
      description: "Cloud-hosted telemetry analysis tracking cleaning progress, water quality indices, and operational efficiency.",
      badge: "AWS Cloud"
    },
    {
      icon: BatteryCharging,
      title: "Extended Battery Life",
      description: "High-density lithium power system with solar assist enabling prolonged operational sweeps and auto-docking.",
      badge: "High Endurance"
    }
  ];

  useGSAP(
    () => {
      gsap.fromTo(
        ".gsap-about-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        ".gsap-stat-card",
        { opacity: 0, scale: 0.9, y: 25 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)", delay: 0.2 }
      );

      gsap.fromTo(
        ".gsap-profile-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, delay: 0.3, ease: "power2.out" }
      );

      const track = horizontalTrackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const containerWidth = section.clientWidth;
        return -(trackWidth - containerWidth + 60);
      };

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none"
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 15%",
        end: () => `+=${Math.abs(getScrollAmount()) + 350}`,
        pin: true,
        animation: tween,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true
      });
    },
    { scope: containerRef }
  );

  const scrollLeftNav = () => {
    if (horizontalTrackRef.current) {
      gsap.to(horizontalTrackRef.current, {
        x: "+=360",
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const scrollRightNav = () => {
    if (horizontalTrackRef.current) {
      gsap.to(horizontalTrackRef.current, {
        x: "-=360",
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  return (
    <section id="about" ref={containerRef} className="relative w-full min-h-screen bg-slate-50 py-12 sm:py-16 px-4 sm:px-6">
      <div className="w-[96%] md:w-[75%] mx-auto space-y-16">
        
        {/* Header */}
        <div className="gsap-about-header text-center space-y-4">
          <div className="inline-flex items-center justify-center mx-auto">
            <img
              src="/images/header.png"
              alt="Albedrozes Logo"
              className="h-20 sm:h-24 w-auto object-contain transition-transform hover:scale-105"
            />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About Albedrozes Private Limited
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pioneering autonomous robotic technology and AI-driven environmental telemetry to safeguard and restore aquatic ecosystems worldwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="gsap-stat-card bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-200 hover:shadow-md hover:border-[#1E88E5]/50 transition-all"
            >
              <div className="text-3xl sm:text-4xl font-black text-[#001A70] mb-1">
                {stat.value}
              </div>
              <div className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Profile Card */}
        <div className="bg-white rounded-3xl p-7 sm:p-10 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#1E88E5] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                CORPORATE PROFILE & REGISTRATION
              </span>
              <h2 className="text-2xl font-black text-slate-900">Albedrozes Private Limited</h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Corporate ID (CIN)</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-800">U62013TZ2026PTC038703</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 text-sm leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1E88E5]" />
                <span>Our Heritage & Vision</span>
              </h3>
              <p>
                Headquartered in Coimbatore, Tamil Nadu, Albedrozes Private Limited is dedicated to engineering practical, autonomous water surface robotics that capture floating trash, weeds, and microplastics while simultaneously gathering vital environmental telemetry.
              </p>
              <p>
                From community lakes and river canals to industrial treatment ponds, our vessels provide 24/7 remote monitoring, preventing aquatic ecosystem degradation through modern robotics and cloud intelligence.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1E88E5]" />
                <span>Engineering Standards</span>
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#1E88E5] shrink-0 mt-0.5" />
                  <span>Dual Archimedes screw anti-clogging propulsion engineered for weeds & plastic debris</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#1E88E5] shrink-0 mt-0.5" />
                  <span>Onboard Raspberry Pi running low-latency OpenCV edge video streaming & sensor aggregation</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#1E88E5] shrink-0 mt-0.5" />
                  <span>Secure AWS cloud-hosted telemetry portal for global operator access and compliance reporting</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- FOUNDERS & LEADERSHIP ---------------- */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#1E88E5] uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block">
              EXECUTIVE LEADERSHIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Founders & Directors</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Visionary engineers and entrepreneurs committed to technological solutions for global water cleanup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {founders.map((founder, idx) => (
              <div
                key={idx}
                className="gsap-profile-card bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#1E88E5]/50 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#001A70] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {founder.badge}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 pt-1">{founder.name}</h3>
                    <p className="text-xs font-bold text-[#1E88E5]">{founder.role}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#001A70] to-[#1E88E5] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#001A70]/20 shrink-0">
                    {founder.name.charAt(0)}
                  </div>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {founder.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- EMPLOYEES & ENGINEERING TEAM ---------------- */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#1E88E5] uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block">
              TECHNICAL EXPERTISE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Engineering & Operations Team</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Specialized multi-disciplinary talent driving hardware, software, chemistry, and cloud innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#1E88E5]/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#001A70] mb-2">
                    <Cpu className="w-5 h-5 text-[#1E88E5]" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{member.title}</h4>
                  <span className="text-[10px] font-bold text-[#001A70] block uppercase tracking-wider">{member.area}</span>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- CORE CAPABILITIES SLIDER ---------------- */}
        <div ref={sectionRef} className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Core Engineering Capabilities</h2>
              <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Key Platform Technologies</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeftNav}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-[#001A70] hover:border-[#1E88E5] transition-all cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRightNav}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-[#001A70] hover:border-[#1E88E5] transition-all cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden w-full rounded-3xl py-2">
            <div ref={horizontalTrackRef} className="flex gap-6 w-max py-4 px-2">
              {capabilities.map((cap, index) => {
                const IconComponent = cap.icon;
                return (
                  <div
                    key={index}
                    className="w-[300px] sm:w-[360px] shrink-0 bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#001A70] shadow-xs">
                        <IconComponent className="w-6 h-6 text-[#1E88E5]" />
                      </div>
                      <span className="text-[10px] font-black text-[#1E88E5] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        {cap.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">{cap.title}</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{cap.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
