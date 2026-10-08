import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, MapPin, ChevronRight } from 'lucide-react';
import { storeInfo, categoriesData } from '../data/productsData';

export default function Navbar({ onSelectCategory, activeCategory }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Collections', href: '#collections' },
    { name: 'Doormat Spotlight', href: '#doormat-spotlight' },
    { name: 'Catalogue', href: '#catalogue' },
    { name: 'About Store', href: '#about' },
    { name: 'Contact & Visit', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-sm py-3'
            : 'bg-white/95 backdrop-blur-md border-b border-[#EFECE6] py-4'
        }`}
      >
        {/* Top mini strip for store address on desktop */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo / Brand Name */}
            <a href="#home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-[#8C6542] text-white flex items-center justify-center font-serif text-xl font-bold tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105">
                Y
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-wider text-xl sm:text-2xl font-bold text-[#1C1C1A] uppercase leading-none">
                  Yash Cloth Stores
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-[#8C6542] uppercase mt-1">
                  Home Furnishings • Nagpur
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-[#4A4946] hover:text-[#8C6542] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#8C6542] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Direct Contact CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`tel:${storeInfo.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DCD7CE] text-xs font-semibold text-[#1C1C1A] hover:bg-[#F5EFEB] hover:border-[#8C6542] transition-all"
                title="Call Offline Store"
              >
                <Phone className="w-3.5 h-3.5 text-[#8C6542]" />
                <span>{storeInfo.phone}</span>
              </a>

              <a
                href={`https://wa.me/91${storeInfo.whatsapp}?text=${encodeURIComponent('Hello Yash Cloth Stores, I am visiting your website and would like to inquire about home furnishing products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-semibold shadow-sm hover:bg-[#20ba59] transition-all transform hover:scale-[1.02]"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="flex sm:hidden items-center gap-2">
              <a
                href={`https://wa.me/91${storeInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#25D366] text-white text-xs shadow-sm"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#1C1C1A] hover:bg-[#F0ECE4] focus:outline-none"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#EFECE6] px-4 pt-3 pb-6 mt-2 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="pb-2 border-b border-gray-100 flex items-center justify-between text-xs text-[#6B6A66]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8C6542]" /> Bajaria, near Nagpur Inn Hotel
              </span>
              <span className="font-semibold text-[#8C6542]">Nagpur</span>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#1C1C1A] hover:bg-[#F5EFEB] hover:text-[#8C6542] transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>

            {/* Quick Actions in Mobile Menu */}
            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${storeInfo.phone}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-[#DCD7CE] text-xs font-semibold text-[#1C1C1A] bg-[#FAF9F6]"
              >
                <Phone className="w-3.5 h-3.5 text-[#8C6542]" />
                Call Store
              </a>
              <a
                href={`https://wa.me/91${storeInfo.whatsapp}?text=${encodeURIComponent('Hello Yash Cloth Stores, I would like to inquire about products at your Nagpur store.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#25D366] text-white text-xs font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                WhatsApp Us
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
