import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { storeInfo, getWhatsAppOrderUrl } from '../data/productsData';

export default function ProductDetailModal({ product, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product]);

  if (!product) return null;

  const rawImages = product.images && product.images.length > 0 ? product.images : ['/assets/images/doormat/doormat-hero.jpg'];
  const images = rawImages.map((img) => (typeof img === 'string' ? img : img.url));

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const priceFormatted =
    product.price !== null && product.price !== undefined
      ? `₹${Number(product.price).toLocaleString('en-IN')}`
      : null;

  const whatsappOrderUrl = getWhatsAppOrderUrl(product);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto subtle-shadow border border-[#E5DFD5] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header / Close bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#ECE7DE] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#F4EFEA] text-[11px] font-bold uppercase tracking-wider text-[#8C6542]">
              {product.category}
            </span>
            <span className="text-xs text-[#7A7873] hidden sm:inline">• Product Showcase</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-[#4A4946] hover:text-black transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-8">
          
          {/* Left Column: Image Gallery View */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F2EDE6] border border-[#E8E4DC] flex items-center justify-center">
              <img
                src={images[currentImageIndex]}
                alt={`${product.name} view ${currentImageIndex + 1}`}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Prev / Next Arrows if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#1C1C1A] hover:bg-white hover:scale-105 transition-all"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#1C1C1A] hover:bg-white hover:scale-105 transition-all"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Counter Pill */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? 'border-[#8C6542] ring-2 ring-[#8C6542]/30 scale-95'
                        : 'border-[#E2DCD2] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Note on genuine store products */}
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBE6DD] flex items-center gap-2.5 text-xs text-[#6B6A66]">
              <ShieldCheck className="w-4 h-4 text-[#8C6542] flex-shrink-0" />
              <span>Genuine home-furnishing stock inspected and sold at our Bajaria, Nagpur store.</span>
            </div>

          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A] leading-tight">
                  {product.name}
                </h2>
                {product.available === false && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold whitespace-nowrap">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Price and Size if present */}
              <div className="mt-2.5 flex items-center gap-3">
                {priceFormatted && (
                  <span className="font-serif text-2xl font-bold text-[#1C1C1A]">
                    {priceFormatted}
                  </span>
                )}
                {product.size && (
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FAF9F6] border border-[#E8E4DC] text-xs font-semibold text-[#54534F]">
                    {product.size}
                  </span>
                )}
              </div>

              {product.shortDescription && (
                <p className="mt-2 text-xs sm:text-sm font-medium text-[#8C6542]">
                  {product.shortDescription}
                </p>
              )}

              {/* Main Description */}
              {product.description && (
                <p className="mt-3 text-xs sm:text-sm text-[#54534F] leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Details table / Key specifications if available */}
              {product.details && Object.keys(product.details).length > 0 && (
                <div className="mt-5 border-t border-[#ECE7DE] pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1A] mb-3">
                    Product Details & Specifications
                  </h4>
                  <div className="space-y-2 text-xs">
                    {Object.entries(product.details).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start justify-between py-1 border-b border-gray-100"
                      >
                        <span className="font-medium text-[#7A7873]">{key}</span>
                        <span className="font-semibold text-[#1C1C1A] text-right max-w-[60%]">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {product.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#F4EFEA] text-[11px] font-medium text-[#7D5A38]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Offline Store Contact Box & Actions */}
            <div className="pt-4 border-t border-[#ECE7DE] space-y-3">
              <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E5DFD4] text-xs text-[#52514D]">
                <div className="flex items-center gap-1.5 font-bold text-[#1C1C1A] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6542]" />
                  <span>Available at Yash Cloth Stores</span>
                </div>
                <p className="text-[11px] text-[#6B6A66]">
                  Bajaria, near Nagpur Inn Hotel, Nagpur. Visit in person to inspect and purchase.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-all shadow-xs"
                  title="Order on WhatsApp"
                  aria-label={`Order ${product.name} on WhatsApp`}
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order on WhatsApp</span>
                </a>

                <a
                  href={`tel:${storeInfo.phone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#D5CEC4] bg-white text-[#1C1C1A] text-xs font-bold hover:bg-[#F2ECE3] hover:border-[#8C6542] transition-all shadow-2xs"
                >
                  <Phone className="w-4 h-4 text-[#8C6542]" />
                  <span>Call {storeInfo.phone}</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
