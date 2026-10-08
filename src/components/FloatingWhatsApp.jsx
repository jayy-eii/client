import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { storeInfo } from '../data/productsData';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Tooltip prompt */}
      {showTooltip && (
        <div className="mb-2 hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-lg border border-[#E5DFD4] text-xs text-[#1C1C1A] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span>Need help? Chat with Yash Cloth Stores</span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-black ml-1"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={`https://wa.me/91${storeInfo.whatsapp}?text=${encodeURIComponent(
          'Hello Yash Cloth Stores, I am browsing your online showcase and would like to ask about products in stock.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:bg-[#20ba59] hover:scale-108 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="Chat on WhatsApp"
        title="WhatsApp Yash Cloth Stores"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
