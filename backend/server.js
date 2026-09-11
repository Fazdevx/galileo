import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:4321').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json({ limit: '10mb' }));

// Initialize Firebase Admin
let db;
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  initializeApp({
    credential: cert(serviceAccount)
  });
  db = getFirestore();
  console.log('[Firebase] Admin SDK initialized successfully');
} catch (error) {
  console.error('[Firebase] Failed to initialize:', error.message);
  process.exit(1);
}

const COLLECTION = 'olimpiadas';
const DOC_ID = 'olimpiadas-data';

// Default data structure
const DEFAULT_DATA = {
  sections: [],
  sports: [],
  games: [],
  heroStats: { secciones: 0, disciplinas: 0, dias: 0 },
  prizes: [
    { id: 'p1', name: '5% Descuento', description: '5% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 5, color: 'bg-emerald-500', icon: 'money' },
    { id: 'p2', name: '10% Descuento', description: '10% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 10, color: 'bg-brand-500', icon: 'gift' },
    { id: 'p3', name: '15% Descuento', description: '15% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 15, color: 'bg-purple-500', icon: 'star' },
    { id: 'p4', name: '20% Matrícula', description: '20% de descuento en matrícula de tu hijo', type: 'descuento_matricula', value: 20, color: 'bg-rose-500', icon: 'graduation' },
    { id: 'p5', name: '1 Libro', description: '1 libro de regalo para tu hijo', type: 'libro', value: 1, color: 'bg-sky-500', icon: 'book' },
    { id: 'p6', name: '2 Cuadernos', description: '2 cuadernos de regalo', type: 'cuaderno', value: 2, color: 'bg-amber-500', icon: 'notebook' },
  ]
};

// GET /api/data - Get olimpiadas data
app.get('/api/data', async (req, res) => {
  try {
    const docRef = db.collection(COLLECTION).doc(DOC_ID);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      // Validate data structure
      if (data.sections && data.sports && data.games && data.heroStats) {
        console.log('[API] Data retrieved from Firebase');
        return res.json(data);
      }
    }

    // Initialize with default data if empty or invalid
    console.log('[API] Initializing with default data');
    await docRef.set(DEFAULT_DATA);
    res.json(DEFAULT_DATA);
  } catch (error) {
    console.error('[API] Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

// POST /api/data - Save olimpiadas data
app.post('/api/data', async (req, res) => {
  try {
    const data = req.body;
    
    // Basic validation
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid data' });
    }

    const docRef = db.collection(COLLECTION).doc(DOC_ID);
    await docRef.set(data);
    console.log('[API] Data saved successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('[API] Error saving data:', error);
    res.status(500).json({ success: false, error: 'Failed to save data', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] Allowed origins: ${allowedOrigins.join(', ')}`);
});