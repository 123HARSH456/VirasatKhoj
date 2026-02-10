import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#d35400' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      {/* Map Screen */}
      <Stack.Screen 
        name="index" 
        options={{ title: 'Virasat Map', headerShown: false }} 
      />

      {/* Capture Screen */}
      <Stack.Screen 
        name="capture" 
        options={{ 
          title: 'Capture Evidence',
          headerShown: true 
        }} 
      />

      {/* Analyze Screen */}  
      <Stack.Screen 
        name="analyze" 
        options={{ title: 'AI Historian', headerShown: false }} 
      />
    </Stack>
  );
}