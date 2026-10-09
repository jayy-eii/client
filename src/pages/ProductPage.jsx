import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
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
  ArrowLeft,
  Store,
  Tag,
  Clock,
  Home,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import {
  storeInfo,
  getWhatsAppOrderUrl,
  getDisplayPrice,
  hasValidPrice,
  getProductIdentifier,
  getProductPageUrl,
  getProductSlug,
  generateWhatsAppOrderMessage,
  getAllProducts,
  categoriesData,
} from '../data/productsData';
import { API_BASE } from '../context/AuthContext';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareFallback, setShowShareFallback] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Related products from same category
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Fetch product matching slug or ID
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setCurrentImageIndex(0);

    const lookupProduct = async () => {
      try {
        // 1. First attempt: fetch from backend API
        const res = await fetch(`${API_BASE}/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            if (isMounted) {
              setProduct(data.product);
              document.title = `${data.product.name} | Yash Cloth Stores, Nagpur`;
              fetchRelated(data.product);
              setLoading(false);
              return;
            }
          }
        }
      } catch (apiErr) {
        console.warn('API lookup by ID/slug failed, falling back to all-products search:', apiErr.message);
      }

      // 2. Second attempt: search in all products from API or static repo
      try {
        const listRes = await fetch(`${API_BASE}/api/products`);
        let allProds = [];
        if (listRes.ok) {
          const listData = await listRes.json();
          if (listData.success && listData.products) {
            allProds = listData.products;
          }
        }
        if (!allProds || allProds.length === 0) {
          allProds = getAllProducts();
        }

        const normalizedSlug = (slug || '').toLowerCase();
        const found = allProds.find((p) => {
          const pSlug = (p.slug || '').toLowerCase();
          const pId = (p.id || p._id || '').toString().toLowerCase();
          const pNameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return pSlug === normalizedSlug || pId === normalizedSlug || pNameSlug === normalizedSlug;
        });

        if (isMounted) {
          if (found) {
            setProduct(found);
            document.title = `${found.name} | Yash Cloth Stores, Nagpur`;
            fetchRelated(found, allProds);
          } else {
            setError('Product not found. It may have been relocated or updated.');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          // Final fallback to static repository
          const staticAll = getAllProducts();
          const normalizedSlug = (slug || '').toLowerCase();
          const found = staticAll.find((p) => {
            const pSlug = (p.slug || '').toLowerCase();
            const pId = (p.id || '').toString().toLowerCase();
            const pNameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return pSlug === normalizedSlug || pId === normalizedSlug || pNameSlug === normalizedSlug;
          });

          if (found) {
            setProduct(found);
            document.title = `${found.name} | Yash Cloth Stores, Nagpur`;
            fetchRelated(found, staticAll);
          } else {
            setError('Product not found in store catalogue.');
          }
          setLoading(false);
        }
      }
    };

    lookupProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const fetchRelated = (current, prodPool) => {
    if (!current) return;
    const cat = (current.category || '').toLowerCase();
    const currentId = (current._id || current.id || '').toString();

    const pool = prodPool && prodPool.length > 0 ? prodPool : getAllProducts();
    const related = pool.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pId = (p._id || p.id || '').toString();
      return pCat === cat && pId !== currentId;
    });
    setRelatedProducts(related.slice(0, 4));
  };

  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1A] flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="w-9 h-9 animate-spin text-[#8C6542] mb-3" />
          <p className="font-serif text-lg text-[#1C1C1A]">Loading product details...</p>
          <p className="text-xs text-[#7A7873] mt-1">Fetching official store inventory</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1A] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E4DC] subtle-shadow space-y-4">
            <span className="inline-block p-3 rounded-full bg-[#FAF9F6] text-[#8C6542] border border-[#E5DFD4]">
              <Store className="w-8 h-8" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A]">
              Item Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#666562] max-w-md mx-auto">
              {error || "The product you requested isn't available or its link has changed. Visit our main catalogue to explore all available collections."}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8C6542] text-white text-xs font-bold hover:bg-[#735032] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Catalogue</span>
              </Link>
              <a
                href={`https://wa.me/91${storeInfo.whatsapp}?text=${encodeURIComponent(
                  `Hello Yash Cloth Stores, I was looking for product: ${slug}. Can you help me check if it is available in store?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1A] flex flex-col antialiased selection:bg-[#8C6542] selection:text-white">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Breadcrumbs & Quick Back */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 text-xs text-[#7A7873]">
          <nav className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#1C1C1A] flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5 text-[#8C6542]" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link to="/" className="hover:text-[#1C1C1A] transition-colors">
              Catalogue
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#8C6542]">{product.category}</span>
            <span>/</span>
            <span className="font-bold text-[#1C1C1A] truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6542] hover:text-[#1C1C1A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Collections</span>
          </Link>
        </div>

        {/* Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-10 subtle-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 text-left">
            
            {/* Left: Product Gallery */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Primary High-Resolution Stage */}
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F2EDE6] border border-[#E5DFD5] flex items-center justify-center select-none shadow-xs"
              >
                <img
                  src={currentImageUrl}
                  alt={`${product.name} photograph ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover object-center transition-all duration-300 pointer-events-none"
                />

                {/* Left / Right Carousel Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#1C1C1A] hover:bg-white hover:scale-105 transition-all cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#1C1C1A] hover:bg-white hover:scale-105 transition-all cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* View Counter Badge */}
                    <div className="absolute bottom-3.5 right-3.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 shadow-xs">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{currentImageIndex + 1} / {images.length} Views</span>
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        currentImageIndex === idx
                          ? 'border-[#8C6542] ring-2 ring-[#8C6542]/30 scale-95 shadow-xs'
                          : 'border-[#E2DCD2] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Physical Store Guarantee Badge */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EBE6DD] flex items-center gap-3 text-xs text-[#6B6A66]">
                <ShieldCheck className="w-5 h-5 text-[#8C6542] flex-shrink-0" />
                <span>
                  Every fabric & item is directly stocked, quality checked, and available at our Bajaria, Nagpur store.
                </span>
              </div>

            </div>

            {/* Right: Product Details, Pricing & WhatsApp Order */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <div>
                {/* Category & Stock Status */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <span className="px-3 py-1 rounded-md bg-[#F4EFEA] text-xs font-bold uppercase tracking-wider text-[#8C6542]">
                    {product.category}
                  </span>

                  {!isAvailable && (
                    <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                      Currently Out of Stock
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1A] leading-tight">
                  {product.name}
                </h1>

                {/* Pricing & Product ID Reference */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {isPriced ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1A]">
                        {displayPrice}
                      </span>
                      <span className="text-xs text-[#7A7873]">inclusive of store taxes</span>
                    </div>
                  ) : (
                    <span className="inline-block px-3.5 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#E8E4DC] text-sm font-semibold text-[#666562]">
                      Price on request
                    </span>
                  )}

                  {product.size && (
                    <span className="px-3 py-1 rounded-lg bg-[#FAF9F6] border border-[#E8E4DC] text-xs font-semibold text-[#54534F]">
                      Size: {product.size}
                    </span>
                  )}

                  <span className="px-2.5 py-1 rounded bg-[#F4EFEA] text-xs font-mono font-medium text-[#7D5A38]">
                    Ref: {productId}
                  </span>
                </div>

                {/* Short Description */}
                {product.shortDescription && (
                  <p className="mt-3 text-sm sm:text-base font-medium text-[#8C6542] leading-relaxed">
                    {product.shortDescription}
                  </p>
                )}

                {/* Detailed Description */}
                {product.description && (
                  <p className="mt-3 text-xs sm:text-sm text-[#54534F] leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Key Specifications / Attributes */}
                {product.details && Object.keys(product.details).length > 0 && (
                  <div className="mt-6 border-t border-[#ECE7DE] pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1A] mb-3">
                      Specifications & Details
                    </h3>
                    <div className="space-y-2 text-xs">
                      {Object.entries(product.details).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start justify-between py-1.5 border-b border-gray-100"
                        >
                          <span className="font-medium text-[#7A7873]">{key}</span>
                          <span className="font-semibold text-[#1C1C1A] text-right max-w-[65%]">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {product.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-[#F4EFEA] text-xs font-medium text-[#7D5A38]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Actions & In-Store Guidance */}
              <div className="pt-6 border-t border-[#ECE7DE] space-y-4">
                
                {/* Physical Store Box */}
                <div className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#E5DFD4] text-xs text-[#52514D]">
                  <div className="flex items-center gap-2 font-bold text-[#1C1C1A] mb-1">
                    <MapPin className="w-4 h-4 text-[#8C6542]" />
                    <span>Yash Cloth Stores, Bajaria, Nagpur</span>
                  </div>
                  <p className="text-[11px] text-[#6B6A66]">
                    Near Nagpur Inn Hotel. Store Hours: 10:00 AM – 9:00 PM (Monday to Sunday). Touch and feel the fabrics in person.
                  </p>
                </div>

                {/* Required WhatsApp Order Instruction Callout */}
                <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] mt-0.5 flex-shrink-0" />
                  <p className="leading-relaxed text-[11px]">
                    <strong>Ordering instruction:</strong> Product details are ready in WhatsApp. To send the product photo, attach the saved/shared image if needed.
                  </p>
                </div>

                {/* Primary WhatsApp Order Button */}
                <div className="space-y-2.5">
                  <a
                    href={whatsappOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#20ba59] transition-all shadow-sm"
                    title="Order on WhatsApp with product details"
                    aria-label={`Order ${product.name} on WhatsApp`}
                  >
                    <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                    <span>Order on WhatsApp</span>
                  </a>

                  {/* Share Product with Image & Call Store */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleShareWithImage}
                      disabled={isSharing}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#D5CEC4] bg-white text-[#1C1C1A] text-xs font-semibold hover:bg-[#F9F7F2] hover:border-[#8C6542] transition-colors cursor-pointer"
                      title="Share product with image and link"
                    >
                      {isSharing ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#8C6542]" />
                      ) : (
                        <Share2 className="w-4 h-4 text-[#8C6542]" />
                      )}
                      <span>Share Product with Image</span>
                    </button>

                    <a
                      href={`tel:${storeInfo.phone}`}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#D5CEC4] bg-white text-[#1C1C1A] text-xs font-semibold hover:bg-[#F2ECE3] hover:border-[#8C6542] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#8C6542]" />
                      <span>Call {storeInfo.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Direct Link Footnote */}
                <div className="flex items-center justify-between text-xs text-[#7A7873] pt-1">
                  <span>Product URL: <span className="font-mono text-[#8C6542]">/product/{getProductSlug(product)}</span></span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 text-[#8C6542] hover:underline font-semibold cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-700">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Direct Link</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-20 text-left">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6542]">
                  Explore Similar Items
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A] mt-1">
                  More from {product.category}
                </h2>
              </div>
              <Link
                to="/"
                className="text-xs font-bold text-[#8C6542] hover:text-[#1C1C1A] transition-colors"
              >
                View Full Catalogue &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel._id || rel.id}
                  product={rel}
                  onOpenDetail={(p) => navigate(`/product/${getProductSlug(p)}`)}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Quick WhatsApp Floating Button */}
      <FloatingWhatsApp />

      {/* Graceful Fallback Modal for Sharing */}
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
                  Your message includes the exact product reference, price, and direct product link.
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
