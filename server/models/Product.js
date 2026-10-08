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
  if (this.price === null || this.price === undefined) return '';
  return `₹${this.price.toLocaleString('en-IN')}`;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
