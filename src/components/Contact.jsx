import { useRef } from "react";
import { Mail, Phone, MapPin, Send, Building2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const Contact = () => {
  const containerRef = useRef(null);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      detail: "albedrozes@gmail.com",
      link: "mailto:albedrozes@gmail.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      detail: "+91 9003124670",
      link: "tel:+919003124670"
    },
    {
      icon: MapPin,
      title: "Headquarters",
      detail: "Kannampalayam, Coimbatore - 641 402, Tamil Nadu, India.",
      link: "https://maps.google.com"
    }
  ];

  useGSAP(
    () => {
      gsap.fromTo(
        ".gsap-contact-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        ".gsap-contact-form",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );

      gsap.fromTo(
        ".gsap-contact-card",
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, delay: 0.3, ease: "power2.out" }
      );
    },
    { scope: containerRef }
  );

  return (
    <section id="contact" ref={containerRef} className="relative w-full min-h-screen bg-slate-50 py-12 sm:py-16 px-4 sm:px-6">
      <div className="w-[96%] md:w-[75%] mx-auto space-y-10">
        
        {/* Header */}
        <div className="gsap-contact-header text-center space-y-3">
          <span className="text-xs font-black text-[#001A70] tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block">
            CONNECT WITH ALBEDROZES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Get In Touch
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have questions regarding autonomous surface rover deployments, water quality telemetry, or custom industrial marine solutions? Contact us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <div className="gsap-contact-form bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
            <h3 className="text-xl font-black text-slate-900">Send us a Message</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your inquiry has been sent to Albedrozes Private Limited."); }}>
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="corporate@domain.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Project Scope / Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Detail your water body location, cleanup objectives, or telemetry requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white transition-all text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#001A70] to-[#1E88E5] hover:from-[#00124D] hover:to-[#1565C0] text-white text-sm font-extrabold shadow-md shadow-[#001A70]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>

          {/* Contact Information Cards */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <a
                    key={idx}
                    href={info.link}
                    target="_blank"
                    rel="noreferrer"
                    className="gsap-contact-card bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1E88E5]/50 transition-all flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#001A70] group-hover:bg-[#001A70] group-hover:text-white transition-all shrink-0">
                      <Icon className="w-6 h-6 text-[#1E88E5] group-hover:text-white" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">{info.title}</h4>
                      <p className="text-sm font-extrabold text-slate-900 group-hover:text-[#001A70] transition-colors">{info.detail}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#001A70] uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-[#1E88E5]" />
                <span>Registered Office Verification</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Albedrozes Private Limited is officially incorporated under the Ministry of Corporate Affairs (MCA), Government of India (CIN: U62013TZ2026PTC038703).
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
