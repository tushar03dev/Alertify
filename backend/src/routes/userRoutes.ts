import {authenticateToken} from "../middleware/authMiddleware";
import {
    getUserProfile
} from "../controllers/userController";
import {Router} from "express";

const router = Router();
// Route to fetch user profile
router.get('/user-profile', authenticateToken, getUserProfile);

export default router;