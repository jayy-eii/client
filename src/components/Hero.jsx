import React from 'react';
import { ArrowDown, MessageCircle, Phone, MapPin, Sparkles, ShieldCheck, Droplets, CheckCircle2 } from 'lucide-react';
import { storeInfo } from '../data/productsData';

export default function Hero({ onExploreClick }) {
  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#FAF9F6]">
      {/* Subtle decorative architectural background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#F2ECE3] to-transparent rounded-full blur-3xl -z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Headline & Introduction */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Store Location Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4EFEA] border border-[#E3DBD0] text-xs font-semibold text-[#8C6542] tracking-wide shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#8C6542]" />
              <span>Offline Store: Bajaria, near Nagpur Inn Hotel, Nagpur</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1C1A] leading-[1.12] tracking-tight">
              Beautiful Essentials <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#8C6542]">for Every Space</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#5A5955] max-w-2xl leading-relaxed font-light">
              Explore quality home-furnishing products available at{' '}
              <strong className="font-semibold text-[#1C1C1A]">Yash Cloth Stores, Nagpur</strong>.
              From premium anti-skid doormats and fine cotton bedsheets to plush comforters, warm blankets, soft towels, and custom curtains.
            </p>

            {/* Key feature pills */}
            <div className="flex flex-wrap gap-2.5 pt-1 text-xs text-[#3E3D3A]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E8E4DC] shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C6542]" /> High Durability
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E8E4DC] shadow-2xs">
                <Droplets className="w-3.5 h-3.5 text-[#8C6542]" /> Water Absorbent Mats
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E8E4DC] shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6542]" /> Physical Store In Nagpur
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#collections"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1C1C1A] text-white text-sm font-semibold hover:bg-[#8C6542] transition-all duration-300 shadow-sm transform hover:-translate-y-0.5"
              >
                <span>Explore Collection</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#D5CEC4] text-[#1C1C1A] text-sm font-semibold hover:bg-[#FAF9F6] hover:border-[#8C6542] transition-all duration-300 shadow-2xs"
              >
                <Phone className="w-4 h-4 text-[#8C6542]" />
                <span>Contact Store</span>
              </a>

              <a
                href={`https://wa.me/91${storeInfo.whatsapp}?text=${encodeURIComponent('Hello Yash Cloth Stores, I am interested in exploring your home-furnishing collection.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20ba59] transition-all duration-300 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Quick Footnote */}
            <div className="pt-3 border-t border-[#ECE7DE] flex items-center gap-6 text-xs text-[#7A7873]">
              <div>
                <span className="font-semibold text-[#1C1C1A]">9</span> Furnishing Categories
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <div>
                <span className="font-semibold text-[#1C1C1A]">Direct Retail</span> Bajaria, Nagpur
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <div>
                <span className="font-semibold text-[#1C1C1A]">Mon – Sun</span> 10 AM to 9 PM
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual using Uploaded Reference Mat Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E5DFD5] shadow-lg card-shadow-hover group">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#F2ECE3]">
                  <img
                    src="/assets/images/doormat/doormat-hero.jpg"
                    alt="Stylish rustic woodgrain anti-skid doormat displayed at entrance doorway"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />
                  {/* Subtle vignette/gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#1C1C1A] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6542]" />
                    <span>In-Store Highlight</span>
                  </div>

                  {/* Caption on image */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <p className="text-xs uppercase tracking-wider font-semibold text-[#EAD8C7]">
                      Doormat Collection
                    </p>
                    <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight">
                      Stylish Anti-Skid Floor Mat
                    </h3>
                  </div>
                </div>

                {/* Bottom Highlight Details */}
                <div className="p-4 bg-white border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#52514D]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8C6542]" />
                    <span>Water Absorbent Surface</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8C6542]" />
                    <span>High-Grip Anti-Skid Base</span>
                  </div>
                </div>
              </div>

              {/* Floating Placement Pill Card */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md border border-[#E3DBD0] rounded-xl p-3 shadow-md items-center gap-3 max-w-[260px] animate-in fade-in duration-500">
                <img
                  src="/assets/images/doormat/placement-kitchen.jpg"
                  alt="Kitchen mat placement"
                  className="w-12 h-12 rounded-lg object-cover border border-[#E8E4DC]"
                />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-[#1C1C1A] leading-tight">
                    Multi-Room Utility
                  </p>
                  <p className="text-[10px] text-[#6B6A66]">
                    Kitchen, Washroom, Living & Bedroom
                  </p>
                </div>
              </div>

              {/* Quality Guarantee Floating Pill */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-white/95 backdrop-blur-md border border-[#E3DBD0] rounded-xl px-3.5 py-2 shadow-md items-center gap-2 text-xs font-semibold text-[#1C1C1A]">
                <ShieldCheck className="w-4 h-4 text-[#8C6542]" />
                <span>Visit Store to Inspect</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
