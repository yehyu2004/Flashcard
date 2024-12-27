// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreen from './screens/AuthScreen';
import MySetsScreen from './screens/MySetsScreen';
import SetDetailScreen from './screens/SetDetailScreen';
import AddCardScreen from './screens/AddCardScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MySets" component={MySetsScreen} />
        <Stack.Screen name="SetDetail" component={SetDetailScreen} />
        <Stack.Screen name="AddCard" component={AddCardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}