# Galileo Backend API

Backend server for Galileo Olimpiadas using Express and Firebase Admin SDK.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Firebase service account credentials.

3. Get Firebase Service Account:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Copy the entire JSON content to `FIREBASE_SERVICE_ACCOUNT` in `.env`

4. Run the server:
   ```bash
   npm run dev    # Development with auto-reload
   npm start      # Production
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/data` | Get olimpiadas data |
| POST | `/api/data` | Save olimpiadas data |

## Deployment

### Railway (Recommended)
1. Push to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Set environment variables in Railway dashboard
4. Deploy

### Render
1. Push to GitHub
2. Connect repo to [Render](https://render.com)
3. Set environment variables
4. Deploy

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON |
| `PORT` | Server port (default: 3001) |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins |