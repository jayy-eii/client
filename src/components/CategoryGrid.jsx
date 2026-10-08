import React from 'react';
import CategoryCard from './CategoryCard';
import { categoriesData } from '../data/productsData';
import { Layers } from 'lucide-react';

export default function CategoryGrid({ activeCategory, onSelectCategory, dynamicCategories, dynamicProducts }) {
  const handleCategoryClick = (categoryId) => {
    onSelectCategory(categoryId);
    // Smooth scroll to the product catalogue section
    const catalogueEl = document.getElementById('catalogue');
    if (catalogueEl) {
      catalogueEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categoriesToRender =
    dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories
      : categoriesData;

  return (
    <section id="collections" className="py-16 sm:py-24 bg-white border-y border-[#ECE7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFEA] border border-[#E3DBD0] text-xs font-semibold text-[#8C6542] uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{categoriesToRender.length} Home-Furnishing Collections</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1C1A] font-bold tracking-tight">
            Curated Essentials for Every Corner
          </h2>
          
          <p className="mt-3 text-sm sm:text-base text-[#61605C] leading-relaxed">
            Click any category below to explore available varieties, room placements, and store specifications.
          </p>
        </div>

        {/* 9 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoriesToRender.map((category) => {
            const catId = category.slug || category.id;

            // Compute products array for this category if dynamicProducts is available
            let catProducts = category.products || [];
            if (dynamicProducts && dynamicProducts.length > 0) {
              catProducts = dynamicProducts.filter((p) => {
                const cName = category.name.toLowerCase();
                const cSlug = (category.slug || category.id).toLowerCase();
                const pCat = p.category ? p.category.toLowerCase() : '';
                const pCatId = p.categoryId ? p.categoryId.toLowerCase() : '';
                return pCat === cName || pCatId === cSlug;
              });
            }

            const enrichedCategory = {
              ...category,
              id: catId,
              products: catProducts,
              itemCountText:
                catProducts.length > 0
                  ? `${catProducts.length} design${catProducts.length > 1 ? 's' : ''} available`
                  : category.itemCountText || 'Available in store',
            };

            return (
              <CategoryCard
                key={catId}
                category={enrichedCategory}
                isSelected={
                  activeCategory === catId ||
                  activeCategory === category.id ||
                  activeCategory.toLowerCase() === category.name.toLowerCase()
                }
                onClick={handleCategoryClick}
              />
            );
          })}
        </div>

        {/* Footnote banner */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#EBE6DD] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs sm:text-sm text-[#54534F]">
            <span className="font-semibold text-[#1C1C1A]">Visiting our store in Bajaria, Nagpur?</span>{' '}
            Our team will gladly show you physical samples, fabric weights, and color variants in person.
          </div>
          <a
            href="#contact"
            className="text-xs font-bold text-[#8C6542] hover:text-[#1C1C1A] underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Store Address & Timings &rarr;
          </a>
        </div>

      </div>
    </section>
  );
}
