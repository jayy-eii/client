import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AdminCategoryForm({ categoryToEdit, onSuccess, onCancel }) {
  const { authFetch } = useAuth();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('Available in Store');
  const [itemCountText, setItemCountText] = useState('');
  const [order, setOrder] = useState('');
  const [isHidden, setIsHidden] = useState(false);

  // Cover image handling
  const [existingImage, setExistingImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState('');
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isEditing = Boolean(categoryToEdit && (categoryToEdit._id || categoryToEdit.id));

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setSlug(categoryToEdit.slug || '');
      setTagline(categoryToEdit.tagline || '');
      setDescription(categoryToEdit.description || '');
      setBadge(categoryToEdit.badge || 'Available in Store');
      setItemCountText(categoryToEdit.itemCountText || '');
      setOrder(categoryToEdit.order !== undefined ? categoryToEdit.order : '');
      setIsHidden(Boolean(categoryToEdit.isHidden));
      setExistingImage(categoryToEdit.coverImage || '');
      setRemoveExistingImage(false);
    }
  }, [categoryToEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image. Please choose a JPG, PNG, or WebP.');
      return;
    }

    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
    setRemoveExistingImage(false);
    setError('');
  };

  const handleClearNewImage = () => {
    setNewImageFile(null);
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
      setNewImagePreview('');
    }
  };

  const handleRemoveExistingImage = () => {
    setRemoveExistingImage(true);
    setExistingImage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Category Name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      if (slug.trim()) formData.append('slug', slug.trim().toLowerCase());
      formData.append('tagline', tagline.trim());
      formData.append('description', description.trim());
      formData.append('badge', badge.trim());
      formData.append('itemCountText', itemCountText.trim());
      if (order !== '') formData.append('order', order);
      formData.append('isHidden', isHidden ? 'true' : 'false');

      if (newImageFile) {
        formData.append('coverImage', newImageFile);
      } else if (removeExistingImage) {
        formData.append('removeImage', 'true');
      }

      const categoryId = categoryToEdit?._id || categoryToEdit?.id;
      const url = isEditing ? `/api/categories/${categoryId}` : '/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save category');
      }

      setSuccessMessage(
        isEditing
          ? `Category "${name}" updated successfully!`
          : `New category "${name}" created successfully!`
      );

      setTimeout(() => {
        if (onSuccess) onSuccess(data.category);
      }, 700);
    } catch (err) {
      console.error('Category form error:', err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-left">
      <div className="bg-white rounded-2xl border border-[#E8E4DC] subtle-shadow p-6 sm:p-8">
        
        {/* Form Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#ECE7DE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4EFEA] border border-[#E3DBD0] flex items-center justify-center text-[#8C6542]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1C1A]">
                {isEditing ? `Edit Category: ${categoryToEdit.name}` : 'Add New Category'}
              </h3>
              <p className="text-xs text-[#6B6A66] mt-0.5">
                {isEditing
                  ? 'Update collection branding, cover photography, or public visibility.'
                  : 'Create a new collection. Upload its cover photo and start adding products inside it.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-[#7A7873] hover:text-[#1C1C1A] hover:bg-[#F2ECE3] rounded-lg transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3 text-green-800 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Category Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Category Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-1.5">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pillows, Cushions, Blankets"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-sm text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-1.5">
                URL Slug <span className="text-[11px] font-normal text-gray-500">(Auto-generated if empty)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. pillows, sofa-covers"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-sm text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-1.5">
              Tagline <span className="text-[11px] font-normal text-gray-500">(Short 1-line summary)</span>
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Memory foam, plush microfiber & bolster pillow collection"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-sm text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed overview shown when customers view this collection..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-sm text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
          </div>

          {/* Badge & Item Count / Dimensions Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-1.5">
                Card Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Available in Store, Trending, Premium"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-sm text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-1.5">
                Item Count / Specs Hint
              </label>
              <input
                type="text"
                value={itemCountText}
                onChange={(e) => setItemCountText(e.target.value)}
                placeholder="e.g. Standard, King & Neck-Support fits in store"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-sm text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
              />
            </div>
          </div>

          {/* Order & Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1, 2, 3..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-sm text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-1.5">
                Public Visibility
              </label>
              <button
                type="button"
                onClick={() => setIsHidden(!isHidden)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  isHidden
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-green-50 border-green-300 text-green-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isHidden ? (
                    <EyeOff className="w-4 h-4 text-amber-700" />
                  ) : (
                    <Eye className="w-4 h-4 text-green-700" />
                  )}
                  <span>{isHidden ? 'Hidden from Customers' : 'Visible on Public Website'}</span>
                </div>
                <span className="text-xs uppercase font-bold underline">
                  {isHidden ? 'Hidden' : 'Visible'}
                </span>
              </button>
            </div>
          </div>

          {/* Cover Image Upload Area */}
          <div className="pt-2 border-t border-[#ECE7DE]">
            <label className="block text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-1.5">
              Category Cover Image
            </label>
            <p className="text-xs text-[#7A7873] mb-3">
              This photo is displayed on the category collection card and banner. Uploaded securely to Cloudinary.
            </p>

            {/* Current or New Image Preview */}
            {(newImagePreview || (existingImage && !removeExistingImage)) ? (
              <div className="relative aspect-[16/9] w-full max-w-md rounded-2xl overflow-hidden border border-[#D5CEC4] bg-[#F2EDE6] group mb-4">
                <img
                  src={newImagePreview || existingImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label
                    htmlFor="replace-category-image"
                    className="px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-[#1C1C1A] cursor-pointer hover:bg-[#FAF9F6]"
                  >
                    Change Image
                  </label>
                  <button
                    type="button"
                    onClick={newImagePreview ? handleClearNewImage : handleRemoveExistingImage}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Remove Image
                  </button>
                </div>
                <input
                  id="replace-category-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <label
                htmlFor="category-image-upload"
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#D5CEC4] rounded-2xl bg-[#FAF9F6] hover:bg-[#F4EFEA] hover:border-[#8C6542] cursor-pointer transition-all text-center"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-[#ECE7DE] flex items-center justify-center text-[#8C6542] mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#1C1C1A]">
                  Click or drag photo to upload category cover
                </p>
                <p className="text-xs text-[#7A7873] mt-1">
                  Supports JPG, PNG, WebP (up to 10MB)
                </p>
                <input
                  id="category-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECE7DE]">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-[#D5CEC4] text-xs font-bold text-[#54534F] hover:bg-[#FAF9F6] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8C6542] hover:bg-[#735133] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Cloudinary & Database...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Category Changes' : 'Create Category'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
