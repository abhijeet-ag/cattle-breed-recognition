// src/ml/inference.ts
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { InferenceResult } from '../types';

let model: tf.LayersModel | null = null;
let modelLoaded = false;

export async function loadModel(): Promise<void> {
  if (modelLoaded) return;

  console.log('🎯 LOADING REAL CONVERTED TENSORFLOW.JS MODEL...');

  // 1. wait for RN-webgl backend
  await tf.ready();
  console.log('✅ TFjs ready, backend:', tf.getBackend());

  const modelJson = require('../../assets/ml_tfjs/model.json');
  const modelWeights = require('../../assets/ml_tfjs/group1-shard1of1.bin');

  model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
  modelLoaded = true;

  console.log('✅ REAL MODEL LOADED!');
  console.log('📊 Input shape:', model.inputs[0].shape);
  console.log('📊 Output shape:', model.outputs[0].shape);
}

export async function runInference(imageTensor: tf.Tensor): Promise<tf.Tensor> {
  if (!modelLoaded) await loadModel();
  return model!.predict(imageTensor) as tf.Tensor;
}
