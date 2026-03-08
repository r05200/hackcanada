# Research: Pothole & Civic Issue Reporter

**Feature**: `001-pothole-civic-reporter`  
**Date**: 2026-03-07  
**Purpose**: Resolve all NEEDS CLARIFICATION items from Technical Context and establish best practices for each technology choice.

---

## 1. TensorFlow Runtime for Node.js

**Decision**: Use TensorFlow.js (`@tensorflow/tfjs-node`) running in-process with the Express backend.

**Rationale**: Runs in the same Node.js process — zero additional infrastructure, no Python sidecar, no Docker. `tfjs-node` uses the TensorFlow C library under the hood, achieving ~50–200ms inference per image on CPU for MobileNet-class models. Single codebase, single `package.json`, single deployment unit. Perfectly adequate for single-image classification on user upload at hackathon scale.

**Alternatives considered**:
- TensorFlow Serving: Separate Python/Docker service, gRPC gateway — significant setup overhead for no benefit at this scale.
- Cloud ML APIs (Google Vision, AWS Rekognition): API key management, network latency, cost, and generic vision APIs don't classify potholes specifically.
- ONNX Runtime (Node.js): Viable but smaller ecosystem for transfer learning and fewer pretrained model conversion guides.

---

## 2. Pothole Detection Model

**Decision**: Import a pre-trained model from Google Teachable Machine. The model is trained externally via the Teachable Machine web UI and exported as a TensorFlow.js model (model.json + weight shard .bin files). Loaded server-side with `tf.loadLayersModel('file://./model/model.json')`.

**Rationale**: Google Teachable Machine provides a no-code UI for training image classifiers using MobileNet transfer learning under the hood. The exported TensorFlow.js model is lightweight (~2–5MB), fast (~30ms inference on CPU via tfjs-node), and requires zero custom training code in the project. This eliminates the need for a Python training pipeline, Keras conversion scripts, or dataset management. The model outputs class probabilities that are mapped to a 0–100 confidence score for the "pothole" class.

