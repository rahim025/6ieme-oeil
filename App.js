import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BrowserProvider } from './src/context/BrowserContext';
import BrowserScreen from './src/screens/BrowserScreen';
import TabsScreen from './src/screens/TabsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <BrowserProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            initialRouteName="Browser"
            screenOptions={{ headerShown: false, animation: 'fade' }}
          >
            <Stack.Screen name="Browser" component={BrowserScreen} />
            <Stack.Screen name="Tabs" component={TabsScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </BrowserProvider>
    </SafeAreaProvider>
  );
}
