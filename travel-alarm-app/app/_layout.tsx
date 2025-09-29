import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect} from 'react';
import 'react-native-reanimated';
import React from 'react';
import Dropdown from "@/components/Dropdown";


import { useColorScheme } from '@/hooks/useColorScheme';
//import DistanceView from './DistanceView';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="UserView" options={{ title: "User View" }} />
        <Stack.Screen name="Map" options={{ title: "Map View", headerTitleAlign:"center", headerTitleStyle: {fontSize: 18}, headerRight: () => (<Dropdown/>)}}/>
        <Stack.Screen name="WebMap" options={{title: "Web Map View" }}/>
        <Stack.Screen name="DistanceView" options={{ title: "Distance API view"}}/>
        <Stack.Screen name="SoundView" options={{ title: 'Sound Selection' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}