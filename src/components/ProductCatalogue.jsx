import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { categoriesData, getAllProducts, storeInfo } from '../data/productsData';
import { Sparkles, MessageCircle, Phone, Package, CheckCircle2 } from 'lucide-react';

export default function ProductCatalogue({
  activeCategory,
  onSelectCategory,
  onOpenProductModal,
  dynamicProducts,
  dynamicCategories,
}) {
  const [filterQuery, setFilterQuery] = useState('');

  const categoriesList =
    dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories
      : categoriesData;

  const allProductsList =
    dynamicProducts && dynamicProducts.length > 0
      ? dynamicProducts
      : getAllProducts();

  // Find active category
  const currentCategoryObj = categoriesList.find(
    (cat) =>
      cat.id === activeCategory ||
      cat.slug === activeCategory ||
      (cat.name && cat.name.toLowerCase() === activeCategory.toLowerCase())
  );

  // Filter products by selected category
  const activeProducts =
    activeCategory === 'all'
      ? allProductsList
      : allProductsList.filter((p) => {
          if (!currentCategoryObj) return false;
          const catName = currentCategoryObj.name ? currentCategoryObj.name.toLowerCase() : '';
          const catSlug = currentCategoryObj.slug ? currentCategoryObj.slug.toLowerCase() : currentCategoryObj.id?.toLowerCase();
          const pCat = p.category ? p.category.toLowerCase() : '';
          const pCatId = p.categoryId ? p.categoryId.toLowerCase() : '';
          return pCat === catName || pCatId === catSlug || pCatId === catName;
        });

  // Filter by search query
  const filteredProducts = activeProducts.filter((product) => {
    if (!filterQuery) return true;
    const query = filterQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.category && product.category.toLowerCase().includes(query)) ||
      (product.shortDescription && product.shortDescription.toLowerCase().includes(query))
    );
  });

  return (
    <section id="catalogue" className="py-16 sm:py-24 bg-white border-b border-[#ECE7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFEA] border border-[#E3DBD0] text-xs font-semibold text-[#8C6542] uppercase tracking-wider mb-3">
              <Package className="w-3.5 h-3.5" />
              <span>In-Store Product Catalogue</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1C1A] font-bold tracking-tight">
              Explore Store Inventory
            </h2>

            <p className="mt-2 text-sm sm:text-base text-[#61605C] leading-relaxed">
              Browse products available at Yash Cloth Stores, Bajaria, Nagpur. Tap on any item to view high-resolution photographs, placement suggestions, and specifications.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-72">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542] transition-colors"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Tabs / Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-[#F0ECE4]">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#1C1C1A] text-white shadow-xs'
                : 'bg-[#F7F4EE] text-[#54534F] hover:bg-[#EBE5DA]'
            }`}
          >
            All Products ({allProductsList.length})
          </button>

          {categoriesList.map((category) => {
            const catId = category.slug || category.id;
            const isSelected =
              activeCategory === catId ||
              activeCategory === category.id ||
              activeCategory.toLowerCase() === category.name.toLowerCase();

            // Calculate live count from allProductsList
            const count = allProductsList.filter((p) => {
              const catName = category.name.toLowerCase();
              const catSlug = (category.slug || category.id).toLowerCase();
              const pCat = p.category ? p.category.toLowerCase() : '';
              const pCatId = p.categoryId ? p.categoryId.toLowerCase() : '';
              return pCat === catName || pCatId === catSlug || pCatId === catName;
            }).length;

            return (
              <button
                key={catId}
                type="button"
                onClick={() => onSelectCategory(catId)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#8C6542] text-white shadow-xs'
                    : 'bg-[#F7F4EE] text-[#54534F] hover:bg-[#EBE5DA]'
                }`}
              >
                <span>{category.name}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-white text-[#8C6542]' : 'bg-[#E3DBD0] text-[#4A4946]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Category Title & Description Banner when a specific category is selected */}
        {currentCategoryObj && activeCategory !== 'all' && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E4DC] flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold text-[#1C1C1A]">
                  {currentCategoryObj.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F4EFEA] border border-[#E2DAD0] text-[10px] font-bold text-[#8C6542]">
                  {currentCategoryObj.badge || 'Available in Store'}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[#5C5B57] max-w-2xl">
                {currentCategoryObj.description}
              </p>
            </div>

            <div className="text-xs text-[#7A7873] whitespace-nowrap">
              <span>{currentCategoryObj.itemCountText || 'Direct store availability'}</span>
            </div>
          </div>
        )}

        {/* Products Grid if products exist */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onOpenDetail={onOpenProductModal}
              />
            ))}
          </div>
        ) : (
          /* Empty State for categories currently awaiting photo uploads */
          <div className="rounded-3xl bg-[#FAF9F6] border border-[#E8E4DC] p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xs">
            {currentCategoryObj && (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mx-auto mb-6 border-2 border-white shadow-md bg-[#F2EDE6]">
                <img
                  src={currentCategoryObj.coverImage}
                  alt={currentCategoryObj.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFEA] border border-[#E3DBD0] text-xs font-semibold text-[#8C6542] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>In-Store Physical Inventory Ready</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A]">
              {currentCategoryObj ? currentCategoryObj.name : 'Category'} in Stock at Bajaria Store
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-[#5C5B57] max-w-lg mx-auto leading-relaxed">
              We carry an extensive collection of{' '}
              <strong className="text-[#1C1C1A]">{currentCategoryObj ? currentCategoryObj.name.toLowerCase() : 'products'}</strong>{' '}
              at our physical store in Bajaria, near Nagpur Inn Hotel, Nagpur. Additional catalog photos are regularly uploaded by our store owner.
            </p>

            {/* In-store benefits */}
            <div className="mt-6 pt-6 border-t border-[#EBE6DD] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#4A4946] max-w-md mx-auto text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C6542]" />
                <span>Examine fabric texture & weave</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C6542]" />
                <span>Multiple colors & sizes in stock</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C6542]" />
                <span>Instant purchase & carry</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C6542]" />
                <span>Friendly local store guidance</span>
              </div>
            </div>

            {/* Inquire on WhatsApp or Phone */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/91${storeInfo.whatsapp}?text=${encodeURIComponent(
                  `Hello Yash Cloth Stores, I would like to inquire about available varieties and patterns of "${
                    currentCategoryObj ? currentCategoryObj.name : 'Home Furnishings'
                  }" at your Nagpur store.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Us for {currentCategoryObj ? currentCategoryObj.name : 'Stock'} Photos</span>
              </a>

              <a
                href={`tel:${storeInfo.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#D5CEC4] bg-white text-[#1C1C1A] text-xs font-bold hover:bg-[#F2ECE3] hover:border-[#8C6542] transition-all shadow-2xs"
              >
                <Phone className="w-4 h-4 text-[#8C6542]" />
                <span>Call Store: {storeInfo.phone}</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
