import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB Atlas
connectDB();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const trimmed = url.trim().replace(/\/$/, '');
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, health checks)
      if (!origin) return callback(null, true);

      let isAllowed = allowedOrigins.includes(origin);

      // Also allow any *.vercel.app domain if client is deployed on Vercel
      if (!isAllowed) {
        try {
          const hostname = new URL(origin).hostname;
          if (hostname.endsWith('.vercel.app')) {
            isAllowed = true;
          }
        } catch {
          // invalid origin format
        }
      }

      // If CLIENT_URL is not explicitly set, permit the requesting origin dynamically
      if (!process.env.CLIENT_URL) {
        isAllowed = true;
      }

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error(`Blocked by CORS: origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    store: 'Yash Cloth Stores API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// 404 Route handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Image Upload Error: ${err.message}`,
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`[Yash Cloth Stores Server] Running on http://localhost:${PORT}`);
});
