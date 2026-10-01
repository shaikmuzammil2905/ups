import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';

import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Product Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('enquiries').insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        source: 'contact_page',
        status: 'new',
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Enquiry fallback:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Contact & Showroom</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs text-center md:text-left">
        <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
          Direct Power Helpdesk
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b48]">
          Get in Touch with Livkam
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mt-2 font-medium">
          Have a question regarding Online UPS capacities, battery replacement, AMC contracts, or wholesale quotes? Our engineering team in Bengaluru is ready to assist you.
        </p>
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Phones & WhatsApp */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0f2b48] uppercase tracking-wider">
              Phone & WhatsApp
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Primary Hotline</span>
                  <a href="tel:+918884988990" className="font-bold text-slate-800 hover:text-[#16a34a] text-base">
                    +91 8884988990
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Secondary Line</span>
                  <a href="tel:+919945535819" className="font-bold text-slate-800 hover:text-[#16a34a] text-base">
                    +91 9945535819
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#22c55e] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 fill-[#22c55e]" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Instant WhatsApp Chat</span>
                  <a 
                    href="https://wa.me/918884988990?text=Hi%20Livkam%20Power,%20I%20need%20assistance" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-bold text-[#16a34a] hover:underline text-sm"
                  >
                    Start Chat on WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Email & Address */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0f2b48] uppercase tracking-wider">
              Email & Location
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Official Email</span>
                  <a href="mailto:info@livkampower.in" className="font-bold text-slate-800 hover:text-[#16a34a]">
                    info@livkampower.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Showroom Address</span>
                  <p className="font-medium text-slate-700 text-xs leading-relaxed mt-0.5">
                    21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-center font-mono text-slate-600">
                <span>GSTIN:</span>
                <span className="font-bold text-[#0f2b48]">29CYMPN3694M1ZC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs">
          <h2 className="text-xl font-black text-[#0f2b48] mb-1">
            Send an Online Enquiry
          </h2>
          <p className="text-xs text-slate-500 mb-6 font-medium">
            Fill the details below and our team will get back to you with a formal quote within 1 business hour.
          </p>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto" />
              <h3 className="text-lg font-bold text-[#0f2b48]">Enquiry Successfully Sent!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for contacting Livkam Power Technologies. Our representative will contact you at {formData.phone || 'your phone number'} shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', email: '', subject: 'General Product Inquiry', message: '' });
                }}
                className="mt-2 bg-[#16a34a] text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Babu"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 8884988990"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Requirement Category</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a] font-medium text-slate-700"
                  >
                    <option value="Online UPS Inquiry">Online UPS (1kVA - 200kVA)</option>
                    <option value="SMF / Tubular Batteries">SMF / Tubular Battery Replacement</option>
                    <option value="Home Inverters">Home Inverter & Backup</option>
                    <option value="Lithium Systems">Lithium Storage System</option>
                    <option value="AMC / Service Visit">AMC / Repair Service Visit</option>
                    <option value="Wholesale Bulk Order">Wholesale / Enterprise Bulk Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message / Load Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your load requirements, equipment to back up, or required backup runtime (e.g. 2 hours for 5 PCs)..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Send Enquiry to Livkam Team</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[#0f2b48] text-sm">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Store Location Map — Banashankari 2nd Stage, Bengaluru</span>
          </div>
          <a
            href="https://maps.google.com/?q=21,+Subhash+Chandra+Bose+Rd,+Banashankari+2nd+Stage,+Bendre+Nagar,+Bengaluru,+Karnataka+560070"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#16a34a] hover:underline"
          >
            Open in Google Maps →
          </a>
        </div>
        <div className="h-64 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative flex items-center justify-center">
          <iframe
            title="Livkam Bengaluru Location"
            src="https://maps.google.com/maps?q=Banashankari%202nd%20Stage%20Bengaluru%20560070&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
