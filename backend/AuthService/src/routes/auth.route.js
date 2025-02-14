import express from 'express';
import { signup, login, logout, updateProfile, checkAuth, requestPasswordReset, resetPassword, changeRole } from '../controllers/auth.controller.js';
import { protectedRoute, protectedAdminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/users', signup); 
router.post('/sessions', login); 
router.delete('/sessions', logout);

router.post('/password/reset-request', requestPasswordReset); 
router.post('/password/reset', resetPassword);

router.put('/profile', protectedRoute, updateProfile);

router.put('/users/:id/role', protectedAdminRoute, changeRole);

router.get('/check-user', protectedRoute, checkAuth);

export default router;