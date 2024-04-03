import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDb from './src/database/db.js';
import AuthRoutes from './src/routes/auth.js';
import ArticleRoutes from './src/routes/article.js';
import KPIRoutes from './src/routes/kpis.js';
import UserRoutes from './src/routes/users.js';
import authMiddleware from './src/middlewares/authMiddleWare.js';
import clientRoutes from "./src/routes/client.js"
import cookieParser from 'cookie-parser'

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();


const app = express();

connectToDb();

// MIDDLEWARES
app.use(cookieParser());
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? [process.env.ADMIN_CLIENT_HOST, process.env.APP_CLIENT_HOST] : process.env.DEV_ORIGIN_HOST,
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: true, limit: '8mb' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const JWT_SECRET = process.env.JWT_SECRET

// ROUTES
app.get('/', (req, res) => {
  res.send('Greetings From Patched Web API');
});

app.use('/auth', AuthRoutes);
app.use('/article', authMiddleware, ArticleRoutes);
app.use('/kpi', KPIRoutes);
app.use('/users', UserRoutes);
app.use('/client', clientRoutes)

// SERVER STATUS

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n 🚀Server Online on PORT-${PORT} 💡`);
});
