import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Loader2,
  Layers,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminProductsList({
  products,
  categories = [],
  initialCategory = 'all',
  isLoading,
  onRefresh,
  onEditProduct,
  onAddNew,
}) {
  const { authFetch } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [actionInProgressId, setActionInProgressId] = useState(null);

  // Product Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Dynamic category filter list
  const categoryFilterOptions = [
    'all',
    ...categories.map((c) => c.name),
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (p.categoryId && p.categoryId.toLowerCase() === selectedCategory.toLowerCase());

    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(query));

    return matchesCat && matchesSearch;
  });

  const handleToggleStatus = async (productId) => {
    setActionInProgressId(productId);
    try {
      const res = await authFetch(`/api/products/${productId}/status`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err) {
      alert('Failed to update stock status: ' + err.message);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleToggleVisibility = async (productId) => {
    setActionInProgressId(productId);
    try {
      const res = await authFetch(`/api/products/${productId}/visibility`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err) {
      alert('Failed to update visibility: ' + err.message);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      const res = await authFetch(`/api/products/${productToDelete._id || productToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete product');
      }

      setProductToDelete(null);
      onRefresh();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E4DC] subtle-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542]"
            />
            <Search className="w-3.5 h-3.5 text-[#8C6542] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Dynamic Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs font-semibold text-[#1C1C1A] focus:outline-none focus:border-[#8C6542] cursor-pointer"
            >
              {categoryFilterOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#6B6A66]">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          </span>

          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C6542] text-white text-xs font-bold hover:bg-[#735032] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] subtle-shadow overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#8C6542]" />
            <span className="text-xs">Loading store products from database...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-gray-500 space-y-3">
            <p className="font-serif text-lg font-bold text-[#1C1C1A]">
              No products found
            </p>
            <p className="text-xs text-[#6B6A66] max-w-sm mx-auto">
              {search || selectedCategory !== 'all'
                ? 'Try adjusting your search or category filter.'
                : 'Your database currently has no products in this view.'}
            </p>
            <button
              type="button"
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C6542] text-white text-xs font-bold hover:bg-[#735032] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E8E4DC] text-[#4A4946] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Availability</th>
                  <th className="py-3.5 px-4">Website Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE4]">
                {filteredProducts.map((product) => {
                  const thumb =
                    product.images && product.images.length > 0
                      ? typeof product.images[0] === 'string'
                        ? product.images[0]
                        : product.images[0].url
                      : '/assets/images/doormat/doormat-hero.jpg';

                  const isAction = actionInProgressId === product._id;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-[#FAF9F6] transition-colors group"
                    >
                      {/* Image Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#F2EDE6] border border-[#E2DCD2]">
                          <img
                            src={thumb}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.images && product.images.length > 1 && (
                            <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/70 text-[9px] text-white font-medium">
                              +{product.images.length - 1}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product Name & Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-[#1C1C1A] text-sm group-hover:text-[#8C6542] transition-colors line-clamp-1">
                          {product.name}
                        </p>
                        {product.shortDescription && (
                          <p className="text-[11px] text-[#6B6A66] line-clamp-1 mt-0.5">
                            {product.shortDescription}
                          </p>
                        )}
                        {product.size && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-700 font-medium">
                            {product.size}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-[#F4EFEA] text-[11px] font-semibold text-[#8C6542]">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-sm text-[#1C1C1A]">
                          {product.price !== null && product.price !== undefined
                            ? `₹${Number(product.price).toLocaleString('en-IN')}`
                            : <span className="text-gray-400 font-normal">Inquire in Store</span>}
                        </span>
                      </td>

                      {/* Stock Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product._id)}
                          disabled={isAction}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            product.available
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {product.available ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Out of Stock</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(product._id)}
                          disabled={isAction}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            !product.isHidden
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {!product.isHidden ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hidden (Draft)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditProduct(product)}
                            className="p-1.5 rounded-lg border border-[#D5CEC4] bg-white text-gray-700 hover:text-[#8C6542] hover:border-[#8C6542] transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteError('');
                            }}
                            className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Deletion Confirmation Modal */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => {
            if (!isDeleting) setProductToDelete(null);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 subtle-shadow border border-[#E8E4DC] text-left animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1C1C1A]">
                  Delete Product: {productToDelete.name}
                </h4>
                <p className="text-xs text-[#6B6A66] mt-0.5">
                  Category: {productToDelete.category}
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                {deleteError}
              </div>
            )}

            <p className="mt-4 text-xs sm:text-sm text-[#4A4946] leading-relaxed">
              Are you sure you want to permanently delete <strong>"{productToDelete.name}"</strong>?
              This will remove the item from your store catalogue and clean up its images from Cloudinary.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#ECE7DE]">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-[#D5CEC4] text-xs font-bold text-[#54534F] hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Product</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