**Workflow**:
1. Train model in Google Teachable Machine (https://teachablemachine.withgoogle.com/) with pothole vs. non-pothole image classes
2. Export as "TensorFlow.js" format → downloads a zip containing `model.json` + `weights.bin` shard(s) + `metadata.json`
3. Place exported files in `backend/src/ml/model/`
4. Load in Node.js: `const model = await tf.loadLayersModel('file://./src/ml/model/model.json')`
5. Inference: pass 224×224 image tensor → model outputs class probabilities → extract pothole class probability × 100 → `potholeScore`

**Teachable Machine export format**:
- `model.json` — model topology + weight manifest
- `weights.bin` — binary weight shards (one or more files)
- `metadata.json` — class labels array (e.g., `["Pothole", "Normal"]`)

**Alternatives considered**:
- Custom MobileNetV2 transfer learning in Python/Keras: More control but requires training infrastructure, dataset management, and conversion pipeline. Overkill for hackathon scope.
- ResNet50: ~100MB, slower (~150ms), overkill for binary classification.
- YOLOv5/v8: Object detection (bounding boxes), not classification confidence. More complex integration.
- Cloud ML APIs: API key management, network latency, cost — unnecessary when a local model works.

---

## 3. Image Preprocessing Pipeline

**Decision**: Resize to 224×224 pixels, normalize to [0, 1], convert to RGB float32 tensor.

**Rationale**: Google Teachable Machine exports MobileNet-based models that expect 224×224×3 input normalized to [0, 1] (divide by 255). This differs from raw MobileNetV2 which uses [-1, 1]. The Teachable Machine model handles normalization expectations internally based on its export configuration. `tf.node.decodeImage` handles JPEG/PNG natively. Use `sharp` for EXIF auto-rotation before decoding (mobile photos often have EXIF orientation).

**Pipeline**:
```javascript
const tensor = tf.node.decodeImage(imageBuffer, 3)
const resized = tf.image.resizeBilinear(tensor, [224, 224])
const normalized = resized.div(255.0)
const batched = normalized.expandDims(0)
```

---

## 4. MongoDB Image Storage

**Decision**: Store images as `Buffer` (Binary/BinData) directly in the report document field. No Base64 encoding.

**Rationale**: MongoDB's document limit is 16MB. A 10MB JPEG stored as Buffer (BSON Binary) stays 10MB — well within the limit. Base64 would add ~33% overhead (13.3MB), dangerously close to the limit. Since images are "stored for ML processing only (never displayed in UI)", no URL generation, CDN, or streaming is needed. One collection, one query, direct buffer access for ML inference.

**Alternatives considered**:
- GridFS: Designed for files >16MB. Adds complexity (separate collections, GridFSBucket API). Unnecessary when documents fit the limit.
- Base64 strings: 33% storage overhead, risks hitting 16MB limit on larger uploads.
- S3/Cloud Storage: Production-grade but adds SDK, credentials, bucket config — unnecessary at hackathon scale.
- Filesystem storage: Not portable across deployments, no replication, paths break on server move.

---

## 5. Toronto Riding Boundary Data

**Decision**: Source GeoJSON from the Represent API (Open North) for both federal MP and provincial MPP ridings. Bundle as static JSON files in the backend seed data and in the mobile app's constants.

**Rationale**: The Represent API provides simplified GeoJSON polygons for all Canadian electoral districts at endpoints like `/boundaries/federal-electoral-districts/{slug}/simple_shape`. Ontario aligned provincial boundaries to federal ones in 2015, so they're nearly identical. Approximately 25 federal MP ridings and 25 provincial MPP ridings cover the City of Toronto.

**Data format**: GeoJSON FeatureCollection with each riding as a Feature containing name, type (MP/MPP), and polygon geometry. Bundled at build time — no runtime API calls needed.

**Alternatives considered**:
- Elections Canada/Elections Ontario raw shapefiles: Available but require conversion from Shapefile → GeoJSON and are much larger (detailed boundaries).
- City of Toronto Open Data: Has neighbourhood boundaries but NOT electoral riding boundaries.
- Runtime API calls to Represent: Adds network dependency and latency. Static bundling is simpler and faster.

---

## 6. react-native-maps with Expo Go

**Decision**: Use `react-native-maps` — works in Expo Go managed workflow out of the box with zero configuration.

**Rationale**: Bundled in Expo SDK. Uses Apple Maps on iOS and Google Maps on Android by default. Google Maps API keys only needed for production App Store builds (configured via Expo config plugin). Current bundled version: 1.26.20. Supports markers, callouts, polygons (for riding boundaries), and custom styling.

**Alternatives considered**:
- Mapbox React Native: Requires a development build (custom native modules), not compatible with Expo Go.
- Google Maps Platform (web SDK in WebView): Poor performance, no native feel, limited interaction.

---

## 7. NativeWind (Tailwind CSS for React Native)

**Decision**: Use NativeWind v4.2.x with Expo SDK 52.

**Rationale**: 713K weekly downloads, stable release. Requires babel plugin + Metro config wrapper + `global.css`. Supports all major Tailwind utilities relevant to mobile (flexbox, colors, spacing, typography, dark mode, animations, pseudo-classes). Only limitation: CSS container queries — irrelevant for mobile.

**Setup requirements**: `nativewind`, `tailwindcss`, `babel-plugin-nativewind` in devDependencies. Metro config wrapping via `withNativeWind`. `global.css` imported in root layout.

---

## 8. Point-in-Polygon for Riding Detection

**Decision**: Use `@turf/boolean-point-in-polygon` (~15KB standalone).

**Rationale**: Pure JavaScript, GeoJSON-native, handles concave polygons and holes. Works directly with the same GeoJSON format as bundled riding boundaries. No native modules — runs in both Expo Go and Node.js. Used both server-side (to determine points on report submission) and client-side (to check if pin is in user's riding for immediate UI feedback).

**Alternatives considered**:
- Full Turf.js library: ~500KB, unnecessary when only point-in-polygon is needed.
- PostGIS / MongoDB geospatial queries: Good for server-side but doesn't help with client-side immediate feedback. MongoDB `$geoWithin` can be used as a secondary validation on the backend.
- Manual ray-casting algorithm: Reinventing the wheel when Turf.js exists.

---

## Summary

| Topic | Decision | Key Tradeoff |
|-------|----------|-------------|
| ML Runtime | `@tensorflow/tfjs-node` | Simplicity over raw performance |
| Model | Google Teachable Machine export (MobileNet) | Pre-trained externally, zero training code |
| Preprocessing | 224×224, [0,1], RGB | Teachable Machine convention |
| Image Storage | MongoDB Buffer (BinData) | Simplicity over scalability |
| Riding Data | Represent API → static GeoJSON | Bundled at build, no runtime deps |
| Maps | react-native-maps (Expo Go built-in) | Zero config, native performance |
| Styling | NativeWind v4.2.x | Tailwind DX on React Native |
| Geo logic | @turf/boolean-point-in-polygon | Lightweight, GeoJSON-native |
