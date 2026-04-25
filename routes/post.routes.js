import express from 'express';
import { createPost, deletePost, getAllPost, getPostById, updatePost } from '../controllers/post.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPost);
router.get('/:id', getPostById);
router.post('/create', authenticateToken, authorizeRoles('admin'), createPost);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updatePost);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deletePost);

export default router;
