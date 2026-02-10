import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { analyzeHeritageSite } from '../services/ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons'; 

export default function AnalyzeScreen() {
  const { imageUri } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    if (!imageUri) return;
    const result = await analyzeHeritageSite(imageUri as string);
    setData(result);
    setLoading(false);
  };

  const claimDiscovery = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const newDiscovery = {
        id: Date.now(),
        image: imageUri,
        coords: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
        ...data
      };

      const existing = await AsyncStorage.getItem('discoveries');
      const discoveries = existing ? JSON.parse(existing) : [];
      discoveries.push(newDiscovery);
      await AsyncStorage.setItem('discoveries', JSON.stringify(discoveries));

      Alert.alert("🎉 Site Conquered!", "Map Updated.", [
        { text: "Return to Map", onPress: () => router.navigate('/') }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUri as string }} style={styles.image} />
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#d35400" />
            <Text style={styles.loadingText}>Verifying Authenticity...</Text>
          </View>
        ) : (
          <>
            {/* Site validation */}
            {data?.valid ? (
              // VALID SITE
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>{data?.name}</Text>
                  <View style={styles.badge}><Text style={styles.badgeText}>{data?.era}</Text></View>
                </View>

                <View style={styles.card}>
                  <Text style={styles.story}>"{data?.narrative}"</Text>
                </View>

                <TouchableOpacity style={styles.claimBtn} onPress={claimDiscovery}>
                  <Text style={styles.claimText}>⚔️ CLAIM THIS SITE ⚔️</Text>
                </TouchableOpacity>
              </>
            ) : (
              // REJECTED (FAKE SITE)
              <View style={styles.rejectContainer}>
                <Ionicons name="warning" size={60} color="#e74c3c" />
                <Text style={styles.rejectTitle}>Verification Failed</Text>
                <Text style={styles.rejectReason}>
                  "{data?.rejection_reason || "This does not appear to be a heritage structure."}"
                </Text>
                
                {/* TRY AGAIN BUTTON */}
                <TouchableOpacity 
                  style={styles.retryBtn} 
                  onPress={() => router.back()} // Go back to the capture screen
                >
                  <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#1a1a1a' },
  image: { width: '100%', height: 350 },
  content: { padding: 20 },
  loader: { marginTop: 50, alignItems: 'center' },
  loadingText: { color: '#d35400', fontSize: 18, marginTop: 20, fontWeight: 'bold' },
  
  // Valid Styles
  header: { marginBottom: 20 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  badge: { backgroundColor: '#d35400', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginTop: 5 },
  badgeText: { color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: '#2d2d2d', padding: 20, borderRadius: 15, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#d35400' },
  story: { color: '#ddd', fontSize: 16, lineHeight: 24, fontStyle: 'italic' },
  claimBtn: { backgroundColor: '#27ae60', padding: 18, borderRadius: 12, alignItems: 'center', elevation: 5 },
  claimText: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 1 },

  // Reject Styles
  rejectContainer: { alignItems: 'center', marginTop: 20, padding: 20, backgroundColor: '#2c0b0e', borderRadius: 15, borderWidth: 1, borderColor: '#e74c3c' },
  rejectTitle: { color: '#e74c3c', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  rejectReason: { color: '#eca0a0', fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 20 },
  retryBtn: { backgroundColor: '#e74c3c', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  retryText: { color: 'white', fontWeight: 'bold' }
});