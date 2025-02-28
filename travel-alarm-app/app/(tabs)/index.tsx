import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSelection = async () => {
      const storedUser = await AsyncStorage.getItem("selectedUser");
      if (storedUser) {
        setSelectedUser(storedUser);
      }
      setLoading(false);
    };
    checkUserSelection();
  }, []);

  const selectUser = async (user: string) => {
    await AsyncStorage.setItem("selectedUser", user);
    setSelectedUser(user);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!selectedUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select a User</Text>
        <Button title="User 1" onPress={() => selectUser("1")} />
        <Button title="User 2" onPress={() => selectUser("2")} />
        <Button title="User 3" onPress={() => selectUser("3")} />
      </View>
    );
  }

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

      {/* 🚀 New Button to Distance View */}
      <Button title="Settings" onPress={() => router.push("/SettingsView")} />
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
