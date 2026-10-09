import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    categoryId: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      default: null,
    },
    size: {
      type: String,
      trim: true,
      default: '',
    },
    details: {
      type: Map,
      of: String,
      default: {},
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to format price with INR currency symbol
productSchema.virtual('formattedPrice').get(function () {
  if (this.price === null || this.price === undefined || this.price <= 0) return 'Price on request';
  return `₹${this.price.toLocaleString('en-IN')}`;
});

productSchema.virtual('displayPrice').get(function () {
  if (this.price === null || this.price === undefined || this.price <= 0) return 'Price on request';
  return `₹${this.price.toLocaleString('en-IN')}`;
});

// Auto-generate slug before save if missing or name modified
productSchema.pre('save', function () {
  if (!this.slug || this.isModified('name')) {
    const generatedSlug = (this.name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    this.slug = generatedSlug || `prod-${Date.now()}`;
  }
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
