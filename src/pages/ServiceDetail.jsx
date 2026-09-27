import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Calendar,
  Send,
  User,
  Mail,
  MapPin
} from 'lucide-react';
import { services } from '../data/services';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug || s.id === slug) || services[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    upsBrand: 'APC',
    capacity: '1kVA - 5kVA',
    date: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Livkam Power Technologies, I would like to book "${service.title}" at my location in Bengaluru. Please confirm engineer availability.`
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/services" className="hover:text-[#16a34a]">Services</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">{service.title}</span>
      </div>

      {/* Main Service Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-[#16a34a] px-3 py-1 rounded-full inline-block">
              {service.badge}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              {service.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {service.fullDesc || service.shortDesc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Pricing</span>
                <span className="text-xs font-bold text-[#16a34a]">{service.priceStartsAt}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">SLA / Response</span>
                <span className="text-xs font-bold text-slate-800">{service.turnaround}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Coverage</span>
                <span className="text-xs font-bold text-slate-800">Bengaluru & Karnataka</span>
              </div>
            </div>
          </div>

          {/* Included Checklist */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#0f2b48]">
              Service Scope & Deliverables
            </h2>

            <div className="space-y-3">
              {service.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Booking Form & WhatsApp */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-md space-y-4">
            <h3 className="text-lg font-black text-[#0f2b48]">
              Schedule Service Visit
            </h3>
            <p className="text-xs text-slate-500">
              Fill the form below to book certified technician dispatch or call us directly.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#16a34a] mx-auto" />
                <h4 className="text-sm font-bold text-[#0f2b48]">Service Request Received!</h4>
                <p className="text-xs text-slate-600">
                  Our service coordinator will call you within 30 minutes to confirm your technician dispatch schedule.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Site Address (Bengaluru)</label>
                  <input
                    type="text"
                    required
                    placeholder="Apartment / Office address, Area, Pincode"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Service Request</span>
                </button>
              </form>
            )}

            <div className="pt-2">
              <a
                href={`https://wa.me/918884988990?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Fast WhatsApp Booking</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
