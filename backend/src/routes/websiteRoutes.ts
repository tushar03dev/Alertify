import {authenticateToken} from "../middleware/authMiddleware";
import {
    deleteAllTrends,
    deleteWebsite,
    logWebsiteInfo,
    updateWebsite,
    websiteRegister,
    getUserWebsites
} from "../controllers/websiteController";
import {Router} from "express";

const router = Router();

router.get('/website-info',authenticateToken,logWebsiteInfo);

router.post('/register-website', authenticateToken,websiteRegister);

router.put('/update-website', authenticateToken,updateWebsite);

router.delete('/delete-website', authenticateToken,deleteWebsite);

router.delete('/delete-trends', authenticateToken,deleteAllTrends);

router.get('/websites', authenticateToken, getUserWebsites);
export default router;