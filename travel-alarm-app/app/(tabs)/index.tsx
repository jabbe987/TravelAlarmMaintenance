import { Image, StyleSheet, Platform } from 'react-native';
import { useRouter } from "expo-router";
import { View, Text, Button} from "react-native";


import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleContainer}>Welcome to Travel Alarm</Text>
      <Button title="Go to User View" onPress={() => router.push("/UserView")} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 40,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#25299e',
    gap: 50,
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
});
