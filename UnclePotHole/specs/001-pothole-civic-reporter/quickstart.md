# Quickstart: Pothole & Civic Issue Reporter

**Feature**: `001-pothole-civic-reporter`  
**Date**: 2026-03-07

---

## Prerequisites

- **Node.js** 18+ (LTS)
- **MongoDB** 7.0+ (local or Atlas free tier)
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go app** installed on your phone (iOS App Store / Google Play)

---

## 1. Clone and Install

```bash
# From repository root
cd backend && npm install
cd ../mobile && npm install
```

---

## 2. Backend Setup

### Environment

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/unclepothole
JWT_SECRET=dev-secret-change-in-production
PORT=3000
ML_MODEL_PATH=./src/ml/model/model.json
```

### Seed Toronto Ridings

```bash
cd backend
node src/data/seed-ridings.js
```

This loads the bundled GeoJSON riding boundaries into MongoDB.

### Start the API Server

```bash
cd backend
npm run dev
```

Server runs at `http://localhost:3000`. Verify: `curl http://localhost:3000/api/ridings`

---

## 3. ML Model Setup

### Import from Google Teachable Machine

1. Go to [Google Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Create an Image Project with two classes: "Pothole" and "Normal"
3. Train the model with sample images
4. Click "Export Model" → select "TensorFlow.js" → download the zip
5. Extract the zip contents (`model.json`, `weights.bin`, `metadata.json`) into `backend/src/ml/model/`

A pre-exported model is included at `backend/src/ml/model/` for development. Skip to step 4 if using it.

---

## 4. Mobile App Setup

### Environment

Create `mobile/.env`:

```env
API_URL=http://<your-local-ip>:3000/api
```

Use your machine's local IP (e.g., `192.168.1.100`), not `localhost` — Expo Go on your phone needs to reach the backend over the network.

### Start the Expo Dev Server

```bash
cd mobile
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## 5. Verify End-to-End

1. Open the app → you should see the registration screen
2. Register with a display name, email, password, and select a riding (e.g., "Toronto Centre")
3. You land on the full-screen map centered on your riding
4. Tap the "+" button to submit a report
5. Take/upload a photo, add a description, select a category, confirm the location pin
6. Report is submitted → you earn 1 point → pin appears on the map
7. Navigate to the Leaderboard tab → see yourself at rank 1
8. Navigate to the Profile tab → see your report history and stats

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Expo Go can't reach backend | Use local IP in `API_URL`, not `localhost`. Ensure phone and dev machine are on same WiFi. |
| MongoDB connection error | Ensure MongoDB is running: `mongod --dbdir /data/db` or use Atlas connection string. |
| Map not showing | On Android in Expo Go, Google Maps works by default. On iOS, Apple Maps is used. No API keys needed for dev. |
| ML model not found | Ensure `ML_MODEL_PATH` in `.env` points to the correct `model.json` file. Run seed script if using pre-trained model. |
| Image upload fails | Check file size (≤ 10 MB) and format (JPEG/PNG only). |

---

## Project Scripts

### Backend

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start Express with nodemon |
| Seed ridings | `node src/data/seed-ridings.js` | Load Toronto riding boundaries |
| Seed demo data | `node src/data/seed-demo.js` | Create sample users and reports |

### Mobile

| Script | Command | Description |
|--------|---------|-------------|
| Start dev | `npx expo start` | Launch Expo dev server |
| Clear cache | `npx expo start --clear` | Start with clean Metro cache |
