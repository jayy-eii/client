import React from 'react';
import { MapPin, Phone, MessageCircle, Sparkles, CheckCircle2, Store, HeartHandshake, ShieldCheck } from 'lucide-react';
import { storeInfo } from '../data/productsData';

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Showcase Card */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              
              {/* Outer frame */}
              <div className="rounded-3xl overflow-hidden bg-white border border-[#E5DFD4] shadow-md p-6 sm:p-8 space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#8C6542] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
                    Y
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#1C1C1A]">
                      Yash Cloth Stores
                    </h4>
                    <p className="text-xs text-[#8C6542] font-semibold tracking-wider uppercase">
                      Bajaria • Nagpur
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#575652] leading-relaxed">
                  Serving Nagpur families with authentic, premium home-furnishing essentials. We believe in the lasting value of good fabrics and honest local relationships.
                </p>

                {/* 4 Feature Highlights */}
                <div className="space-y-3 pt-2 border-t border-[#F0ECE4] text-xs text-[#3E3D3A]">
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-[#8C6542] flex-shrink-0" />
                    <span>Established offline retail store in Bajaria</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#8C6542] flex-shrink-0" />
                    <span>Genuine fabric quality & durable stitching</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <HeartHandshake className="w-4 h-4 text-[#8C6542] flex-shrink-0" />
                    <span>Friendly in-person guidance and assistance</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#8C6542] flex-shrink-0" />
                    <span>9 Essential home categories available</span>
                  </div>
                </div>

                {/* Address Box */}
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs">
                  <p className="font-bold text-[#1C1C1A] flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8C6542]" />
                    <span>Offline Store Location</span>
                  </p>
                  <p className="text-[#696763] text-[11px]">
                    {storeInfo.address}
                  </p>
                </div>
              </div>

              {/* Decorative accent element */}
              <div className="hidden sm:block absolute -bottom-4 -right-4 w-32 h-32 bg-[#F4EFEA] rounded-3xl -z-10 border border-[#E3DBD0]" />

            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4EFEA] border border-[#E3DBD0] text-xs font-semibold text-[#8C6542] uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              <span>About Yash Cloth Stores</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1C1A] font-bold tracking-tight leading-[1.18]">
              Quality Home-Furnishing Essentials <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#8C6542]">for Comfortable Living</span>
            </h2>

            <p className="text-sm sm:text-base text-[#575652] leading-relaxed">
              At <strong className="text-[#1C1C1A]">Yash Cloth Stores</strong>, we specialize in curating durable, comfortable, and beautifully finished home furnishings. Our collection brings together practical utility and modern aesthetics to make every room feel inviting.
            </p>

            <p className="text-sm sm:text-base text-[#575652] leading-relaxed">
              Whether you are looking for water-absorbent anti-skid doormats for safety, crisp cotton bedsheets and plush comforters for restful sleep, warm blankets for winter, soft high-absorption towels, decorative living room carpets, elegant curtains, or fitted sofa covers — you will find dependable varieties tailored for everyday homes.
            </p>

            {/* In-Store Callout */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] subtle-shadow">
              <h4 className="font-serif text-lg font-bold text-[#1C1C1A]">
                Why Visit Our Bajaria Store?
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-[#61605C] leading-relaxed">
                Home furnishings are best experienced in person. Feel the weight of the cotton, inspect the anti-skid rubber base, and verify the exact colors under natural light before you buy.
              </p>
            </div>

            {/* Direct CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1C1C1A] text-white text-xs sm:text-sm font-semibold hover:bg-[#8C6542] transition-colors shadow-xs"
              >
                <span>Visit Store in Bajaria</span>
                <MapPin className="w-4 h-4" />
              </a>

              <a
                href={`tel:${storeInfo.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#D5CEC4] bg-white text-[#1C1C1A] text-xs sm:text-sm font-semibold hover:bg-[#F2ECE3] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#8C6542]" />
                <span>Call {storeInfo.phone}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
