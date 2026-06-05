import express from 'express';
import { handleGetDashboardStats } from '../controllers/dashboardController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.get('/stats', auth, handleGetDashboardStats);

export default router;