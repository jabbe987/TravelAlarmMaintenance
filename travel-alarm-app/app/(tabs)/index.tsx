import { Image, StyleSheet, Platform } from 'react-native';
import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Travel Alarm</Text>

      {/* Button to User View */}
      <Button title="Go to User View" onPress={() => router.push("/UserView")} />

      {/* Button to Map View */}
      {Platform.OS !== "web" && <Button title="Go to Map View" onPress={() => router.push("/Map")} />}

      {/* Button to Web Map View */}
      {Platform.OS === "web" && <Button title="Go to Map View Leaflet" onPress={() => router.push("/WebMap")} />}

      {/* 🚀 New Button to Distance View */}
      <Button title="Go to Distance View" onPress={() => router.push("/DistanceView")} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 40,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#25299e',
    padding: 20,
    gap: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25299e",
    padding: 20,
  },
  stepContainer: {
    gap: 8,
    marginTop: 40,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
});
