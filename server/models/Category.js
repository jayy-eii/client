import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    coverImagePublicId: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: 'Available in Store',
    },
    itemCountText: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    displayOrder: {
      type: Number,
      default: 0,
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

// Keep order and displayOrder synchronized
categorySchema.pre('save', function () {
  if (this.displayOrder !== undefined && this.displayOrder !== null && this.displayOrder !== 0) {
    this.order = this.displayOrder;
  } else if (this.order !== undefined && this.order !== null && this.order !== 0) {
    this.displayOrder = this.order;
  }
});

export const Category = mongoose.model('Category', categorySchema);
