import express, { Request, Response} from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import authRoutes from './routes/authRouter'; 
import profileRoutes from './routes/profileRouter';
import groupRoutes from './routes/groupRoutes';
import expenseRoutes from './routes/expenseRouter';
import settlementRoutes from './routes/settlementRoutes';
import dashboardRoutes from './routes/dashboardRouter';

config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.CLIENT_URL ,
  credentials: true,
}));


app.use(morgan('dev'));
app.use(helmet());
app.use(hpp());


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


import {optionalAuth} from './middlewares/optionalAuth'
import {rateLimiterMiddleware} from './middlewares/rateLimiter'

app.use('/api',optionalAuth);
app.use('/api', rateLimiterMiddleware);


app.use('/api/auth', authRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/groups',groupRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/settlements',settlementRoutes);
app.use('/api/dashboard',dashboardRoutes);

import cacheRoutes from './routes/cacheRouter';
app.use('/api/cache', cacheRoutes);


app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'ExpenseSync API is running!',
    status: 'Healthy',
    timestamp: new Date().toISOString()
  });
});


app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "ExpenseSync backend is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
  });
});



app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
