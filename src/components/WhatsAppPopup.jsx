import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppPopup() {
  return (
    <a
      href="https://wa.me/918884988990?text=Hi%20Livkam%20Power,%20I%20need%20assistance%20with%20UPS%20/%20Batteries"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center animate-bounce-slow"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 fill-white" />
    </a>
  );
}
