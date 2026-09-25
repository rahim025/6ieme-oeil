import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useBrowser } from '../context/BrowserContext';
import { SEARCH_ENGINES } from '../utils/urlUtils';

const COLORS = {
  emerald: '#059669',
  bg: '#F3F4F2',
  card: '#FFFFFF',
  textDark: '#1F2937',
  textMuted: '#6B7280',
};

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { settings, updateSettings } = useBrowser();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres</Text>
        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.sectionLabel}>Moteur de recherche</Text>
      <View style={styles.card}>
        {Object.entries(SEARCH_ENGINES).map(([key, engine]) => (
          <TouchableOpacity
            key={key}
            style={styles.row}
            onPress={() => updateSettings({ searchEngine: key })}
          >
            <Text style={styles.rowText}>{engine.name}</Text>
            {settings.searchEngine === key && (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.emerald} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textDark },
  sectionLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginHorizontal: 16,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  card: { backgroundColor: COLORS.card, marginHorizontal: 12, borderRadius: 14 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowText: { fontSize: 15, color: COLORS.textDark },
});
