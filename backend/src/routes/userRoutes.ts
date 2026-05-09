import { Router } from 'express';
import { saveCollege, unsaveCollege, getSavedColleges } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.get('/saved', getSavedColleges);
router.post('/saved', saveCollege);
router.delete('/saved/:collegeId', unsaveCollege);

export default router;
