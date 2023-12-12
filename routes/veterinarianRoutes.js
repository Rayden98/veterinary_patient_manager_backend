import express from 'express'
const router = express.Router();
import { record, profile, confirm, authenticate, forgetPassword, 
    checkToken, newPassword, updateProfile, updatePassword } from '../controllers/veterinarianController.js'
import checkAuth from '../middleware/authMiddleware.js';

// Public area
router.post('/', record );
router.get('/confirm/:token', confirm);
router.post('/login', authenticate);
router.post('/forget-password', forgetPassword);
router.route("/forget-password/:token").get(checkToken).post(newPassword)
// Private area
router.get('/profile',checkAuth, profile);
router.put('/profile/:id', checkAuth, updateProfile);
router.put('/update-password', checkAuth, updatePassword)

export default router;


