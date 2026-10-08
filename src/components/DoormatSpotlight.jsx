import React, { useState } from 'react';
import { doormatKeyFeatures, doormatPlacements } from '../data/productsData';
import { CheckCircle2, ArrowRight, Eye, ShieldCheck, Droplets, Sparkles, X } from 'lucide-react';

export default function DoormatSpotlight({ onSelectDoormatCategory, onOpenProductModal }) {
  const [activePlacementIndex, setActivePlacementIndex] = useState(0);
  const [showFullReferenceModal, setShowFullReferenceModal] = useState(false);

  const activePlacement = doormatPlacements[activePlacementIndex];

  return (
    <section id="doormat-spotlight" className="py-16 sm:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4EFEA] border border-[#E3DBD0] text-xs font-semibold text-[#8C6542] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Current In-Store Spotlight</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1C1A] font-bold tracking-tight">
              Stylish Doormat for Every Space
            </h2>
            
            <p className="mt-3 text-sm sm:text-base text-[#5A5955] leading-relaxed">
              Functional, durable, and crafted to elevate your home aesthetics. Explore the placement versatility and technical features of our signature anti-skid floor mats.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFullReferenceModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5CEC4] bg-white text-xs font-semibold text-[#1C1C1A] hover:bg-[#F2ECE3] hover:border-[#8C6542] transition-colors shadow-2xs"
            >
              <Eye className="w-4 h-4 text-[#8C6542]" />
              <span>View Overview Infographic</span>
            </button>

            <button
              type="button"
              onClick={onSelectDoormatCategory}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8C6542] text-white text-xs font-semibold hover:bg-[#735032] transition-colors shadow-xs"
            >
              <span>See Doormat Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Placement Showcase Interactive Area */}
        <div className="mb-16 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E4DC] subtle-shadow">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE4] pb-5">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-[#8C6542]">
                Placement Versatility
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A] mt-1">
                Designed for 5 Key Living Zones
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#73716C] max-w-sm text-left sm:text-right">
              One timeless design engineered to protect and complement different floor surfaces.
            </p>
          </div>

          {/* Interactive Room Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {doormatPlacements.map((placement, index) => (
              <button
                key={placement.id}
                type="button"
                onClick={() => setActivePlacementIndex(index)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activePlacementIndex === index
                    ? 'bg-[#1C1C1A] text-white shadow-xs'
                    : 'bg-[#F5F2EB] text-[#52514D] hover:bg-[#EAE4D9]'
                }`}
              >
                {placement.room}
              </button>
            ))}
          </div>

          {/* Active Placement Visual & Story Card */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF9F6] p-6 sm:p-8 rounded-2xl border border-[#ECE7DE]">
            <div className="lg:col-span-7 overflow-hidden rounded-xl bg-white border border-[#E8E4DC] shadow-sm">
              <div className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden">
                <img
                  src={activePlacement.image}
                  alt={`${activePlacement.room} placement`}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-103"
                />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                  {activePlacement.room} Placement
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 text-left space-y-4">
              <span className="inline-block px-3 py-1 rounded-md bg-[#F0EAE1] text-[#8C6542] text-xs font-bold uppercase tracking-wider">
                Zone {activePlacementIndex + 1} of 5
              </span>

              <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A] leading-tight">
                {activePlacement.headline}
              </h4>

              <p className="text-sm text-[#5C5B57] leading-relaxed">
                {activePlacement.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-[#E8E4DC] text-xs text-[#4A4946]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C6542]" />
                  <span>Non-slip grip safe on glazed floor tiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C6542]" />
                  <span>Traps dust, liquid droplets & kitchen grime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C6542]" />
                  <span>Low threshold profile fits underneath open doors</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onSelectDoormatCategory}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6542] hover:text-[#1C1C1A] transition-colors"
                >
                  <span>Explore this design in product catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick 5-Room Thumbnail Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {doormatPlacements.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePlacementIndex(idx)}
                className={`text-left rounded-xl p-2.5 border transition-all text-xs ${
                  activePlacementIndex === idx
                    ? 'border-[#8C6542] bg-[#FAF8F5] shadow-xs'
                    : 'border-[#EBE6DC] bg-white hover:border-[#D5CEC4]'
                }`}
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-[#F2EDE6]">
                  <img
                    src={p.image}
                    alt={p.room}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-bold text-[#1C1C1A]">{p.room}</p>
                <p className="text-[11px] text-[#7A7873] truncate">Tap to preview</p>
              </button>
            ))}
          </div>

        </div>

        {/* 2. Four Engineered Features Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8C6542]">
              Engineered Quality
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A] mt-1">
              4 Signature Performance Features
            </h3>
            <p className="text-xs sm:text-sm text-[#666560] mt-2">
              Every detail is tailored for everyday Indian homes, high humidity areas, and active daily footfall.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doormatKeyFeatures.map((feat) => (
              <div
                key={feat.id}
                className="bg-white rounded-2xl p-5 border border-[#E8E4DC] subtle-shadow card-shadow-hover text-left flex flex-col justify-between"
              >
                <div>
                  {/* Feature Image Closeup */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-[#F2EDE6] border border-[#EFECE6]">
                    <img
                      src={feat.image}
                      alt={feat.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#F5EFEB] text-[#8C6542] mb-2">
                    {feat.subtitle}
                  </span>

                  <h4 className="font-serif text-xl font-bold text-[#1C1C1A]">
                    {feat.title}
                  </h4>

                  <p className="mt-2 text-xs text-[#5C5B57] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F2EDE6] flex items-center gap-1.5 text-[11px] font-semibold text-[#8C6542]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tested & verified design</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Full Reference Overview Modal */}
      {showFullReferenceModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowFullReferenceModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-[#D5CEC4]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1C1C1A]">
                  Doormat Official Product Reference
                </h3>
                <p className="text-xs text-[#6B6A66]">
                  Complete multi-placement overview & feature breakdown
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFullReferenceModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden border border-[#ECE7DE] bg-[#F7F5F0]">
              <img
                src="/assets/images/doormat/reference-original.jpg"
                alt="Full Doormat reference specification sheet"
                className="w-full h-auto object-contain mx-auto"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-[#6B6A66]">
                Available at Yash Cloth Stores, Bajaria, near Nagpur Inn Hotel, Nagpur.
              </span>

              <button
                type="button"
                onClick={() => {
                  setShowFullReferenceModal(false);
                  onSelectDoormatCategory();
                }}
                className="px-4 py-2 rounded-lg bg-[#8C6542] text-white font-semibold hover:bg-[#735032] transition-colors"
              >
                View Doormat Catalogue &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
