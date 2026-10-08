import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function CategoryCard({ category, isSelected, onClick }) {
  const hasProducts = category.products && category.products.length > 0;

  return (
    <div
      onClick={() => onClick(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(category.id);
        }
      }}
      className={`group relative flex flex-col justify-between text-left rounded-2xl overflow-hidden bg-white border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8C6542] ${
        isSelected
          ? 'border-[#8C6542] ring-2 ring-[#8C6542]/20 shadow-md transform -translate-y-1'
          : 'border-[#E8E4DC] hover:border-[#8C6542] subtle-shadow card-shadow-hover'
      }`}
    >
      {/* Category Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EDE6]">
        <img
          src={category.coverImage}
          alt={category.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
          loading="lazy"
        />
        
        {/* Subtle dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#1C1C1A] shadow-xs">
            {hasProducts ? (
              <>
                <Sparkles className="w-3 h-3 text-[#8C6542]" />
                <span>Featured Catalog</span>
              </>
            ) : (
              <span>In Store</span>
            )}
          </span>

          <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1C1C1A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8C6542]" />
          </div>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[10px] font-semibold tracking-wider uppercase text-[#E8DCCF]">
            Category
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight drop-shadow-xs">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Description & Action Footer */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
        <div>
          <p className="text-xs text-[#5C5B57] line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-[#F2EDE6] flex items-center justify-between text-xs font-semibold">
          <span className="text-[#8C6542]">
            {category.itemCountText || 'Explore designs'}
          </span>
          <span className="text-[#1C1C1A] group-hover:text-[#8C6542] flex items-center gap-1 transition-colors">
            {isSelected ? 'Viewing' : 'View Items'} &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
