import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Navigation, ExternalLink, ShieldCheck, Check } from 'lucide-react';
import { storeInfo } from '../data/productsData';

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-[#ECE7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFEA] border border-[#E3DBD0] text-xs font-semibold text-[#8C6542] uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Store Location & Inquiries</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1C1A] font-bold tracking-tight">
            Visit Our Store in Bajaria, Nagpur
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#61605C] leading-relaxed">
            We welcome you to visit our offline store to explore fabrics, examine anti-skid mats, and pick up your home essentials directly.
          </p>
        </div>

        {/* Contact Info & Directions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-5 text-left">
            
            {/* Store Card */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E4DC] subtle-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6542]">
                Retail Store
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1C1C1A] mt-1">
                {storeInfo.name}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#5C5B57] leading-relaxed">
                {storeInfo.address}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E2DBD0] text-xs font-semibold text-[#1C1C1A]">
                <MapPin className="w-3.5 h-3.5 text-[#8C6542]" />
                <span>Landmark: Near Nagpur Inn Hotel</span>
              </div>
            </div>

            {/* Direct Phone Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] subtle-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#7A7873]">Telephone Inquiries</span>
                  <p className="font-serif text-2xl font-bold text-[#1C1C1A] mt-1">
                    {storeInfo.phoneFormatted}
                  </p>
                  <p className="text-xs text-[#5C5B57] mt-1">
                    Direct store line for item queries & availability
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5EFEB] flex items-center justify-center text-[#8C6542]">
                  <Phone className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-5">
                <a
                  href={`tel:${storeInfo.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1C1C1A] text-white text-xs font-bold hover:bg-[#8C6542] transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Store Directly</span>
                </a>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-[#F0FAF4] border border-[#C5E9D3] subtle-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1B7E43]">Official WhatsApp</span>
                  <p className="font-serif text-2xl font-bold text-[#0E512B] mt-1">
                    {storeInfo.whatsappFormatted}
                  </p>
                  <p className="text-xs text-[#2A7548] mt-1">
                    Send a message to receive photos of available colors & designs
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-xs">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
              </div>

              <div className="mt-5">
                <a
                  href={`https://wa.me/91${storeInfo.whatsapp}?text=${encodeURIComponent(
                    'Hello Yash Cloth Stores, I would like to inquire about home furnishing items available at your Bajaria, Nagpur store.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp Us</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Timings & Store Guidance Card */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Store Hours & Visiting Tips */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F6] border border-[#E8E4DC] subtle-shadow space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4EFEA] flex items-center justify-center text-[#8C6542]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1C1C1A]">
                      Store Operating Hours
                    </h4>
                    <p className="text-xs text-[#6B6A66]">
                      Open 7 days a week for customer convenience
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#EBF7EE] text-[#1B7E43] text-xs font-bold">
                  Open Today
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[#EAE6DE]">
                  <p className="font-bold text-[#1C1C1A] text-sm mb-1">Monday – Sunday</p>
                  <p className="text-[#6B6A66]">10:00 AM to 9:00 PM</p>
                  <p className="text-[11px] text-[#8C6542] mt-2 font-medium">Continuous afternoon service</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#EAE6DE]">
                  <p className="font-bold text-[#1C1C1A] text-sm mb-1">Customer Support</p>
                  <p className="text-[#6B6A66]">Phone & WhatsApp Active</p>
                  <p className="text-[11px] text-[#8C6542] mt-2 font-medium">Quick responses for stock inquiries</p>
                </div>
              </div>

              {/* Map & Landmark helper */}
              <div className="pt-2">
                <h5 className="font-serif text-base font-bold text-[#1C1C1A] mb-2">
                  How to Reach Yash Cloth Stores
                </h5>
                <ul className="space-y-2 text-xs text-[#52514D]">
                  <li className="flex items-start gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#8C6542] mt-0.5 flex-shrink-0" />
                    <span>Located centrally in Bajaria, easily accessible from main Nagpur commercial corridors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#8C6542] mt-0.5 flex-shrink-0" />
                    <span>Right near <strong>Nagpur Inn Hotel</strong> landmark for easy navigation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#8C6542] mt-0.5 flex-shrink-0" />
                    <span>Parking space available nearby for two-wheelers and shoppers.</span>
                  </li>
                </ul>
              </div>

              {/* Map Button */}
              <div className="pt-2">
                <a
                  href={storeInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#D5CEC4] bg-white text-[#1C1C1A] text-xs font-bold hover:bg-[#F2ECE3] hover:border-[#8C6542] transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#8C6542]" />
                  <span>Open Yash Cloth Stores in Google Maps</span>
                </a>
              </div>

            </div>

            {/* Offline Store Assurance Notice */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] subtle-shadow flex items-center gap-4 text-xs text-[#52514D]">
              <div className="w-10 h-10 rounded-xl bg-[#F5EFEB] flex items-center justify-center text-[#8C6542] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-[#1C1C1A]">Transparent Physical Retail</p>
                <p className="text-[11px] text-[#6B6A66] mt-0.5">
                  No online payment risks or delivery waiting. Inspect the real products in person and take them home immediately.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
