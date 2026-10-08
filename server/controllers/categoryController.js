import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

/**
 * @desc Get categories (Public: visible only; Admin: all with ?all=true)
 * @route GET /api/categories
 */
export const getCategories = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = {};
    if (all !== 'true') {
      filter.isHidden = { $ne: true };
    }

    const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });

    // Attach dynamic product counts (visible & total)
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const visibleCount = await Product.countDocuments({
          $or: [
            { categoryId: cat.slug },
            { category: new RegExp(`^${cat.name}$`, 'i') },
          ],
          isHidden: false,
        });

        const totalCount = await Product.countDocuments({
          $or: [
            { categoryId: cat.slug },
            { category: new RegExp(`^${cat.name}$`, 'i') },
          ],
        });

        return {
          ...cat.toObject(),
          productCount: visibleCount,
          totalProductCount: totalCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error('[Categories Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
};

/**
 * @desc Get single category by ID
 * @route GET /api/categories/:id
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const visibleCount = await Product.countDocuments({
      $or: [
        { categoryId: category.slug },
        { category: new RegExp(`^${category.name}$`, 'i') },
      ],
      isHidden: false,
    });

    const totalCount = await Product.countDocuments({
      $or: [
        { categoryId: category.slug },
        { category: new RegExp(`^${category.name}$`, 'i') },
      ],
    });

    return res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        productCount: visibleCount,
        totalProductCount: totalCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
    });
  }
};

/**
 * @desc Create a new category
 * @route POST /api/categories
 * @access Private (Admin)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, tagline, description, badge, itemCountText, order, isHidden } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const trimmedName = name.trim();
    const slug = req.body.slug
      ? req.body.slug.trim().toLowerCase()
      : trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check duplicate
    const existing = await Category.findOne({
      $or: [
        { name: new RegExp(`^${trimmedName}$`, 'i') },
        { slug },
      ],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A category with the name "${trimmedName}" or slug "${slug}" already exists`,
      });
    }

    let coverImage = req.body.coverImage || '';
    let coverImagePublicId = '';

    // If image file uploaded via Multer
    if (req.file) {
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'yash_cloth_stores/categories');
      coverImage = uploadRes.url;
      coverImagePublicId = uploadRes.public_id;
    }

    const totalCount = await Category.countDocuments();

    const category = new Category({
      name: trimmedName,
      slug,
      tagline: tagline ? tagline.trim() : '',
      description: description ? description.trim() : '',
      coverImage,
      coverImagePublicId,
      badge: badge ? badge.trim() : 'Available in Store',
      itemCountText: itemCountText ? itemCountText.trim() : '',
      order: order !== undefined && order !== '' ? Number(order) : totalCount + 1,
      isHidden: isHidden === 'true' || isHidden === true,
    });

    const savedCategory = await category.save();

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: {
        ...savedCategory.toObject(),
        productCount: 0,
        totalProductCount: 0,
      },
    });
  } catch (error) {
    console.error('[Create Category Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category',
    });
  }
};

/**
 * @desc Update category details and image
 * @route PUT /api/categories/:id
 * @access Private (Admin)
 */
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const {
      name,
      slug,
      tagline,
      description,
      badge,
      itemCountText,
      order,
      isHidden,
      removeImage,
    } = req.body;

    const oldName = category.name;
    const oldSlug = category.slug;

    if (name && name.trim()) {
      const trimmedName = name.trim();
      if (trimmedName.toLowerCase() !== oldName.toLowerCase()) {
        const duplicate = await Category.findOne({
          _id: { $ne: category._id },
          name: new RegExp(`^${trimmedName}$`, 'i'),
        });
        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: `Another category named "${trimmedName}" already exists`,
          });
        }
      }
      category.name = trimmedName;

      // Update slug if specified or sync with new name
      if (slug && slug.trim()) {
        category.slug = slug.trim().toLowerCase();
      } else if (trimmedName.toLowerCase() !== oldName.toLowerCase()) {
        category.slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      // Keep products in sync with updated category name & slug
      if (category.name !== oldName || category.slug !== oldSlug) {
        await Product.updateMany(
          {
            $or: [
              { categoryId: oldSlug },
              { category: new RegExp(`^${oldName}$`, 'i') },
            ],
          },
          {
            $set: {
              category: category.name,
              categoryId: category.slug,
            },
          }
        );
      }
    }

    if (tagline !== undefined) category.tagline = tagline.trim();
    if (description !== undefined) category.description = description.trim();
    if (badge !== undefined) category.badge = badge.trim();
    if (itemCountText !== undefined) category.itemCountText = itemCountText.trim();
    if (order !== undefined && order !== '') category.order = Number(order);
    if (isHidden !== undefined) category.isHidden = isHidden === 'true' || isHidden === true;

    // Handle Image Replacement / Removal
    if (req.file) {
      // Remove old image from Cloudinary if present
      if (category.coverImagePublicId) {
        await deleteFromCloudinary(category.coverImagePublicId);
      }
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'yash_cloth_stores/categories');
      category.coverImage = uploadRes.url;
      category.coverImagePublicId = uploadRes.public_id;
    } else if (removeImage === 'true' || removeImage === true) {
      if (category.coverImagePublicId) {
        await deleteFromCloudinary(category.coverImagePublicId);
      }
      category.coverImage = '';
      category.coverImagePublicId = '';
    } else if (req.body.coverImage !== undefined && req.body.coverImage !== '') {
      category.coverImage = req.body.coverImage;
    }

    const updatedCategory = await category.save();

    const visibleCount = await Product.countDocuments({
      $or: [
        { categoryId: updatedCategory.slug },
        { category: new RegExp(`^${updatedCategory.name}$`, 'i') },
      ],
      isHidden: false,
    });

    const totalCount = await Product.countDocuments({
      $or: [
        { categoryId: updatedCategory.slug },
        { category: new RegExp(`^${updatedCategory.name}$`, 'i') },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: {
        ...updatedCategory.toObject(),
        productCount: visibleCount,
        totalProductCount: totalCount,
      },
    });
  } catch (error) {
    console.error('[Update Category Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update category',
    });
  }
};

