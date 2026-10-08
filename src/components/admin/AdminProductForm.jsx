import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Upload,
  X,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Star,
} from 'lucide-react';

export default function AdminProductForm({ productToEdit, categories = [], onSuccess, onCancel }) {
  const { authFetch } = useAuth();

  // Extract category names dynamically from database categories
  const categoryNames = categories.length > 0
    ? categories.map((c) => c.name)
    : [
        'Doormats',
        'Bedsheets',
        'Comforters',
        'Blankets',
        'Towels & Napkins',
        'Carpets',
        'Curtains',
        'Sofa Covers',
        'Floor Mats',
      ];

  const defaultCategory =
    (productToEdit && productToEdit.category) ||
    categoryNames[0] ||
    'Curtains';

  const [name, setName] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  // Key-value details (e.g., "Material": "100% Cotton")
  const [detailsList, setDetailsList] = useState([
    { key: 'Material', value: '' },
    { key: 'Care', value: '' },
  ]);

  // Existing images (when editing)
  const [existingImages, setExistingImages] = useState([]);
  // Newly selected files to upload
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategory(productToEdit.category || defaultCategory);
      setPrice(
        productToEdit.price !== null && productToEdit.price !== undefined
          ? productToEdit.price
          : ''
      );
      setSize(productToEdit.size || '');
      setShortDescription(productToEdit.shortDescription || '');
      setDescription(productToEdit.description || '');
      setAvailable(productToEdit.available !== undefined ? productToEdit.available : true);
      setIsHidden(Boolean(productToEdit.isHidden));

      // Convert details Map/object to array
      if (productToEdit.details) {
        const detailsObj =
          typeof productToEdit.details === 'object' && !(productToEdit.details instanceof Map)
            ? productToEdit.details
            : Object.fromEntries(productToEdit.details);
        const arr = Object.entries(detailsObj).map(([k, v]) => ({
          key: k,
          value: v,
        }));
        setDetailsList(arr.length > 0 ? arr : [{ key: 'Material', value: '' }]);
      }

      // Existing images
      if (productToEdit.images) {
        setExistingImages(
          productToEdit.images.map((img) =>
            typeof img === 'string' ? { url: img, public_id: '' } : img
          )
        );
      }
    } else {
      setCategory(defaultCategory);
    }
  }, [productToEdit, categories]);

  // Handle file picker selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length < files.length) {
      setError('Some files were skipped because they are not valid images.');
    } else {
      setError('');
    }

    setNewImageFiles((prev) => [...prev, ...validFiles]);

    // Generate previews
    const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMakeCoverExistingImage = (index) => {
    if (index === 0) return;
    setExistingImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.unshift(item);
      return copy;
    });
  };

  const handleAddDetailRow = () => {
    setDetailsList((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleDetailChange = (index, field, val) => {
    setDetailsList((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  const handleRemoveDetailRow = (index) => {
    setDetailsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }

    if (!category.trim()) {
      setError('Please select a category.');
      return;
    }

    // Require at least one image (either existing or new)
    if (existingImages.length === 0 && newImageFiles.length === 0) {
      setError('Please upload or keep at least one image for the product.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('category', category.trim());
      formData.append('price', price !== '' ? price : '');
      formData.append('size', size.trim());
      formData.append('shortDescription', shortDescription.trim());
      formData.append('description', description.trim());
      formData.append('available', available ? 'true' : 'false');
      formData.append('isHidden', isHidden ? 'true' : 'false');

      // Details Map
      const detailsMap = {};
      detailsList.forEach((d) => {
        if (d.key.trim() && d.value.trim()) {
          detailsMap[d.key.trim()] = d.value.trim();
        }
      });
      formData.append('details', JSON.stringify(detailsMap));

      // Existing images to retain
      formData.append('existingImages', JSON.stringify(existingImages));

      // Append new files
      newImageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const productId = productToEdit?._id || productToEdit?.id;
      const url = productToEdit && productId ? `/api/products/${productId}` : '/api/products';
      const method = productToEdit && productId ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save product.');
      }

      setSuccessMessage(
        productToEdit && productId
          ? 'Product updated successfully!'
          : 'Product published successfully!'
      );

      setTimeout(() => {
        if (onSuccess) onSuccess(data.product);
      }, 700);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 subtle-shadow text-left max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-5 border-b border-[#F0ECE4] mb-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1C1A]">
            {productToEdit && (productToEdit._id || productToEdit.id) ? 'Edit Product' : 'Add New Product'}
          </h3>
          <p className="text-xs text-[#6B6A66] mt-0.5">
            Fill in the details below. Images will be securely stored on Cloudinary and automatically appear on the website.
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#4A4946] mb-1.5 uppercase tracking-wider">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Blue Damask Jacquard Eyelet Curtains"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A4946] mb-1.5 uppercase tracking-wider">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            >
              {categoryNames.map((catName) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A4946] mb-1.5 uppercase tracking-wider">
              Price (₹) <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1499"
              min="0"
              step="1"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A4946] mb-1.5 uppercase tracking-wider">
              Size / Dimensions <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. Window (5ft), Door (7ft) & Long Door (9ft)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
          </div>
        </div>

        {/* Short & Full Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A4946] mb-1.5 uppercase tracking-wider">
              Short Summary <span className="text-gray-400 font-normal lowercase">(appears on product card)</span>
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. Rich slate-navy jacquard drape with intricate silver damask weave"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A4946] mb-1.5 uppercase tracking-wider">
              Detailed Product Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe fabric weave, feel, room suitability, durability, and special features..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
          </div>
        </div>

        {/* Image Upload Area */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-[#4A4946] mb-1 uppercase tracking-wider">
            Product Images * <span className="text-gray-400 font-normal lowercase">(Multiple images supported)</span>
          </label>
          <p className="text-xs text-[#7A7873] mb-3">
            Add or remove individual photographs. The first image will be used as the primary catalog cover.
          </p>

          {/* Upload Drop Zone */}
          <div className="relative border-2 border-dashed border-[#D5CEC4] rounded-2xl p-6 text-center hover:border-[#8C6542] transition-colors bg-[#FAF9F6]">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center pointer-events-none">
              <Upload className="w-8 h-8 text-[#8C6542] mb-2" />
              <p className="text-xs font-bold text-[#1C1C1A]">
                Click or drag photos here to upload
              </p>
              <p className="text-[11px] text-[#7A7873] mt-1">
                JPEG, PNG, or WebP up to 10MB each. High-resolution photos are stored securely on Cloudinary.
              </p>
            </div>
          </div>

          {/* Existing Images Thumbnails (when editing) */}
          {existingImages.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-bold text-[#6B6A66] uppercase mb-2">
                Existing Photos ({existingImages.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#D5CEC4] group bg-[#F5EFEB] shadow-2xs"
                  >
                    <img
                      src={img.url}
                      alt={`Product view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#8C6542] text-white text-[9px] font-bold uppercase">
                        Cover
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMakeCoverExistingImage(idx)}
                          className="p-1.5 rounded-lg bg-white/90 text-[#1C1C1A] hover:bg-white text-[10px] font-bold"
                          title="Make Cover"
                        >
                          <Star className="w-3 h-3 text-[#8C6542]" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Previews */}
          {newImagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-bold text-[#8C6542] uppercase mb-2">
                New Photos to Upload ({newImagePreviews.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {newImagePreviews.map((previewUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#8C6542] group bg-[#F5EFEB] shadow-2xs"
                  >
                    <img
                      src={previewUrl}
                      alt={`New preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                      title="Cancel file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Specifications / Details (Key-Value) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-[#4A4946] uppercase tracking-wider">
              Optional Specifications & Features
            </label>
            <button
              type="button"
              onClick={handleAddDetailRow}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8C6542] hover:text-[#1C1C1A] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specification</span>
            </button>
          </div>

          <div className="space-y-2">
            {detailsList.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Field (e.g. Fabric, Care, Header)"
                  value={row.key}
                  onChange={(e) => handleDetailChange(idx, 'key', e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A]"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 100% Jacquard, Machine Wash)"
                  value={row.value}
                  onChange={(e) => handleDetailChange(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetailRow(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status Checkboxes */}
        <div className="pt-3 border-t border-[#F0ECE4] flex flex-wrap gap-6 text-xs font-semibold text-[#1C1C1A]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-[#8C6542] focus:ring-[#8C6542] border-[#D5CEC4]"
            />
            <span>In Stock & Available in Store</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-gray-600">
            <input
              type="checkbox"
              checked={isHidden}
              onChange={(e) => setIsHidden(e.target.checked)}
              className="w-4 h-4 rounded text-gray-600 focus:ring-gray-600 border-[#D5CEC4]"
            />
            <span>Hide from Customer Showcase (Draft)</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-[#D5CEC4] bg-white text-xs font-bold text-[#1C1C1A] hover:bg-[#FAF9F6]"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#8C6542] hover:bg-[#735133] text-white text-xs font-bold transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to Cloudinary & Saving...</span>
              </>
            ) : (
              <span>{productToEdit && (productToEdit._id || productToEdit.id) ? 'Save Product Changes' : 'Publish Product'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
