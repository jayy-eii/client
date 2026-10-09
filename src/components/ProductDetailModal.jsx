import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Layers,
  Loader2,
} from 'lucide-react';
import {
  storeInfo,
  getWhatsAppOrderUrl,
  getDisplayPrice,
  hasValidPrice,
  getProductIdentifier,
  getProductPageUrl,
  getProductSlug,
  generateWhatsAppOrderMessage,
} from '../data/productsData';

export default function ProductDetailModal({ product, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareFallback, setShowShareFallback] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showShareFallback) {
          setShowShareFallback(false);
        } else {
          onClose();
        }
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
  }, [product, showShareFallback]);

  if (!product) return null;

  const rawImages =
    product.images && product.images.length > 0
      ? product.images
      : ['/assets/images/doormat/doormat-hero.jpg'];
  const images = rawImages
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean);

  const currentImageUrl = images[currentImageIndex] || images[0];
  const productId = getProductIdentifier(product);
  const productPageUrl = getProductPageUrl(product, true);
  const displayPrice = getDisplayPrice(product.price);
  const isPriced = hasValidPrice(product.price);
  const isAvailable = product.available !== false;

  const whatsappOrderUrl = getWhatsAppOrderUrl(product, {
    productId,
    pageUrl: productPageUrl,
    selectedVariation: product.size,
  });

  const fullOrderMessage = generateWhatsAppOrderMessage(product, {
    productId,
    pageUrl: productPageUrl,
    selectedVariation: product.size,
  });

  const nextImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      nextImage();
    } else if (diff < -40) {
      prevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(productPageUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      });
    }
  };

  const handleCopyOrderText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullOrderMessage).then(() => {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2200);
      });
    }
  };

  const handleShareWithImage = async () => {
    setIsSharing(true);

    if (navigator.share) {
      try {
        let fileToShare = null;
        if (currentImageUrl) {
          try {
            const resp = await fetch(currentImageUrl, { mode: 'cors' });
            if (resp.ok) {
              const blob = await resp.blob();
              const ext = blob.type && blob.type.includes('png') ? 'png' : 'jpg';
              const filename = `${(product.slug || product.name || 'product')
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')}-photo.${ext}`;
              fileToShare = new File([blob], filename, {
                type: blob.type || 'image/jpeg',
              });
            }
          } catch (fetchErr) {
            console.warn('Could not construct image File for Web Share:', fetchErr);
          }
        }

        // Check if files can be shared
        if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
          await navigator.share({
            title: `${product.name} — Yash Cloth Stores`,
            text: fullOrderMessage,
            url: productPageUrl,
            files: [fileToShare],
          });
          setIsSharing(false);
          return;
        }

        // Try standard Web Share without files
        await navigator.share({
          title: `${product.name} — Yash Cloth Stores`,
          text: fullOrderMessage,
          url: productPageUrl,
        });
        setIsSharing(false);
        return;
      } catch (err) {
        if (err.name === 'AbortError') {
          setIsSharing(false);
          return;
        }
        console.warn('Web Share failed, opening graceful fallback:', err);
      }
    }

    setIsSharing(false);
    setShowShareFallback(true);
  };

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
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#ECE7DE] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#F4EFEA] text-[11px] font-bold uppercase tracking-wider text-[#8C6542]">
              {product.category}
            </span>
            <span className="text-xs text-[#7A7873] hidden sm:inline">• Product Showcase</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share / Copy quick link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E2DCD2] bg-[#FAF9F6] text-xs font-medium text-[#4A4946] hover:text-[#1C1C1A] hover:bg-white transition-colors"
              title="Copy direct link to this product"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8C6542]" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-[#4A4946] hover:text-black transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-8">
          
          {/* Left Column: Image Gallery View */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Main Stage Image with Mobile Touch Swipe */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F2EDE6] border border-[#E8E4DC] flex items-center justify-center select-none"
            >
              <img
                src={currentImageUrl}
                alt={`${product.name} view ${currentImageIndex + 1}`}
                className="w-full h-full object-cover object-center transition-all duration-300 pointer-events-none"
              />

              {/* Prev / Next Arrows ONLY if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#1C1C1A] hover:bg-white hover:scale-105 transition-all cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#1C1C1A] hover:bg-white hover:scale-105 transition-all cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Counter Pill */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5">
                    <Layers className="w-3 h-3" />
                    <span>{currentImageIndex + 1} / {images.length}</span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
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

            {/* Genuine store stock badge */}
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBE6DD] flex items-center gap-2.5 text-xs text-[#6B6A66]">
              <ShieldCheck className="w-4 h-4 text-[#8C6542] flex-shrink-0" />
              <span>Genuine home-furnishing stock inspected and available at our Bajaria, Nagpur store.</span>
            </div>

          </div>

          {/* Right Column: Details & Order Experience */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A] leading-tight">
                  {product.name}
                </h2>
                {!isAvailable && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold whitespace-nowrap">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Dynamic Price & Reference ID */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {isPriced ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A]">
                      {displayPrice}
                    </span>
                    <span className="text-[11px] text-[#7A7873]">inclusive of store taxes</span>
                  </div>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#FAF9F6] border border-[#E8E4DC] text-xs font-semibold text-[#666562]">
                    Price on request
                  </span>
                )}

                {product.size && (
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF9F6] border border-[#E8E4DC] text-xs font-semibold text-[#54534F]">
                    {product.size}
                  </span>
                )}

                <span className="px-2 py-0.5 rounded bg-[#F4EFEA] text-[10px] font-mono font-medium text-[#7D5A38]">
                  ID: {productId}
                </span>
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

              {/* Key Specifications / Details */}
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

            {/* Offline Store Contact Box & WhatsApp Ordering Experience */}
            <div className="pt-4 border-t border-[#ECE7DE] space-y-3.5">
              
              {/* Store Location Info */}
              <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E5DFD4] text-xs text-[#52514D]">
                <div className="flex items-center gap-1.5 font-bold text-[#1C1C1A] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6542]" />
                  <span>Available at Yash Cloth Stores</span>
                </div>
                <p className="text-[11px] text-[#6B6A66]">
                  Bajaria, near Nagpur Inn Hotel, Nagpur. Visit in person to inspect and purchase.
                </p>
              </div>

              {/* Required WhatsApp Order Instruction Callout */}
              <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a] mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed text-[11px]">
                  <strong>Ordering instruction:</strong> Product details are ready in WhatsApp. To send the product photo, attach the saved/shared image if needed.
                </p>
              </div>

              {/* Action Buttons: Order on WhatsApp & Share Product with Image */}
              <div className="space-y-2">
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] text-white text-xs sm:text-sm font-bold hover:bg-[#20ba59] transition-all shadow-sm"
                  title="Order on WhatsApp with product details"
                  aria-label={`Order ${product.name} on WhatsApp`}
                >
                  <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                  <span>Order on WhatsApp</span>
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleShareWithImage}
                    disabled={isSharing}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#D5CEC4] bg-white text-[#1C1C1A] text-xs font-semibold hover:bg-[#F9F7F2] hover:border-[#8C6542] transition-colors cursor-pointer"
                    title="Share product with image and link"
                  >
                    {isSharing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8C6542]" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5 text-[#8C6542]" />
                    )}
                    <span>Share Product with Image</span>
                  </button>

                  <a
                    href={`tel:${storeInfo.phone}`}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#D5CEC4] bg-white text-[#1C1C1A] text-xs font-semibold hover:bg-[#F2ECE3] hover:border-[#8C6542] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8C6542]" />
                    <span>Call {storeInfo.phone}</span>
                  </a>
                </div>
              </div>

              {/* Direct Link Footnote */}
              <div className="flex items-center justify-between text-[11px] text-[#7A7873] pt-1">
                <span>Unique Link: <span className="font-mono text-[#8C6542]">/product/{getProductSlug(product)}</span></span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-[#8C6542] hover:underline font-medium"
                >
                  {copiedLink ? 'Copied!' : 'Copy direct link'}
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Graceful Fallback Modal for Sharing Image & Product Details */}
      {showShareFallback && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowShareFallback(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 border border-[#E5DFD4] shadow-2xl space-y-4 text-left animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DE]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1C1A]">
                  Share Product Photo & Order
                </h3>
                <p className="text-xs text-[#6B6A66]">
                  Follow these 2 quick steps to order on WhatsApp
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowShareFallback(false)}
                className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Save / Open Image */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E4DC] space-y-2.5">
              <div className="flex items-center gap-3">
                <img
                  src={currentImageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover border border-[#D5CEC4] flex-shrink-0"
                />
                <div className="text-xs flex-1">
                  <p className="font-bold text-[#1C1C1A]">Step 1: Save Product Photo</p>
                  <p className="text-[11px] text-[#6B6A66] mt-0.5">
                    Save or open the photo to easily attach it in your WhatsApp conversation.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={currentImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-[#D5CEC4] text-xs font-semibold text-[#1C1C1A] hover:bg-[#F5EFEB] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#8C6542]" />
                  <span>Open Full Photo</span>
                </a>

                <a
                  href={currentImageUrl}
                  download={`${(product.slug || 'product')}-photo.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-[#D5CEC4] text-xs font-semibold text-[#1C1C1A] hover:bg-[#F5EFEB] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C6542]" />
                  <span>Save Photo</span>
                </a>
              </div>
            </div>

            {/* Step 2: Open WhatsApp with Order Message */}
            <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2.5">
              <div className="text-xs text-[#166534]">
                <p className="font-bold">Step 2: Send Pre-filled Order in WhatsApp</p>
                <p className="text-[11px] text-[#15803d] mt-0.5">
                  Your message includes the exact product reference, price, and product page link.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyOrderText}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-[#BBF7D0] text-xs font-semibold text-[#166534] hover:bg-[#DCFCE7] transition-colors"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Details</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Open WhatsApp</span>
                </a>
              </div>
            </div>

            <p className="text-[10px] text-center text-[#7A7873]">
              Product details are ready in WhatsApp. To send the product photo, attach the saved/shared image if needed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
