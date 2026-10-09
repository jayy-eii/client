import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryVisibility,
  reorderCategories,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/auth.js';
import { uploadSingleImage } from '../middleware/upload.js';

const router = express.Router();

// Public read routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected admin management routes
router.put('/reorder', protectAdmin, reorderCategories);
router.patch('/reorder', protectAdmin, reorderCategories);
router.post('/', protectAdmin, uploadSingleImage.single('coverImage'), createCategory);
router.put('/:id', protectAdmin, uploadSingleImage.single('coverImage'), updateCategory);
router.patch('/:id/visibility', protectAdmin, toggleCategoryVisibility);
router.delete('/:id', protectAdmin, deleteCategory);

export default router;
