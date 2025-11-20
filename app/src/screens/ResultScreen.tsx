import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { runInference } from '../ml/inference';
import { BREED_LABELS } from '../ml/labels';

type Props = { route: { params: { imageUri: string } } };

export default function ResultScreen({ route }: Props) {
  const { imageUri } = route.params;
  const [result, setResult] = useState<string>('Analysing…');

  useEffect(() => {
    (async () => {
      try {
        const b64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const raw = new Uint8Array(tf.util.encodeString(b64, 'base64').buffer);
        const tensor = decodeJpeg(raw).resizeBilinear([224, 224]).expandDims(0);

        const logits = await runInference(tensor);
        const probs = logits.softmax().dataSync() as Float32Array;
        const topIdx = probs.indexOf(Math.max(...probs));
        const confidence = (probs[topIdx] * 100).toFixed(1);
        const breed = BREED_LABELS[topIdx] ?? 'Unknown';

        setResult(`${breed}  (${confidence}%)`);
      } catch (e: any) {
        console.error('❌ analyse error:', e);
        Alert.alert('Failed to analyse image', e.message);
        setResult('Error');
      }
    })();
  }, [imageUri]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 22, fontWeight: '600' },
});
