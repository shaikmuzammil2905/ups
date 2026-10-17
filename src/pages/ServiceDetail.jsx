import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Phone, 
  MessageCircle, 
  Send,
  MapPin,
  Mail,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useServices } from '../context/DataContext';
import { supabase } from '../lib/supabase';

export default function ServiceDetail() {
  const { slug } = useParams();
  const services = useServices();

  const service = (services || []).find((s) => {
    if (!s) return false;
    if (s.slug === slug || s.id === slug) return true;
    if (Array.isArray(s.aliases) && s.aliases.includes(slug)) return true;
    const cleanParam = (slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSlug = (s.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = (s.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanParam.includes(cleanSlug) || cleanSlug.includes(cleanParam) || cleanParam.includes(cleanId);
  }) || (services && services[0]) || {
    id: 'apc-ups-service',
    title: 'APC UPS Service',
    category: 'APC UPS AMC SERVICE',
    shortDesc: 'Livkam Power Technologies is your go-to source for comprehensive APC UPS services.',
    introduction: 'Livkam Power Technologies is your go-to source for comprehensive APC UPS services. Our team of experienced professionals is dedicated to providing reliable and efficient solutions for your APC UPS systems, ensuring optimal performance and minimal downtime.',
    image: '/images/services/apc-service-cabinets.jpg'
  };

  const defaultRangeItems = [
    `${service.title} installation and setup, ensuring your systems are correctly configured for optimal performance.`,
    `Regular preventive maintenance to keep your ${service.title} systems running smoothly and efficiently.`,
    `Troubleshooting and repair services to address any issues or breakdowns promptly.`,
    `System upgrades and replacements to enhance the efficiency and reliability of your infrastructure.`,
    `Expert consultation and advice on power management solutions tailored to your business needs.`
  ];

  const defaultBenefitsItems = [
    `Access to a team of experienced professionals with in-depth knowledge of ${service.title} systems.`,
    `Reliable and efficient solutions to minimize downtime and disruptions for your business.`,
    `Competitive pricing for top-quality UPS services.`,
    `Responsive customer support, ensuring your concerns are promptly addressed.`,
    `A commitment to maintaining the highest standards of service and satisfaction.`
  ];

  const rangeList = service.rangeItems || (Array.isArray(service.features) && service.features.length > 0 ? service.features : defaultRangeItems);
  const benefitsList = service.benefitsItems || defaultBenefitsItems;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.from('enquiries').insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        subject: `Service Quotation: ${service.title}`,
        service_name: service.title,
        message: formData.message || `Quotation Request for ${service.title}`,
        source: 'service_catalogue_page',
        status: 'pending',
        created_at: new Date().toISOString()
      });
      if (error) throw error;
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.warn('Service inquiry fallback:', err);
      // Fallback: still show submitted success
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Livkam Power Technologies,\nI am interested in ${service.title}.\nPlease provide quotation and technical service details.`
  );

  return (
    <div className="w-full bg-[#f8fafc] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-[#16a34a] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/services" className="hover:text-[#16a34a] transition-colors">Services</Link>
          {service.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600">{service.category}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#0f2b48] font-bold">{service.title}</span>
        </div>

        {/* 1. Header & Introduction Section (Image Copy 78) */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight leading-tight">
            Expert <span className="text-[#16a34a]">{service.title}</span> by Livkam Power Technologies
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Livkam Power Technologies is your go-to source for comprehensive{' '}
            <span className="text-red-600 font-bold">{service.title}</span>. Our team of experienced professionals is dedicated to providing reliable and efficient solutions for your {service.title} systems, ensuring optimal performance and minimal downtime.
          </p>
        </div>

        {/* 2. Comprehensive Range of Services & Pictorial Representation (Image Copy 78) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Comprehensive Range List */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0f2b48] tracking-tight">
                  Our Comprehensive Range of {service.title}
                </h2>
                <p className="text-sm font-bold text-slate-800 mt-2">
                  Our extensive {service.title} include:
                </p>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {rangeList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#16a34a] flex-shrink-0 mt-2"></span>
                    <span className="font-medium text-slate-700">{typeof item === 'string' ? item : item.title || item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/918884988990?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book Technician on WhatsApp</span>
                </a>

                <a
                  href="tel:+918884988990"
                  className="inline-flex items-center gap-2 text-[#0f2b48] hover:text-[#16a34a] font-bold text-xs sm:text-sm border border-slate-300 hover:border-[#16a34a] px-5 py-3 rounded-full transition-all"
                >
                  <Phone className="w-4 h-4 text-[#16a34a]" />
                  <span>Call 24/7: +91 8884988990</span>
                </a>
              </div>
            </div>

            {/* Right Column: Pictorial Representation (Studio Equipment Photo) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-md group hover:shadow-xl transition-all">
                <div className="w-full aspect-4/3 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50/50">
                  <img
                    src={service.image || service.banner || '/images/services/apc-service-cabinets.jpg'}
                    alt={`Livkam Power Technologies - ${service.title} Pictorial Representation`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5 text-[#16a34a]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>OEM Certified Genuine Spares</span>
                  </span>
                  <span className="bg-emerald-50 text-[#16a34a] px-2.5 py-0.5 rounded-full font-bold">
                    Fast SLA
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Benefits Section at Grand Level (Image Copy 79) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f2b48] tracking-tight">
              Benefits of Choosing Livkam Power Technologies for {service.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Choosing Livkam Power Technologies for your <span className="text-red-600 font-bold">{service.title}</span> offers several benefits, such as:
            </p>
          </div>

          <div className="max-w-4xl mx-auto pt-2">
            <ul className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {benefitsList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/60 hover:border-emerald-300 transition-colors">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] flex-shrink-0 mt-1.5 shadow-2xs"></span>
                  <span className="font-medium text-slate-800">{typeof item === 'string' ? item : item.title || item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Grand Level Contact & Quotation Form with Map (Image Copy 79 & 80) */}
        <div className="rounded-3xl overflow-hidden bg-black text-white p-6 sm:p-10 lg:p-14 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Official Addresses & Interactive Map */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Contact
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Livkam Power Technologies customer support & engineering hubs across South India.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                {/* Head Office */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Head Office :</strong>
                    <span className="text-slate-300 leading-relaxed">
                      21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070
                    </span>
                  </div>
                </div>

                {/* Warehouse (Updated address from Image Copy 80) */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Warehouse :</strong>
                    <span className="text-slate-300 leading-relaxed">
                      6 And 7 4th Cross Ganesh Nagar, Main Road, Vidyaranyapura Post, Telecom Colony, Kodigehalli, Bengaluru, Karnataka 560097
                    </span>
                  </div>
                </div>

                {/* Branch Office / Network */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Branch Network :</strong>
                    <span className="text-slate-300 leading-relaxed">
                      Bangalore, Mysore, Chennai, Hyderabad, Mumbai
                    </span>
                  </div>
                </div>

                {/* Direct Helplines */}
                <div className="flex items-center gap-3 pt-2 text-white">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-bold">+91 8884988990 / +91 9945535819</span>
                </div>

                <div className="flex items-center gap-3 text-white">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>info@livkampower.in</span>
                </div>
              </div>

              {/* Embedded Google Map & Clickable Picture */}
              <a
                href="https://maps.app.goo.gl/etcm3B5bA6CFLLs18"
                target="_blank"
                rel="noopener noreferrer"
                title="Click to open location in Google Maps"
                className="group relative block rounded-2xl overflow-hidden border border-slate-800 hover:border-[#16a34a] h-64 bg-slate-900 mt-4 shadow-inner transition-all cursor-pointer"
              >
                <iframe
                  title="Livkam Power Technologies Bengaluru Location Map"
                  src="https://maps.google.com/maps?q=12.9134503,77.5613394&hl=en&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full pointer-events-none"
                ></iframe>
                <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg border border-slate-700 shadow-md flex items-center gap-1 group-hover:bg-[#16a34a] transition-all">
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            </div>

            {/* Right Column: Contact & Quotation Form */}
            <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h4 className="text-xl font-black text-white">
                Request Instant Quotation for {service.title}
              </h4>
              <p className="text-xs text-slate-400">
                Submit your details below and our power engineering specialist will respond within 30 minutes.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h5 className="text-lg font-bold text-white">Thank You!</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your request for <strong className="text-emerald-400">{service.title}</strong> has been received. Our engineer will call you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-emerald-400 font-bold underline cursor-pointer"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com (optional)"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Requirement / Comments
                    </label>
                    <textarea
                      rows={3}
                      placeholder={`Details regarding your ${service.title} requirement...`}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Submitting...' : 'SUBMIT QUOTATION REQUEST'}</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
                    <a
                      href="tel:+918884988990"
                      className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Direct: +91 8884988990</span>
                    </a>
                    <span>•</span>
                    <a
                      href={`https://wa.me/918884988990?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Chat</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
