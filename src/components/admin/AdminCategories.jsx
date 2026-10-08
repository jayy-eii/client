import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  Plus,
  Package,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  Search,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminCategories({
  categories,
  onRefresh,
  onAddNewCategory,
  onEditCategory,
  onSelectCategoryForFilter,
  onAddProductForCategory,
}) {
  const { authFetch } = useAuth();

  const [search, setSearch] = useState('');
  const [actionInProgressId, setActionInProgressId] = useState(null);

  // Safety Delete Modal State
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteAction, setDeleteAction] = useState('move'); // 'move' | 'delete_products'
  const [targetCategoryId, setTargetCategoryId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const filteredCategories = categories.filter((cat) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.tagline && cat.tagline.toLowerCase().includes(q)) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  });

  const handleToggleVisibility = async (category) => {
    const catId = category._id || category.id;
    setActionInProgressId(catId);
    try {
      const res = await authFetch(`/api/categories/${catId}/visibility`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) {
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Failed to toggle visibility');
      }
    } catch (err) {
      alert('Error updating visibility: ' + err.message);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteError('');
    setDeleteAction('move');

    // Pre-select first available other category
    const otherCategories = categories.filter(
      (c) => (c._id || c.id) !== (category._id || category.id)
    );
    if (otherCategories.length > 0) {
      setTargetCategoryId(otherCategories[0]._id || otherCategories[0].id);
    } else {
      setTargetCategoryId('');
      setDeleteAction('delete_products');
    }
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setCategoryToDelete(null);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    const catId = categoryToDelete._id || categoryToDelete.id;
    const count = categoryToDelete.totalProductCount ?? categoryToDelete.productCount ?? 0;

    setIsDeleting(true);
    setDeleteError('');

    try {
      const payload = {};
      if (count > 0) {
        payload.action = deleteAction;
        if (deleteAction === 'move') {
          if (!targetCategoryId) {
            throw new Error('Please select a destination category to move the products to.');
          }
          payload.targetCategoryId = targetCategoryId;
        }
      }

      const res = await authFetch(`/api/categories/${catId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete category');
      }

      setDeleteSuccess(data.message || 'Category deleted successfully.');
      setTimeout(() => {
        setCategoryToDelete(null);
        setDeleteSuccess('');
        if (onRefresh) onRefresh();
      }, 700);
    } catch (err) {
      console.error('Category deletion error:', err);
      setDeleteError(err.message || 'Failed to delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  const otherCategories = categoryToDelete
    ? categories.filter(
        (c) => (c._id || c.id) !== (categoryToDelete._id || categoryToDelete.id)
      )
    : [];

  const productCountInDeletingCat = categoryToDelete
    ? categoryToDelete.totalProductCount ?? categoryToDelete.productCount ?? 0
    : 0;

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Controls Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] subtle-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl font-bold text-[#1C1C1A]">
              Categories Management ({categories.length})
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F4EFEA] text-[#8C6542]">
              {categories.filter((c) => !c.isHidden).length} Visible
            </span>
          </div>
          <p className="text-xs text-[#6B6A66] mt-0.5">
            Create, edit, organize collections and manage category cover photos. Changes automatically reflect on the public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542]"
            />
            <Search className="w-4 h-4 text-[#9E9B95] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Add Category Button */}
          <button
            type="button"
            onClick={onAddNewCategory}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C6542] hover:bg-[#735133] text-white text-xs font-bold transition-all shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const catId = cat._id || cat.id || cat.slug;
          const isBusy = actionInProgressId === catId;
          const productCount = cat.totalProductCount ?? cat.productCount ?? 0;

          return (
            <div
              key={catId}
              className={`bg-white rounded-2xl border transition-all duration-200 subtle-shadow overflow-hidden flex flex-col justify-between ${
                cat.isHidden ? 'border-amber-200 bg-amber-50/20 opacity-90' : 'border-[#E8E4DC]'
              }`}
            >
              <div>
                {/* Category Cover Image Header */}
                <div className="relative aspect-[16/9] w-full bg-[#F2EDE6] overflow-hidden">
                  {cat.coverImage ? (
                    <img
                      src={cat.coverImage}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#9E9B95]">
                      <ImageIcon className="w-8 h-8 stroke-1 mb-1" />
                      <span className="text-xs">No Cover Image</span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Badges on Top */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    {/* Visibility status */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(cat)}
                      disabled={isBusy}
                      title={cat.isHidden ? 'Click to show publicly' : 'Click to hide from customers'}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs transition-all cursor-pointer ${
                        cat.isHidden
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {cat.isHidden ? (
                        <>
                          <EyeOff className="w-3 h-3 text-amber-700" />
                          <span>Hidden</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-emerald-700" />
                          <span>Visible</span>
                        </>
                      )}
                    </button>

                    {/* Product count */}
                    <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                      <Package className="w-3 h-3 text-[#8C6542]" />
                      <span>{productCount} Products</span>
                    </div>
                  </div>

                  {/* Name on image */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="font-serif text-lg sm:text-xl font-bold drop-shadow-xs truncate">
                      {cat.name}
                    </h4>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4 sm:p-5 space-y-2">
                  {cat.tagline && (
                    <p className="text-xs font-semibold text-[#8C6542] line-clamp-1">
                      {cat.tagline}
                    </p>
                  )}
                  <p className="text-xs text-[#5C5B57] line-clamp-2">
                    {cat.description || 'No description provided.'}
                  </p>

                  {cat.itemCountText && (
                    <p className="text-[11px] text-[#7A7873] pt-1">
                      <span className="font-bold">Specs:</span> {cat.itemCountText}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="p-3.5 bg-[#FAF9F6] border-t border-[#ECE7DE] flex items-center justify-between gap-2 text-xs">
                {/* Left: View Products */}
                <button
                  type="button"
                  onClick={() => onSelectCategoryForFilter(cat.name)}
                  className="font-bold text-[#8C6542] hover:text-[#1C1C1A] transition-colors cursor-pointer"
                >
                  View Products &rarr;
                </button>

                {/* Right: Add Product, Edit, Delete */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onAddProductForCategory(cat.name)}
                    className="p-1.5 rounded-lg border border-[#D5CEC4] bg-white text-[#1C1C1A] hover:bg-[#F2ECE3] transition-colors"
                    title={`Add product to ${cat.name}`}
                  >
                    <Plus className="w-3.5 h-3.5 text-[#8C6542]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditCategory(cat)}
                    className="p-1.5 rounded-lg border border-[#D5CEC4] bg-white text-[#1C1C1A] hover:bg-[#F2ECE3] transition-colors"
                    title="Edit category details & cover image"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDeleteModal(cat)}
                    className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Deletion Safety Dialog */}
      {categoryToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={handleCloseDeleteModal}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 subtle-shadow border border-[#E8E4DC] text-left animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  productCountInDeletingCat > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-[#1C1C1A]">
                  Delete Category: {categoryToDelete.name}
                </h4>
                <p className="text-xs text-[#6B6A66] mt-0.5">
                  Category deletion safety check
                </p>
              </div>
            </div>

            {/* Error / Success Banners */}
            {deleteError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                {deleteError}
              </div>
            )}
            {deleteSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>{deleteSuccess}</span>
              </div>
            )}

            {/* Body */}
            <div className="mt-4 space-y-4 text-xs sm:text-sm text-[#4A4946]">
              {productCountInDeletingCat === 0 ? (
                <p className="leading-relaxed">
                  Are you sure you want to delete category <strong>"{categoryToDelete.name}"</strong>? This category does not contain any products. The cover photo will be cleaned up from Cloudinary.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
                    <strong>Warning:</strong> This category contains{' '}
                    <span className="font-bold underline">{productCountInDeletingCat} product(s)</span>.
                    What would you like to do with these products?
                  </div>

                  <div className="space-y-3">
                    {/* Option 1: Move products */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        deleteAction === 'move'
                          ? 'border-[#8C6542] bg-[#FAF8F5] ring-1 ring-[#8C6542]'
                          : 'border-[#D5CEC4] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deleteAction"
                        value="move"
                        checked={deleteAction === 'move'}
                        onChange={() => setDeleteAction('move')}
                        disabled={otherCategories.length === 0}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-2">
                        <span className="font-bold text-[#1C1C1A] block">
                          Move products to another category (Recommended)
                        </span>
                        <p className="text-xs text-[#7A7873]">
                          Safely reassigns all {productCountInDeletingCat} products to the destination collection below so no products are lost.
                        </p>

                        {deleteAction === 'move' && (
                          <div className="pt-2">
                            <label className="block text-[11px] font-bold text-[#1C1C1A] uppercase mb-1">
                              Select Destination Category:
                            </label>
                            <select
                              value={targetCategoryId}
                              onChange={(e) => setTargetCategoryId(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-[#D5CEC4] bg-white text-xs font-semibold focus:outline-none focus:border-[#8C6542]"
                            >
                              {otherCategories.map((c) => (
                                <option key={c._id || c.id} value={c._id || c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Option 2: Delete products */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        deleteAction === 'delete_products'
                          ? 'border-red-500 bg-red-50/40 ring-1 ring-red-500'
                          : 'border-[#D5CEC4] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deleteAction"
                        value="delete_products"
                        checked={deleteAction === 'delete_products'}
                        onChange={() => setDeleteAction('delete_products')}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-red-700 block">
                          Delete all {productCountInDeletingCat} products along with this category
                        </span>
                        <p className="text-xs text-red-600/80 mt-0.5">
                          Permanently deletes these products and cleans up all associated Cloudinary photos. This cannot be undone.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#ECE7DE]">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-[#D5CEC4] text-xs font-bold text-[#54534F] hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer disabled:opacity-50 ${
                  deleteAction === 'delete_products' && productCountInDeletingCat > 0
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#8C6542] hover:bg-[#735133]'
                }`}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : productCountInDeletingCat === 0 ? (
                  <span>Delete Category</span>
                ) : deleteAction === 'move' ? (
                  <span>Move Products & Delete Category</span>
                ) : (
                  <span>Delete All Products & Category</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
