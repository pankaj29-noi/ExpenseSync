import {Router} from 'express';
import { auth } from '../middlewares/auth';
import { handleGetProfile, handleUpdateProfile } from '../controllers/profileController';
import { sanitizer } from '../middlewares/sanitizer';
import { validate } from '../middlewares/validation';
import { updateProfileSchema } from '../schemas/profileSchema';

const router = Router();

router.use(auth);

router.get('/me',handleGetProfile);
router.put('/me',sanitizer,validate(updateProfileSchema),handleUpdateProfile);


export default router;