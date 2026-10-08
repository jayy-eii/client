import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import DoormatSpotlight from '../components/DoormatSpotlight';
import ProductCatalogue from '../components/ProductCatalogue';
import ProductDetailModal from '../components/ProductDetailModal';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { getAllProducts, categoriesData } from '../data/productsData';
import { API_BASE } from '../context/AuthContext';

export default function CustomerHome() {
  const [activeCategory, setActiveCategory] = useState('doormats');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Dynamic products and categories from MongoDB backend API
  const [dynamicProducts, setDynamicProducts] = useState(getAllProducts());
  const [dynamicCategories, setDynamicCategories] = useState(categoriesData);

  useEffect(() => {
    // 1. Fetch live visible products from MongoDB API
    fetch(`${API_BASE}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('API fetch failed');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          setDynamicProducts(data.products);
        }
      })
      .catch((err) => {
        console.warn('Backend API not reachable; using static product fallback:', err.message);
      });

    // 2. Fetch live categories from MongoDB API
    fetch(`${API_BASE}/api/categories`)
      .then((res) => {
        if (!res.ok) throw new Error('API fetch failed');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setDynamicCategories(data.categories);
        }
      })
      .catch((err) => {
        console.warn('Backend API not reachable; using static category fallback:', err.message);
      });
  }, []);

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1A] flex flex-col antialiased selection:bg-[#8C6542] selection:text-white">
      {/* Sticky Navbar */}
      <Navbar
        onSelectCategory={handleSelectCategory}
        activeCategory={activeCategory}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('collections');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 9 Product Categories Grid */}
        <CategoryGrid
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          dynamicCategories={dynamicCategories}
          dynamicProducts={dynamicProducts}
        />

        {/* Priority Doormats Feature Spotlight with Uploaded Reference Visuals */}
        <DoormatSpotlight
          onSelectDoormatCategory={() => {
            handleSelectCategory('doormats');
            const el = document.getElementById('catalogue');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenProductModal={handleOpenProductModal}
        />

        {/* Reusable Data-Driven Product Catalogue */}
        <ProductCatalogue
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          onOpenProductModal={handleOpenProductModal}
          dynamicProducts={dynamicProducts}
          dynamicCategories={dynamicCategories}
        />

        {/* About Yash Cloth Stores Section */}
        <AboutSection />

        {/* Contact & Store Location Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        dynamicCategories={dynamicCategories}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseProductModal}
        />
      )}

      {/* 1-Tap Floating WhatsApp Support */}
      <FloatingWhatsApp />
    </div>
  );
}
