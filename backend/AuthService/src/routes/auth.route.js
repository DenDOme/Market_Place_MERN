import express from 'express';
import { signup, login, logout, updateProfile, checkAuth, requestPasswordReset, resetPassword, changeRole } from '../controllers/auth.controller.js';
import { protectedRoute, protectedAdminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

router.put('/update-profile', protectedRoute, updateProfile);

router.get('/check-user', protectedRoute, checkAuth);

router.put('/change-role', protectedAdminRoute, changeRole);

export default router;