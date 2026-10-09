import React from 'react';
import {
  Package,
  Layers,
  CheckCircle2,
  XCircle,
  EyeOff,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverview({ stats, products, categories = [], onNavigate, onEditProduct }) {
  const recentProducts = products.slice(0, 5);

  const statCards = [
    {
      title: 'Total Products',
      value: stats ? stats.totalProducts : products.length,
      icon: Package,
      color: 'text-[#8C6542]',
      bg: 'bg-[#F4EFEA]',
    },
    {
      title: 'Total Categories',
      value: stats ? stats.totalCategories : categories.length,
      icon: Layers,
      color: 'text-[#1C1C1A]',
      bg: 'bg-gray-100',
    },
    {
      title: 'Available In Stock',
      value: stats
        ? stats.availableProducts
        : products.filter((p) => p.available && !p.isHidden).length,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Out of Stock',
      value: stats
        ? stats.outOfStockProducts
        : products.filter((p) => !p.available).length,
      icon: XCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-[#E8E4DC] subtle-shadow flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-[#7A7873] uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="font-serif text-3xl font-bold text-[#1C1C1A] mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1C1C1A] to-[#3A3935] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1">
          <h3 className="font-serif text-xl sm:text-2xl font-bold">
            Manage Yash Cloth Stores Catalogue
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Upload new products with photos directly from your phone or desktop. Images are uploaded to Cloudinary and instantly display for customer visits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onNavigate('add')}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8C6542] text-white text-xs font-bold hover:bg-[#A37B55] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('add-category')}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Add Category</span>
          </button>

          <Link
            to="/"
            target="_blank"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/20"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Products Summary */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] subtle-shadow p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4] mb-4">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#1C1C1A]">
              Recently Added Products
            </h4>
            <p className="text-xs text-[#6B6A66]">
              Latest items saved in your MongoDB database
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8C6542] hover:text-[#1C1C1A]"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentProducts.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">
            No products in store yet. Click "Add New Product" to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProducts.map((p) => {
              const thumb =
                p.images && p.images.length > 0
                  ? typeof p.images[0] === 'string'
                    ? p.images[0]
                    : p.images[0]?.url || '/assets/images/doormat/doormat-hero.jpg'
                  : '/assets/images/doormat/doormat-hero.jpg';

              return (
                <div
                  key={p._id}
                  className="p-3.5 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] flex items-center justify-between gap-3 hover:border-[#8C6542] transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={thumb}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-[#DFD9CD]"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs text-[#1C1C1A] truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-[#8C6542]">{p.category}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEditProduct(p)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#D5CEC4] text-[11px] font-bold text-[#1C1C1A] hover:bg-[#F0EAE1]"
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
