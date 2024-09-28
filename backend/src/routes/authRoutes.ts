import { Router, Request, Response, NextFunction } from 'express';
import { signUp, signIn } from '../controllers/authController';

const router = Router();

// Define routes for sign-up and sign-in
router.post('/sign-up', (req: Request, res: Response, next: NextFunction) => {
    signUp(req, res, next);
});

router.post('/sign-in', (req: Request, res: Response, next: NextFunction) => {
    signIn(req, res, next);
});

export default router;

