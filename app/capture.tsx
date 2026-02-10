import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setPhoto(null);
    }, [])
  );

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>We need camera access to document history.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}><Text>Grant Permission</Text></TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData?.uri || null);
    }
  };

  const analyzePhoto = () => {
    if (photo) {
      router.push({ pathname: '/analyze', params: { imageUri: photo } });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} />

      {photo ? (
        // PREVIEW MODE
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => setPhoto(null)} style={styles.retakeBtn}>
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={analyzePhoto} style={styles.analyzeBtn}>
              <Text style={styles.analyzeText}>Invoking AI...</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // CAMERA MODE
        <View style={{ flex: 1 }}>
          <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />
          {/* Capture Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />
          </View>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // Camera style set to absoluteFill so it sits behind everything
  previewContainer: { flex: 1 },
  preview: { flex: 1 },
  
  buttonContainer: { 
    position: 'absolute', // Force it to bottom
    bottom: 50, 
    left: 0, 
    right: 0, 
    flexDirection: 'row', 
    justifyContent: 'center' 
  },
  
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', borderWidth: 6, borderColor: '#ccc' },
  
  controls: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#000' },
  retakeBtn: { padding: 15 },
  analyzeBtn: { padding: 15, backgroundColor: '#d35400', borderRadius: 10 },
  text: { color: 'white' },
  analyzeText: { color: 'white', fontWeight: 'bold' },
  btn: { padding: 10, backgroundColor: 'lightblue', marginTop: 10 },
  
  backBtn: {
    position: 'absolute',
    top: 50, 
    left: 20,
    zIndex: 10, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    padding: 10,
    borderRadius: 30,
  }
});