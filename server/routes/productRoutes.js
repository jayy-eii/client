import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  toggleProductVisibility,
  getAdminStats,
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/auth.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = express.Router();

// Public read routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected admin management routes
router.get('/admin/stats', protectAdmin, getAdminStats);
router.post('/', protectAdmin, uploadProductImages.array('images', 10), createProduct);
router.put('/:id', protectAdmin, uploadProductImages.array('images', 10), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);
router.patch('/:id/status', protectAdmin, toggleProductStatus);
router.patch('/:id/visibility', protectAdmin, toggleProductVisibility);

export default router;
