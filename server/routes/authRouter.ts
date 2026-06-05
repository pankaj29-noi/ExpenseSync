import {Router} from 'express'
import { handleLogin,handleRegiter,handleLogout, handleChangePassword } from '../controllers/authController';
import {validate} from '../middlewares/validation'
import {sanitizer} from '../middlewares/sanitizer'
import {regiterSchema,loginSchema, changePasswordSchema} from '../schemas/authSchema';
import { auth } from '../middlewares/auth';

const router = Router();


router.post('/register',sanitizer,validate(regiterSchema),handleRegiter);
router.post('/login',sanitizer,validate(loginSchema),handleLogin);
router.post('/logout',auth,handleLogout);
router.put('/change-Password',auth,sanitizer,validate(changePasswordSchema),handleChangePassword);


export default router;
