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
  ArrowRight
} from 'lucide-react';
import { services } from '../data/services';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug || s.id === slug) || services[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    service: service.title,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mocking Supabase submit
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Livkam Power Technologies,\nI am interested in ${service.title}.\nPlease provide more information.`
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/services" className="hover:text-[#16a34a]">Services</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">{service.title}</span>
      </div>

      {/* 1 & 2. Service Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48]">
          {service.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          {service.introduction || service.shortDesc}
        </p>
      </div>

      {/* 4. Service-Related Image */}
      {service.image && (
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-[400px] md:h-[500px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* 7. About This Service */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f2b48] mb-6">ABOUT THIS SERVICE</h2>
        <div className="space-y-6">
          {service.aboutContent?.map((content, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-bold text-[#16a34a] mb-2">{content.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{content.desc}</p>
            </div>
          ))}
          {!service.aboutContent && (
             <p className="text-slate-600 leading-relaxed text-sm">{service.fullDesc}</p>
          )}
        </div>
      </div>

      {/* 9. Four-Column Section */}
      {service.fourColumns && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.fourColumns.map((col, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-black text-[#0f2b48] mb-4 uppercase tracking-wide border-b pb-2">{col.heading}</h3>
              <ul className="space-y-3">
                {col.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 11 & 12. Why Choose Us & Technical Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0f2b48] text-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-black mb-6">WHY CHOOSE LIVKAM POWER TECHNOLOGIES?</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
              <span className="text-sm text-slate-300">Professional power solutions with experienced technical support.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
              <span className="text-sm text-slate-300">Quality products from leading brands like APC, Delta, Exide, Amaron.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
              <span className="text-sm text-slate-300">Retail and wholesale support with reliable after-sales service.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-black text-[#0f2b48] mb-6">HOW IT WORKS</h2>
          <div className="space-y-6">
            <div className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-bold shadow-md group-hover:bg-[#16a34a] transition-colors z-10">1</div>
                <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
              </div>
              <div className="pb-6">
                <h3 className="text-sm font-bold text-[#0f2b48] uppercase mb-1">STEP 1 — CONTACT US</h3>
                <p className="text-sm text-slate-600">Tell us about your UPS or power-backup requirement.</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-bold shadow-md group-hover:bg-[#16a34a] transition-colors z-10">2</div>
                <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
              </div>
              <div className="pb-6">
                <h3 className="text-sm font-bold text-[#0f2b48] uppercase mb-1">STEP 2 — REQUIREMENT ASSESSMENT</h3>
                <p className="text-sm text-slate-600">Understand the equipment, load and backup requirements.</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-bold shadow-md group-hover:bg-[#16a34a] transition-colors z-10">3</div>
                <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
              </div>
              <div className="pb-6">
                <h3 className="text-sm font-bold text-[#0f2b48] uppercase mb-1">STEP 3 — INSPECTION / CONSULTATION</h3>
                <p className="text-sm text-slate-600">Inspect the system or provide technical guidance based on the requirement.</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-bold shadow-md group-hover:bg-[#16a34a] transition-colors z-10">4</div>
                <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
              </div>
              <div className="pb-6">
                <h3 className="text-sm font-bold text-[#0f2b48] uppercase mb-1">STEP 4 — SERVICE EXECUTION</h3>
                <p className="text-sm text-slate-600">Perform installation, maintenance, repair, replacement or other required service.</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-bold shadow-md group-hover:bg-[#16a34a] transition-colors z-10">5</div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f2b48] uppercase mb-1">STEP 5 — TESTING & HANDOVER</h3>
                <p className="text-sm text-slate-600">Test the system and provide the required customer guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 13. Related Products */}
      {service.relatedProducts && service.relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[#0f2b48]">RELATED PRODUCTS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.relatedProducts.map((prod, idx) => (
              <Link to={`/products/${prod.slug}`} key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#16a34a] transition-colors flex items-center justify-between group">
                <span className="text-sm font-bold text-[#0f2b48] group-hover:text-[#16a34a]">{prod.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#16a34a]" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 14. Contact Section */}
      <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-[#0f2b48] mb-4">CONTACT LIVKAM POWER TECHNOLOGIES</h2>
          <p className="text-sm text-slate-600">Reach out to us directly for immediate assistance or queries regarding our services.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="tel:+918884988990" className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow gap-3 text-center border border-slate-200">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#0f2b48]">Call Us</span>
            <span className="text-xs text-slate-500 font-medium">+91 8884988990<br/>+91 9945535819</span>
          </a>
          
          <a href={`https://wa.me/918884988990?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow gap-3 text-center border border-slate-200">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#0f2b48]">WhatsApp Us</span>
            <span className="text-xs text-slate-500 font-medium">+91 8884988990</span>
          </a>

          <a href="mailto:info@livkampower.in" className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow gap-3 text-center border border-slate-200">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#0f2b48]">Email Us</span>
            <span className="text-xs text-slate-500 font-medium">info@livkampower.in</span>
          </a>

          <a href="https://maps.google.com/?q=21,+Subhash+Chandra+Bose+Rd,+Banashankari+2nd+Stage,+Bendre+Nagar,+Bengaluru,+Karnataka+560070" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow gap-3 text-center border border-slate-200">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#0f2b48]">Address</span>
            <span className="text-xs text-slate-500 font-medium line-clamp-2">Banashankari 2nd Stage,<br/>Bengaluru</span>
          </a>
        </div>
      </div>

      {/* 16. Map Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-[#0f2b48]">FIND US</h2>
        <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
          <iframe 
            src="https://maps.google.com/maps?q=Livkam%20Power%20Technologies,%20Banashankari%202nd%20Stage,%20Bengaluru&t=&z=14&ie=UTF8&iwloc=&output=embed" 
            className="w-full h-full border-0" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Livkam Power Technologies Map"
          ></iframe>
        </div>
      </div>

      {/* 17. Customer Form Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl font-black text-[#0f2b48]">SEND US A MESSAGE</h2>
          <p className="text-sm text-slate-500">Have a specific requirement? Fill out the form and our team will get back to you.</p>
        </div>

        {submitted ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto" />
            <h4 className="text-lg font-black text-[#0f2b48]">Thank You!</h4>
            <p className="text-sm text-slate-600">
              Your enquiry has been submitted successfully.<br/>Our team will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">MOBILE NUMBER *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">EMAIL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">COMPANY NAME</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">SERVICE / REQUIREMENT *</label>
              <select
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.title}>{srv.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">MESSAGE *</label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              <span>SEND MESSAGE</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
