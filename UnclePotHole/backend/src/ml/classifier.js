const tf = require('@tensorflow/tfjs')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const MODEL_NAMES = [
  'road-defect',
  'flooding',
  'fallen-trees',
  'damaged-lights',
  'pothole',
]

let models = {}
let modelMetadata = {}
let modelsLoaded = false

const loadModels = async () => {
  if (modelsLoaded) return

  const modelDir = process.env.ML_MODEL_DIR || './src/ml/models'

  for (const name of MODEL_NAMES) {
    const modelPath = path.resolve(modelDir, name, 'model.json')
    const metadataPath = path.resolve(modelDir, name, 'metadata.json')

    if (!fs.existsSync(modelPath)) {
      console.warn(`Model not found for ${name} at ${modelPath}, skipping`)
      continue
    }

    try {
      models[name] = await tf.loadLayersModel(`file://${modelPath}`)
      console.log(`Loaded model: ${name}`)

      if (fs.existsSync(metadataPath)) {
        const meta = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
        modelMetadata[name] = meta
      }
    } catch (err) {
      console.error(`Failed to load model ${name}:`, err.message)
    }
  }

  modelsLoaded = true
  console.log(`Loaded ${Object.keys(models).length}/${MODEL_NAMES.length} models`)
}

const preprocessImage = async (imageBuffer) => {
  // Use sharp to decode and resize (since we're using pure tfjs, not tfjs-node)
  const { data, info } = await sharp(imageBuffer)
    .resize(224, 224)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // Convert raw pixel buffer to float32 tensor [1, 224, 224, 3]
  const tensor = tf.tensor3d(new Uint8Array(data), [info.height, info.width, 3])
  const normalized = tensor.div(255.0)
  const batched = normalized.expandDims(0)
  tensor.dispose()
  normalized.dispose()
  return batched
}

const classify = async (imageBuffer) => {
  if (!modelsLoaded) await loadModels()

  if (Object.keys(models).length === 0) {
    return { category: 'road-defect', scores: {}, confidence: 0 }
  }

  const input = await preprocessImage(imageBuffer)
  const scores = {}

  for (const [name, model] of Object.entries(models)) {
    try {
      const prediction = model.predict(input)
      const data = await prediction.data()

      // Teachable Machine models output probabilities per class
      // The positive class (detection) is typically index 0
      const meta = modelMetadata[name]
      let confidence = 0

      if (meta && meta.labels) {
        // Find the index of the positive/detection class
        const positiveIdx = meta.labels.findIndex(
          (l) => l.toLowerCase() !== 'normal' && l.toLowerCase() !== 'none'
        )
        confidence = positiveIdx >= 0 ? data[positiveIdx] : data[0]
      } else {
        confidence = data[0]
      }

      scores[name] = Math.round(confidence * 100)
      prediction.dispose()
    } catch (err) {
      console.error(`Inference failed for ${name}:`, err.message)
      scores[name] = 0
    }
  }

  input.dispose()

  // Pick the category with the highest confidence
  let bestCategory = 'road-defect'
  let bestScore = 0

  for (const [name, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      bestCategory = name
    }
  }

  return { category: bestCategory, scores, confidence: bestScore }
}

module.exports = { loadModels, classify, MODEL_NAMES }
