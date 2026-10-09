import React from 'react';
import { Phone, MessageCircle, MapPin, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeInfo, categoriesData } from '../data/productsData';

export default function Footer({ onSelectCategory, dynamicCategories }) {
  const rawCategories =
    dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories
      : categoriesData;

  const categoriesList = [...rawCategories].sort((a, b) => {
    const ordA = a.displayOrder !== undefined && a.displayOrder !== 0 ? a.displayOrder : a.order || 0;
    const ordB = b.displayOrder !== undefined && b.displayOrder !== 0 ? b.displayOrder : b.order || 0;
    return ordA - ordB;
  });

  const handleCategoryClick = (categoryId) => {
    onSelectCategory(categoryId);
    const catSection = document.getElementById('catalogue');
    if (catSection) {
      catSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#FAF9F6] border-t border-[#ECE7DE] text-[#4A4946] pt-16 pb-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E8E4DC]">
          
          {/* Brand & Introduction Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8C6542] text-white flex items-center justify-center font-serif text-xl font-bold shadow-xs">
                Y
              </div>
              <div>
                <span className="font-serif tracking-wider text-xl font-bold text-[#1C1C1A] uppercase">
                  Yash Cloth Stores
                </span>
                <p className="text-[10px] tracking-widest text-[#8C6542] uppercase font-semibold">
                  Home Furnishings • Bajaria, Nagpur
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed max-w-sm">
              Your destination for quality home furnishing products in Nagpur. Specializing in durable doormats, premium bedsheets, blankets, quilts, towels, carpets, curtains and sofa covers.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`tel:${storeInfo.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5CEC4] bg-white text-xs font-semibold text-[#1C1C1A] hover:bg-[#F2ECE3] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#8C6542]" />
                <span>{storeInfo.phone}</span>
              </a>

              <a
                href={`https://wa.me/91${storeInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba59] transition-colors shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Product Categories Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif text-base font-bold text-[#1C1C1A] uppercase tracking-wider text-xs">
              Home Furnishing Categories
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug || cat.id)}
                  className="text-left py-1 text-[#5E5D59] hover:text-[#8C6542] transition-colors cursor-pointer"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Store Location & Timings Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-[#1C1C1A] uppercase tracking-wider text-xs">
              Offline Retail Store
            </h4>

            <div className="space-y-2.5 text-xs text-[#5E5D59]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8C6542] mt-0.5 flex-shrink-0" />
                <span>{storeInfo.address}</span>
              </div>

              <div className="pt-2 border-t border-[#EAE5DC]">
                <p className="font-semibold text-[#1C1C1A]">Visiting Hours:</p>
                <p className="mt-0.5">{storeInfo.timings}</p>
              </div>

              <div className="pt-2">
                <a
                  href={storeInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8C6542] hover:text-[#1C1C1A] font-semibold underline underline-offset-4"
                >
                  View on Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7873]">
          <p>
            © {new Date().getFullYear()} Yash Cloth Stores. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">Product catalogue showcase • Nagpur</span>
            <Link
              to="/admin"
              className="text-[11px] text-[#8C6542] hover:text-[#1C1C1A] flex items-center gap-1 transition-colors"
              title="Store Owner Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Portal</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
