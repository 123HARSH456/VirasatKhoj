import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [score, setScore] = useState(0);
  const [claimedSites, setClaimedSites] = useState<any[]>([]);
  
  // Track which marker was clicked
  const [selectedSite, setSelectedSite] = useState<any>(null);

  const hiddenSites = [
    { id: 1, lat: 28.5355, long: 77.3910, title: "Unknown Stepwell", description: "Unclaimed" },
    { id: 2, lat: 28.4595, long: 77.0266, title: "Ruined Colonial Post", description: "Unclaimed" },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const existing = await AsyncStorage.getItem('discoveries');
          const discoveries = existing ? JSON.parse(existing) : [];
          setClaimedSites(discoveries);
          setScore(discoveries.length * 500);
        } catch (e) { console.log(e); }
      };
      loadData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>Guardian Rank</Text>
        <Text style={styles.scoreValue}>{score} XP</Text>
      </View>

      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          // Close the card if user taps elsewhere on map
          onPress={() => setSelectedSite(null)} 
        >
          {hiddenSites.map((site) => (
            <Marker
              key={site.id}
              coordinate={{ latitude: site.lat, longitude: site.long }}
              title={site.title}
              description={site.description}
              pinColor="gold"
              onPress={() => setSelectedSite(null)} // Hide card for uncaptured sites
            />
          ))}

          {claimedSites.map((site, index) => {
            if (!site.coords) return null;
            return (
              <Marker
                key={site.id || index}
                coordinate={{ 
                  latitude: site.coords.latitude, 
                  longitude: site.coords.longitude 
                }}
                pinColor="green"
                // When clicked, set this site as "Selected"
                onPress={() => setSelectedSite(site)}
              />
            );
          })}
        </MapView>
      ) : (
        <View style={styles.loading}><Text>Locating...</Text></View>
      )}

      {/* THE POPUP CARD (Shows only when a site is selected) */}
      {selectedSite && (
        <View style={styles.popupCard}>
          <Image 
            source={{ uri: selectedSite.image }} 
            style={styles.popupImage} 
          />
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>{selectedSite.name}</Text>
            <Text style={styles.popupEra}>{selectedSite.era}</Text>
            <Text numberOfLines={2} style={styles.popupDesc}>
              {selectedSite.narrative}
            </Text>
            
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setSelectedSite(null)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Hide the Capture Button if a Card is open*/}
      {!selectedSite && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/capture')}
        >
          <Ionicons name="camera" size={30} color="white" />
          <Text style={styles.fabText}>Scan Ruin</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Score Card Styles
  scoreCard: {
    position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.85)',
    paddingVertical: 10, paddingHorizontal: 15, borderRadius: 12, zIndex: 100,
    borderLeftWidth: 4, borderLeftColor: '#d35400',
  },
  scoreTitle: { color: '#bbb', fontSize: 10, textTransform: 'uppercase' },
  scoreValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  // Capture Button Styles
  fab: {
    position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#d35400',
    flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 25,
    borderRadius: 30, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3,
  },
  fabText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },

  // Popup Card Styles
  popupCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 140, // Fixed height for consistency
  },
  popupImage: {
    width: 100,
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#eee'
  },
  popupContent: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2
  },
  popupEra: {
    fontSize: 12,
    color: '#d35400', 
    marginBottom: 5,
    fontWeight: '600'
  },
  popupDesc: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  closeBtn: {
    backgroundColor: '#f1f2f6',
    padding: 6,
    alignSelf: 'flex-start',
    borderRadius: 5
  },
  closeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#57606f'
  }
});