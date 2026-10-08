import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

/**
 * @desc Get all products (Public: only visible; Admin: all with ?all=true)
 * @route GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const { category, search, all } = req.query;
    const filter = {};

    // Customer website only sees visible products unless admin specifies ?all=true
    if (all !== 'true') {
      filter.isHidden = false;

      // Also exclude products belonging to hidden categories
      const hiddenCats = await Category.find({ isHidden: true }).select('name slug');
      if (hiddenCats.length > 0) {
        const hiddenSlugs = hiddenCats.map((c) => c.slug);
        const hiddenNames = hiddenCats.map((c) => c.name);
        filter.categoryId = { $nin: hiddenSlugs };
        filter.category = { $nin: hiddenNames };
      }
    }

    if (category && category !== 'all') {
      // Match either category name or categoryId slug
      filter.$or = [
        { category: new RegExp(`^${category}$`, 'i') },
        { categoryId: category.toLowerCase() },
      ];
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('[Get Products Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

/**
 * @desc Get single product by ID
 * @route GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product details',
    });
  }
};

/**
 * @desc Create new product with Cloudinary image uploads
 * @route POST /api/products
 * @access Private (Admin)
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      categoryId,
      shortDescription,
      description,
      price,
      size,
      details,
      tags,
      available,
      isHidden,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product category is required',
      });
    }

    // Upload files to Cloudinary
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadRes = await uploadBufferToCloudinary(file.buffer);
        uploadedImages.push({
          url: uploadRes.url,
          public_id: uploadRes.public_id,
        });
      }
    }

    // Support pre-existing image URLs if passed as JSON string or array
    if (req.body.existingImages) {
      try {
        const existing =
          typeof req.body.existingImages === 'string'
            ? JSON.parse(req.body.existingImages)
            : req.body.existingImages;
        if (Array.isArray(existing)) {
          existing.forEach((img) => {
            if (typeof img === 'string') {
              uploadedImages.push({ url: img, public_id: '' });
            } else if (img && img.url) {
              uploadedImages.push(img);
            }
          });
        }
      } catch (e) {
        console.warn('Could not parse existingImages:', e.message);
      }
    }

    // Parse details map if passed as string
    let parsedDetails = {};
    if (details) {
      if (typeof details === 'string') {
        try {
          parsedDetails = JSON.parse(details);
        } catch {
          parsedDetails = {};
        }
      } else {
        parsedDetails = details;
      }
    }

    // Parse tags array
    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch {
          parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
    }

    // Resolve Category accurately against Category collection
    let resolvedCategoryId = categoryId;
    let resolvedCategoryName = category.trim();
    const catDoc = await Category.findOne({
      $or: [
        { name: new RegExp(`^${resolvedCategoryName}$`, 'i') },
        { slug: resolvedCategoryName.toLowerCase() },
      ],
    });
    if (catDoc) {
      resolvedCategoryId = catDoc.slug;
      resolvedCategoryName = catDoc.name;
    } else if (!resolvedCategoryId) {
      resolvedCategoryId = resolvedCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const newProduct = new Product({
      name: name.trim(),
      category: resolvedCategoryName,
      categoryId: resolvedCategoryId,
      shortDescription: shortDescription ? shortDescription.trim() : '',
      description: description ? description.trim() : '',
      price: price !== undefined && price !== '' && !isNaN(Number(price)) ? Number(price) : null,
      size: size ? size.trim() : '',
      details: parsedDetails,
      images: uploadedImages,
      tags: parsedTags,
      available: available === undefined ? true : available === 'true' || available === true,
      isHidden: isHidden === 'true' || isHidden === true,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    console.error('[Create Product Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

/**
 * @desc Update product details and images
 * @route PUT /api/products/:id
 * @access Private (Admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      name,
      category,
      categoryId,
      shortDescription,
      description,
      price,
      size,
      details,
      tags,
      available,
      isHidden,
    } = req.body;

    if (name) product.name = name.trim();
    if (category) {
      let resolvedCategoryName = category.trim();
      let resolvedCategoryId = categoryId;
      const catDoc = await Category.findOne({
        $or: [
          { name: new RegExp(`^${resolvedCategoryName}$`, 'i') },
          { slug: resolvedCategoryName.toLowerCase() },
        ],
      });
      if (catDoc) {
        resolvedCategoryId = catDoc.slug;
        resolvedCategoryName = catDoc.name;
      } else if (!resolvedCategoryId) {
        resolvedCategoryId = resolvedCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      product.category = resolvedCategoryName;
      product.categoryId = resolvedCategoryId;
    }
    if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
    if (description !== undefined) product.description = description.trim();
    if (size !== undefined) product.size = size.trim();

    if (price !== undefined) {
      product.price = price === '' || price === null || isNaN(Number(price)) ? null : Number(price);
    }

    if (available !== undefined) {
      product.available = available === 'true' || available === true;
    }

    if (isHidden !== undefined) {
      product.isHidden = isHidden === 'true' || isHidden === true;
    }

    if (details) {
      try {
        product.details = typeof details === 'string' ? JSON.parse(details) : details;
      } catch {
        // preserve
      }
    }

    if (tags) {
      if (Array.isArray(tags)) {
        product.tags = tags;
      } else if (typeof tags === 'string') {
        try {
          product.tags = JSON.parse(tags);
        } catch {
          product.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
    }

    // Keep existing images list as sent by client (allows client to delete specific images)
    let keptImages = [];
    if (req.body.existingImages) {
      try {
        const parsed =
          typeof req.body.existingImages === 'string'
            ? JSON.parse(req.body.existingImages)
            : req.body.existingImages;
        if (Array.isArray(parsed)) {
          keptImages = parsed.map((img) =>
            typeof img === 'string' ? { url: img, public_id: '' } : img
          );
        }
      } catch (e) {
        keptImages = product.images;
      }
    } else {
      keptImages = product.images;
    }

    // Find images that were removed and clean them from Cloudinary
    const keptPublicIds = keptImages.map((i) => i.public_id).filter(Boolean);
    for (const oldImg of product.images) {
      if (oldImg.public_id && !keptPublicIds.includes(oldImg.public_id)) {
        await deleteFromCloudinary(oldImg.public_id);
      }
    }

    // Upload newly added files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadRes = await uploadBufferToCloudinary(file.buffer);
        keptImages.push({
          url: uploadRes.url,
          public_id: uploadRes.public_id,
        });
      }
    }

    product.images = keptImages;

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('[Update Product Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

/**
 * @desc Delete product and its Cloudinary images
 * @route DELETE /api/products/:id
 * @access Private (Admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Clean up Cloudinary images
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await deleteFromCloudinary(img.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('[Delete Product Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
};

/**
 * @desc Quick toggle availability status (In Stock vs Out of Stock)
 * @route PATCH /api/products/:id/status
 * @access Private (Admin)
 */
export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.available = !product.available;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product marked as ${product.available ? 'In Stock' : 'Out of Stock'}`,
      available: product.available,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update stock status',
    });
  }
};

/**
 * @desc Quick toggle visibility (Visible vs Hidden from customers)
 * @route PATCH /api/products/:id/visibility
 * @access Private (Admin)
 */
export const toggleProductVisibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.isHidden = !product.isHidden;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product is now ${product.isHidden ? 'Hidden' : 'Visible'}`,
      isHidden: product.isHidden,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update visibility',
    });
  }
};

/**
 * @desc Get overview statistics for Admin Dashboard
 * @route GET /api/products/stats
 * @access Private (Admin)
 */
export const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ available: true, isHidden: false });
    const outOfStockProducts = await Product.countDocuments({ available: false });
    const hiddenProducts = await Product.countDocuments({ isHidden: true });
    const totalCategories = await Category.countDocuments();
    const visibleCategories = await Category.countDocuments({ isHidden: { $ne: true } });
    const hiddenCategories = await Category.countDocuments({ isHidden: true });

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        availableProducts,
        outOfStockProducts,
        hiddenProducts,
        totalCategories: totalCategories || 9,
        visibleCategories,
        hiddenCategories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve stats',
    });
  }
};
