import React from "react";
import { View, StyleSheet } from "react-native";
import LeafletMap from "@/components/LeafletMap";

const WebMap = () => {
  return (
    <View style={styles.container}>
      <LeafletMap />
    </View>
  );
};

export default WebMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
