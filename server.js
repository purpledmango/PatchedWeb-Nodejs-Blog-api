import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import connectToDb from './database/db.js';
import AuthRoutes from './routes/auth.js';
import ArticleRoutes from './routes/article.js';
import authMiddleware from './middlewares/authMiddleWare.js';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
connectToDb();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const store = new MongoDBStore(session)({
  uri: process.env.SESSION_URI || 'mongodb://localhost:27017/your-session-db', // Provide a default value if SESSION_URI is not set
  collection: 'sessions',
});

store.on('error', function (error) {
  console.error(error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    saveUninitialized: false,
    resave: false,
    store: store, // Use the MongoDBStore for session storage
    cookie: {
      maxAge: 10800000, // 3 hours in milliseconds
    },
  })
);

// Routes
app.get('/', (req, res) => {
  res.send('Greetings From Mr. Oadn API');
});

app.use('/auth', AuthRoutes);
app.use('/article', authMiddleware, ArticleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n 🚀Server Online on PORT-${PORT} 💡`);
});