/**
 * @desc Delete category with safety checks for contained products
 * @route DELETE /api/categories/:id
 * @access Private (Admin)
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Find all products currently belonging to this category
    const associatedProducts = await Product.find({
      $or: [
        { categoryId: category.slug },
        { category: new RegExp(`^${category.name}$`, 'i') },
      ],
    });

    const productCount = associatedProducts.length;
    const { action, targetCategoryId } = req.body || {};

    // Safety gate: If products exist and no explicit action was specified
    if (productCount > 0 && !action) {
      return res.status(400).json({
        success: false,
        requiresAction: true,
        productCount,
        categoryName: category.name,
        message: `This category contains ${productCount} products. Choose an action: move to another category or delete products.`,
      });
    }

    // Handle Option 1: Move products to another category
    if (productCount > 0 && action === 'move') {
      if (!targetCategoryId) {
        return res.status(400).json({
          success: false,
          message: 'Target category is required when moving products',
        });
      }

      const targetCategory = await Category.findById(targetCategoryId);
      if (!targetCategory || targetCategory._id.toString() === category._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid destination category selected',
        });
      }

      // Reassign all products
      await Product.updateMany(
        {
          $or: [
            { categoryId: category.slug },
            { category: new RegExp(`^${category.name}$`, 'i') },
          ],
        },
        {
          $set: {
            category: targetCategory.name,
            categoryId: targetCategory.slug,
          },
        }
      );
    } else if (productCount > 0 && action === 'delete_products') {
      // Handle Option 2: Delete products along with category
      for (const prod of associatedProducts) {
        if (prod.images && prod.images.length > 0) {
          for (const img of prod.images) {
            if (img.public_id) {
              await deleteFromCloudinary(img.public_id);
            }
          }
        }
      }

      await Product.deleteMany({
        $or: [
          { categoryId: category.slug },
          { category: new RegExp(`^${category.name}$`, 'i') },
        ],
      });
    }

    // Clean up category cover image from Cloudinary
    if (category.coverImagePublicId) {
      await deleteFromCloudinary(category.coverImagePublicId);
    }

    await Category.findByIdAndDelete(category._id);

    return res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (error) {
    console.error('[Delete Category Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete category',
    });
  }
};

/**
 * @desc Quick toggle category visibility (Show/Hide)
 * @route PATCH /api/categories/:id/visibility
 * @access Private (Admin)
 */
export const toggleCategoryVisibility = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    category.isHidden = !category.isHidden;
    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category is now ${category.isHidden ? 'Hidden' : 'Visible'}`,
      isHidden: category.isHidden,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update category visibility',
    });
  }
};
