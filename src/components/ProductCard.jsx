import React from 'react';
import { Eye, MessageCircle, Layers } from 'lucide-react';
import { storeInfo, getWhatsAppOrderUrl, getDisplayPrice, hasValidPrice, getProductPageUrl } from '../data/productsData';

export default function ProductCard({ product, onOpenDetail }) {
  const images = product.images || [];
  const imageCount = images.length;
  
  const primaryImage =
    imageCount > 0
      ? typeof images[0] === 'string'
        ? images[0]
        : images[0]?.url || '/assets/images/doormat/doormat-hero.jpg'
      : '/assets/images/doormat/doormat-hero.jpg';

  const isAvailable = product.available !== false;

  const whatsappOrderUrl = getWhatsAppOrderUrl(product);

  const handleWhatsAppOrder = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target !== e.currentTarget && e.target.closest('a, button')) return;
          e.preventDefault();
          onOpenDetail(product);
        }
      }}
      className="group relative flex flex-col justify-between text-left rounded-2xl overflow-hidden bg-white border border-[#E8E4DC] subtle-shadow card-shadow-hover cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8C6542]"
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EDE6]">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-[#1C1C1A] shadow-2xs">
            {product.category}
          </span>

          <div className="flex items-center gap-1.5">
            {!isAvailable && (
              <span className="px-2 py-0.5 rounded-md bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-bold">
                Out of Stock
              </span>
            )}

            {imageCount > 1 && (
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                <Layers className="w-3 h-3" />
                <span>{imageCount} Views</span>
              </span>
            )}
          </div>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-[#1C1C1A] shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#8C6542]" />
            <span>View Full Details</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1C1A] group-hover:text-[#8C6542] transition-colors line-clamp-1 leading-snug flex-1">
              {product.name}
            </h3>
            {hasValidPrice(product.price) ? (
              <span className="text-sm font-bold text-[#1C1C1A] whitespace-nowrap bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#E8E4DC]">
                {getDisplayPrice(product.price)}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-[#7D766D] whitespace-nowrap bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#E8E4DC]/80">
                Price on request
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="mt-1.5 text-xs text-[#5E5D59] line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-[#F5EFEB] text-[10px] font-medium text-[#7D5A38]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="mt-4 pt-3.5 border-t border-[#F2ECE4] flex items-center justify-between gap-2">
          <button
            type="button"
            className="text-xs font-semibold text-[#8C6542] group-hover:text-[#1C1C1A] flex items-center gap-1 transition-colors"
          >
            <span>Inspect Details</span> &rarr;
          </button>

          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppOrder}
            onKeyDown={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors text-xs font-semibold shrink-0"
            title="Order on WhatsApp"
            aria-label={`Order ${product.name} on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
