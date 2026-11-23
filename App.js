import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';
import * as Updates from 'expo-updates';

import { BrowserProvider } from './src/context/BrowserContext';
import BrowserScreen from './src/screens/BrowserScreen';
import TabsScreen from './src/screens/TabsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    mobileAds()
      .initialize()
      .catch(() => {});
  }, []);

  // Mises à jour automatiques : au démarrage, l'appli vérifie s'il existe une
  // nouvelle version (envoyée depuis GitHub), la télécharge et redémarre dessus.
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;
    (async () => {
      try {
        const check = await Updates.checkForUpdateAsync();
        if (check.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        // Pas de réseau ou pas de mise à jour : on continue normalement
      }
    })();
  }, []);

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
