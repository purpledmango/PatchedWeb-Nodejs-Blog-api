import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import connectToDb from './database/db.js';
import AuthRoutes from './routes/auth.js';
import ArticleRoutes from './routes/article.js';
import KPIRoutes from './routes/kpis.js';
import UserRoutes from './routes/users.js';
import authMiddleware from './middlewares/authMiddleWare.js';
import cookieParser from 'cookie-parser'

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
connectToDb();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.PROD_ORIGIN_HOST : process.env.__filenameDEV_ORIGIN_HOST,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: '8mb' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const JWT_SECRET = process.env.JWT_SECRET

// Routes
app.get('/', (req, res) => {
  res.send('Greetings From Mr. Oadn API');
});

app.use('/auth', AuthRoutes);
app.use('/article', authMiddleware, ArticleRoutes);
app.use('/kpi', KPIRoutes);
app.use('/users', UserRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n 🚀Server Online on PORT-${PORT} 💡`);
});
