import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FetchWords from './screens/FetchWords';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Travel Alarm" component={FetchWords} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
