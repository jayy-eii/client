import React, { useState, useEffect, useRef } from 'react';
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
  GripVertical,
  ArrowLeft,
  ArrowRight,
  Layers,
} from 'lucide-react';

export default function AdminProductForm({
  productToEdit,
  categories = [],
  onSuccess,
  onCancel,
}) {
  const { authFetch } = useAuth();

  // Extract category names dynamically from database categories
  const categoryNames =
    categories.length > 0
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

  const initialCat =
    (productToEdit && productToEdit.category) ||
    categoryNames[0] ||
    'Curtains';

  const [name, setName] = useState('');
  const [category, setCategory] = useState(initialCat);
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  // Key-value specifications (e.g., "Material": "100% Cotton")
  const [detailsList, setDetailsList] = useState([
    { key: 'Material', value: '' },
    { key: 'Care', value: '' },
  ]);

  // Unified image items array:
  // Array of: { id, type: 'existing' | 'new', url?, public_id?, file?, previewUrl? }
  const [imageItems, setImageItems] = useState([]);

  // Drag and drop state for gallery reordering
  const [draggedImgIndex, setDraggedImgIndex] = useState(null);
  const [dragOverImgIndex, setDragOverImgIndex] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isEditing = Boolean(productToEdit && (productToEdit._id || productToEdit.id));

  // Load existing product data on mount or when productToEdit changes
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategory(productToEdit.category || initialCat);
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

      // Parse details
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
      if (productToEdit.images && Array.isArray(productToEdit.images)) {
        const initialGallery = productToEdit.images.map((img, idx) => ({
          id: `existing_${idx}_${Date.now()}`,
          type: 'existing',
          url: typeof img === 'string' ? img : img.url,
          public_id: typeof img === 'string' ? '' : img.public_id || '',
        }));
        setImageItems(initialGallery);
      } else {
        setImageItems([]);
      }
    } else {
      setCategory(initialCat);
      setImageItems([]);
    }
  }, [productToEdit, categories]);

  // Clean up object URLs when unmounting or removing items
  useEffect(() => {
    return () => {
      imageItems.forEach((item) => {
        if (item.type === 'new' && item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  // Handle adding new files
  const handleFilesSelected = (filesList) => {
    const files = Array.from(filesList || []);
    if (!files.length) return;

    setError('');
    const newItems = [];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const errors = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        errors.push(`"${file.name}" is not an image file (JPEG, PNG, WebP allowed).`);
        continue;
      }
      if (file.size > maxSizeBytes) {
        errors.push(`"${file.name}" exceeds 10MB limit.`);
        continue;
      }

      newItems.push({
        id: `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: 'new',
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (errors.length > 0) {
      setError(errors.join(' '));
    }

    if (newItems.length > 0) {
      setImageItems((prev) => [...prev, ...newItems]);
    }
  };

  const handleFileInputChange = (e) => {
    handleFilesSelected(e.target.files);
    e.target.value = ''; // Reset input so same file can be re-selected if needed
  };

  // Remove individual image
  const handleRemoveImage = (index) => {
    setImageItems((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed && removed.type === 'new' && removed.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return copy;
    });
  };

  // Reordering: Move Left (towards cover position 0)
  const handleMoveLeft = (index) => {
    if (index <= 0) return;
    setImageItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  // Reordering: Move Right
  const handleMoveRight = (index) => {
    if (index >= imageItems.length - 1) return;
    setImageItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  // Reordering: Set as Primary Cover (move directly to position #1)
  const handleMakeCover = (index) => {
    if (index === 0) return;
    setImageItems((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.unshift(item);
      return copy;
    });
  };

  // Gallery Drag & Drop
  const handleDragStart = (e, index) => {
    setDraggedImgIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverImgIndex !== index) {
      setDragOverImgIndex(index);
    }
  };

  const handleDragLeave = (e, index) => {
    if (dragOverImgIndex === index) {
      setDragOverImgIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    setDragOverImgIndex(null);

    if (draggedImgIndex === null || draggedImgIndex === dropIndex) {
      setDraggedImgIndex(null);
      return;
    }

    setImageItems((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(draggedImgIndex, 1);
      copy.splice(dropIndex, 0, item);
      return copy;
    });

    setDraggedImgIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedImgIndex(null);
    setDragOverImgIndex(null);
  };

  // Specifications Key-Value rows
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

  // Submit Handler
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

    if (imageItems.length === 0) {
      setError('Please upload or keep at least one image for this product.');
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

      // Key-value specifications
      const detailsMap = {};
      detailsList.forEach((d) => {
        if (d.key.trim() && d.value.trim()) {
          detailsMap[d.key.trim()] = d.value.trim();
        }
      });
      formData.append('details', JSON.stringify(detailsMap));

      // Construct imageStructure and gather new files in sequence
      const newFiles = [];
      const imageStructure = [];
      let newCounter = 0;

      for (const item of imageItems) {
        if (item.type === 'new') {
          newFiles.push(item.file);
          imageStructure.push({
            type: 'new',
            newIndex: newCounter,
          });
          newCounter++;
        } else {
          imageStructure.push({
            type: 'existing',
            url: item.url,
            public_id: item.public_id || '',
          });
        }
      }

      formData.append('imageStructure', JSON.stringify(imageStructure));

      // Append new files to formData
      newFiles.forEach((file) => {
        formData.append('images', file);
      });

      // Legacy fallback
      const legacyExisting = imageItems
        .filter((i) => i.type === 'existing')
        .map((i) => ({ url: i.url, public_id: i.public_id || '' }));
      formData.append('existingImages', JSON.stringify(legacyExisting));

      const productId = productToEdit?._id || productToEdit?.id;
      const url = isEditing ? `/api/products/${productId}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save product.');
      }

      setSuccessMessage(
        isEditing
          ? `Product "${name}" updated successfully with ${imageItems.length} gallery photos!`
          : `Product "${name}" created successfully with ${imageItems.length} gallery photos!`
      );

      setTimeout(() => {
        if (onSuccess) onSuccess(data.product);
      }, 750);
    } catch (err) {
      console.error('Product save error:', err);
      setError(err.message || 'An error occurred while saving the product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 subtle-shadow text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#F0ECE4] mb-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1C1A]">
            {isEditing ? `Edit Product: ${productToEdit.name}` : 'Add New Product'}
          </h3>
          <p className="text-xs text-[#6B6A66] mt-0.5">
            Manage product details, category collection, and multi-image gallery. Uploads are stored securely on Cloudinary and instantly reflect on the website.
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Alerts */}
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
        
        {/* Basic Info: Name, Category, Price, Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#4A4946] mb-1.5 uppercase tracking-wider">
              Product Name <span className="text-red-500">*</span>
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
              Category Collection <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] font-semibold focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542] cursor-pointer"
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
              placeholder="e.g. 1499 (Leave blank for 'Price on request')"
              min="0"
              step="1"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
            <p className="text-[10px] text-[#7A7873] mt-1">
              Leave empty or 0 if price should display as &ldquo;Price on request&rdquo;.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A4946] mb-1.5 uppercase tracking-wider">
              Size / Dimensions <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. King (108 x 108 in) / 7ft Door"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
          </div>
        </div>

        {/* Short & Detailed Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A4946] mb-1.5 uppercase tracking-wider">
              Short Summary <span className="text-gray-400 font-normal lowercase">(appears on catalog card)</span>
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
              placeholder="Describe fabric weave, feel, room suitability, durability, washing instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] placeholder-[#9E9B95] focus:outline-none focus:border-[#8C6542] focus:ring-1 focus:ring-[#8C6542]"
            />
          </div>
        </div>

        {/* MULTIPLE IMAGES & PRODUCT GALLERY MANAGER */}
        <div className="pt-2 border-t border-[#F0ECE4]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <label className="block text-xs font-bold text-[#4A4946] uppercase tracking-wider">
                Product Gallery Images <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#7A7873]">
                Upload multiple high-resolution photos. Drag or use arrows to rearrange. The <strong>#1 Cover image</strong> is used as the product card thumbnail.
              </p>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F4EFEA] text-[#8C6542] self-start sm:self-auto">
              {imageItems.length} {imageItems.length === 1 ? 'Image' : 'Images'} in Gallery
            </span>
          </div>

          {/* Upload Drop Zone */}
          <div className="relative border-2 border-dashed border-[#D5CEC4] rounded-2xl p-6 text-center hover:border-[#8C6542] hover:bg-[#FAF8F5] transition-all bg-[#FAF9F6] cursor-pointer group mb-4">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-[#E3DBD0] flex items-center justify-center text-[#8C6542] mb-2 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#1C1C1A]">
                Click or drag photographs here to upload
              </p>
              <p className="text-[11px] text-[#7A7873] mt-0.5">
                Select multiple files at once. Supports JPEG, PNG, and WebP (up to 10MB each).
              </p>
            </div>
          </div>

          {/* Unified Gallery Grid (Reorderable with Drag & Drop + Arrow Controls) */}
          {imageItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#7A7873] font-medium">
                <span>Drag photos or use the arrows to reorder. First photo is the primary cover.</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {imageItems.map((item, index) => {
                  const isCover = index === 0;
                  const previewSrc = item.type === 'new' ? item.previewUrl : item.url;
                  const isDragging = draggedImgIndex === index;
                  const isOver = dragOverImgIndex === index;

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={(e) => handleDragLeave(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all bg-[#F5EFEB] subtle-shadow group flex flex-col justify-between ${
                        isDragging
                          ? 'opacity-40 scale-95 border-dashed border-[#8C6542]'
                          : isOver
                          ? 'border-[#8C6542] ring-2 ring-[#8C6542] scale-102'
                          : isCover
                          ? 'border-[#8C6542] ring-1 ring-[#8C6542]/40'
                          : 'border-[#D5CEC4] hover:border-[#8C6542]'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF9F6]">
                        <img
                          src={previewSrc}
                          alt={`Product view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Position Badge & Status */}
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                              isCover
                                ? 'bg-[#8C6542] text-white'
                                : 'bg-black/70 text-white'
                            }`}
                          >
                            #{index + 1} {isCover ? 'Cover' : ''}
                          </span>

                          {item.type === 'new' && (
                            <span className="px-1 py-0.5 rounded bg-blue-600 text-[9px] text-white font-bold">
                              New
                            </span>
                          )}
                        </div>

                        {/* Remove Image Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors shadow-xs cursor-pointer"
                          title="Remove this image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Drag Handle Overlay */}
                        <div
                          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-white text-[10px] gap-1"
                          title="Drag to rearrange"
                        >
                          <GripVertical className="w-3 h-3" />
                          <span>Drag to reorder</span>
                        </div>
                      </div>

                      {/* Card Bottom Controls (Move Left, Make Cover, Move Right) */}
                      <div className="p-1.5 bg-white border-t border-[#ECE7DE] flex items-center justify-between text-xs gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveLeft(index)}
                          disabled={index === 0}
                          className="p-1 rounded bg-[#FAF9F6] border border-[#D5CEC4] text-[#1C1C1A] hover:bg-[#F4EFEA] hover:text-[#8C6542] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                          title="Move left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>

                        {!isCover ? (
                          <button
                            type="button"
                            onClick={() => handleMakeCover(index)}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#F4EFEA] border border-[#E2DAD0] text-[#8C6542] hover:bg-[#8C6542] hover:text-white text-[10px] font-bold transition-colors cursor-pointer"
                            title="Set as primary cover"
                          >
                            <Star className="w-2.5 h-2.5" />
                            <span>Set Cover</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-[#8C6542] flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>Cover</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleMoveRight(index)}
                          disabled={index === imageItems.length - 1}
                          className="p-1 rounded bg-[#FAF9F6] border border-[#D5CEC4] text-[#1C1C1A] hover:bg-[#F4EFEA] hover:text-[#8C6542] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                          title="Move right"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Specifications & Features (Key-Value) */}
        <div className="pt-2 border-t border-[#F0ECE4]">
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
                  className="w-1/3 px-3 py-2 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] focus:outline-none focus:border-[#8C6542]"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 100% Jacquard, Machine Wash)"
                  value={row.value}
                  onChange={(e) => handleDetailChange(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#D5CEC4] bg-[#FAF9F6] text-xs text-[#1C1C1A] focus:outline-none focus:border-[#8C6542]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetailRow(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"
                  title="Remove row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Status & Showcase Visibility Checkboxes */}
        <div className="pt-3 border-t border-[#F0ECE4] flex flex-wrap gap-6 text-xs font-semibold text-[#1C1C1A]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-[#8C6542] focus:ring-[#8C6542] border-[#D5CEC4]"
            />
            <span>In Stock & Available at Bajaria Store</span>
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
              className="px-5 py-2.5 rounded-xl border border-[#D5CEC4] bg-white text-xs font-bold text-[#1C1C1A] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#8C6542] hover:bg-[#735133] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Gallery to Cloudinary & Saving...</span>
              </>
            ) : (
              <span>{isEditing ? 'Save Product Changes' : 'Publish Product'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
