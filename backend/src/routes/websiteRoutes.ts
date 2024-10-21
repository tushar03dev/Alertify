import {authenticateToken} from "../middleware/authMiddleware";
import {
    deleteAllTrends,
    deleteWebsite,
    logWebsiteInfo,
    updateWebsite,
    websiteRegister
} from "../controllers/websiteController";
import {Router} from "express";

const router = Router();

router.post('/register-website', authenticateToken,websiteRegister);

router.get('/website-info',authenticateToken,logWebsiteInfo);

router.put('/update-website', authenticateToken,updateWebsite);

router.delete('/delete-website', authenticateToken,deleteWebsite);

router.delete('/delete-trends', authenticateToken,deleteAllTrends);

export default router;

