import { Router, Request, Response, NextFunction } from 'express';
import { signUp, signIn, websiteRegister } from '../controllers/authController';
import {authenticateToken} from "../middleware/authMiddleware";

const router = Router();

// Define routes for sign-up and sign-in
router.post('/sign-up', (req: Request, res: Response, next: NextFunction) => {
    signUp(req, res, next);
});

router.post('/sign-in', (req: Request, res: Response, next: NextFunction) => {
    signIn(req, res, next);
});

router.post('/register-website', authenticateToken,websiteRegister);

export default router;

