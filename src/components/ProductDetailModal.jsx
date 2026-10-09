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
  Image as ImageIcon,
} from 'lucide-react';
import {
  storeInfo,
  getWhatsAppOrderUrl,
  getDisplayPrice,
  hasValidPrice,
  getProductIdentifier,
  getProductPageUrl,
  getProductSlug,
  getProductPrimaryImageUrl,
  generateWhatsAppOrderMessage,
} from '../data/productsData';
import {
  shareImageWithCaption,
  copyImageToClipboard,
  canShareFiles,
  createShareableImageFile,
} from '../utils/whatsappShareHelper';

export default function ProductDetailModal({ product, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareFallback, setShowShareFallback] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedPhoto, setCopiedPhoto] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [orderToast, setOrderToast] = useState('');

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

  // Guaranteed absolute URL for WhatsApp link previews and external sharing
  const absoluteImageUrl = currentImageUrl.startsWith('http')
    ? currentImageUrl
    : `${window.location.origin}${currentImageUrl.startsWith('/') ? '' : '/'}${currentImageUrl}`;

  const productId = getProductIdentifier(product);
  const productPageUrl = getProductPageUrl(product, true);
  const displayPrice = getDisplayPrice(product.price);
  const isPriced = hasValidPrice(product.price);
  const isAvailable = product.available !== false;

  const whatsappOrderUrl = getWhatsAppOrderUrl(product, {
    productId,
    pageUrl: productPageUrl,
    photoUrl: absoluteImageUrl,
    selectedVariation: product.size,
  });

  const fullOrderMessage = generateWhatsAppOrderMessage(product, {
    productId,
    pageUrl: productPageUrl,
    photoUrl: absoluteImageUrl,
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

  const handleCopyPhoto = async () => {
    const success = await copyImageToClipboard(absoluteImageUrl);
    if (success) {
      setCopiedPhoto(true);
      setTimeout(() => setCopiedPhoto(false), 2500);
    } else {
      alert('Could not copy image automatically. You can save or open the photo below.');
    }
  };

  const handleWhatsAppOrderClick = async () => {
    // Attempt copying photo to clipboard so desktop/app users can paste directly in chat
    copyImageToClipboard(absoluteImageUrl).catch(() => {});
    setOrderToast('WhatsApp opened! Direct photo link is in the message. You can also press Paste (Ctrl+V) in chat.');
    setTimeout(() => setOrderToast(''), 6000);
  };

  const handleShareWithImage = async () => {
    setIsSharing(true);

    try {
      if (canShareFiles()) {
        const shared = await shareImageWithCaption({
          imageUrl: absoluteImageUrl,
          captionText: fullOrderMessage,
          title: `${product.name} — Yash Cloth Stores`,
        });
        if (shared) {
          setIsSharing(false);
          return;
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setIsSharing(false);
        return;
      }
      console.warn('Native file share failed, falling back:', err);
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
            {/* Quick Share Link */}
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
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F2EDE6] border border-[#E8E4DC] flex items-center justify-center select-none shadow-xs"
            >
              <img
                src={currentImageUrl}
                alt={`${product.name} view ${currentImageIndex + 1}`}
                className="w-full h-full object-cover object-center transition-all duration-300 pointer-events-none"
              />

              {/* Prev / Next Controls ONLY if multiple images */}
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

            {/* In-Store Guarantee Note */}
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
                <div className="leading-relaxed text-[11px]">
                  <p>
                    <strong>WhatsApp Ordering with Photo:</strong> Product photo link is automatically included in your WhatsApp message.
                  </p>
                  <p className="text-[10px] text-[#15803d] mt-0.5">
                    To send the actual photo file, tap <em>&ldquo;Share Product with Image&rdquo;</em> or attach the saved photo.
                  </p>
                </div>
              </div>

              {/* Toast feedback */}
              {orderToast && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 animate-in fade-in">
                  {orderToast}
                </div>
              )}

              {/* Action Buttons: Order on WhatsApp & Share Product with Image */}
              <div className="space-y-2">
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppOrderClick}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] text-white text-xs sm:text-sm font-bold hover:bg-[#20ba59] transition-all shadow-sm cursor-pointer"
                  title="Order on WhatsApp with product details & photo link"
                  aria-label={`Order ${product.name} on WhatsApp`}
                >
                  <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                  <span>Order on WhatsApp (with Photo Link)</span>
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleShareWithImage}
                    disabled={isSharing}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#D5CEC4] bg-white text-[#1C1C1A] text-xs font-semibold hover:bg-[#F9F7F2] hover:border-[#8C6542] transition-colors cursor-pointer"
                    title="Send actual photo file to WhatsApp"
                  >
                    {isSharing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8C6542]" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5 text-[#8C6542]" />
                    )}
                    <span>Share Photo & Order</span>
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

      {/* Helper Modal for Sending Photo & Order Details */}
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
                  Send Product Photo & Order
                </h3>
                <p className="text-xs text-[#6B6A66]">
                  Attach photo to your WhatsApp message
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

            {/* Step 1: Photo actions */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E4DC] space-y-2.5">
              <div className="flex items-center gap-3">
                <img
                  src={currentImageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover border border-[#D5CEC4] flex-shrink-0"
                />
                <div className="text-xs flex-1">
                  <p className="font-bold text-[#1C1C1A]">Step 1: Copy or Save Photo</p>
                  <p className="text-[11px] text-[#6B6A66] mt-0.5">
                    Copy the photo to clipboard or save it to your phone/computer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyPhoto}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-[#D5CEC4] text-xs font-semibold text-[#1C1C1A] hover:bg-[#F5EFEB] transition-colors cursor-pointer"
                >
                  {copiedPhoto ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700">Photo Copied!</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3.5 h-3.5 text-[#8C6542]" />
                      <span>Copy Photo</span>
                    </>
                  )}
                </button>

                <a
                  href={currentImageUrl}
                  download={`${(product.slug || 'product')}-photo.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-[#D5CEC4] text-xs font-semibold text-[#1C1C1A] hover:bg-[#F5EFEB] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C6542]" />
                  <span>Save Photo</span>
                </a>
              </div>
            </div>

            {/* Step 2: Open WhatsApp */}
            <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2.5">
              <div className="text-xs text-[#166534]">
                <p className="font-bold">Step 2: Send Message in WhatsApp</p>
                <p className="text-[11px] text-[#15803d] mt-0.5">
                  The message includes the product reference, price, direct photo URL, and product link. Just paste your copied photo!
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyOrderText}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-[#BBF7D0] text-xs font-semibold text-[#166534] hover:bg-[#DCFCE7] transition-colors cursor-pointer"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
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
              Tip: If you copied the photo, simply press <strong>Paste (Ctrl+V)</strong> in WhatsApp to send it with your message.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
