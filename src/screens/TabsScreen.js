import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useBrowser } from '../context/BrowserContext';
import { extractDomain } from '../utils/urlUtils';

const COLORS = {
  emerald: '#059669',
  bg: '#F3F4F2',
  card: '#FFFFFF',
  textDark: '#1F2937',
  textMuted: '#6B7280',
  border: '#E5E7EB',
};

export default function TabsScreen() {
  const navigation = useNavigation();
  const { tabs, activeTabId, setActiveTabId, closeTab, newTab } = useBrowser();

  const openTab = (id) => {
    setActiveTabId(id);
    navigation.navigate('Browser');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Onglets</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tabs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.id === activeTabId && styles.cardActive]}
            onPress={() => openTab(item.id)}
          >
            <View style={styles.cardHeader}>
              {item.isPrivate && (
                <Ionicons name="eye-off-outline" size={14} color={COLORS.textMuted} />
              )}
              <Text style={styles.cardDomain} numberOfLines={1}>
                {extractDomain(item.url)}
              </Text>
              <TouchableOpacity onPress={() => closeTab(item.id)} hitSlop={8}>
                <Ionicons name="close" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.cardPreview}>
              <Ionicons name="globe-outline" size={28} color={COLORS.border} />
            </View>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.newTabButton} onPress={() => newTab()}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.newTabText}>Nouvel onglet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.newTabButton, styles.privateButton]}
          onPress={() => newTab(undefined, true)}
        >
          <Ionicons name="eye-off-outline" size={20} color="#1F2937" />
          <Text style={[styles.newTabText, { color: '#1F2937' }]}>Privé</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  grid: { paddingHorizontal: 12, paddingBottom: 12, gap: 12 },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardActive: { borderWidth: 2, borderColor: COLORS.emerald },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  cardDomain: { flex: 1, fontSize: 12, color: COLORS.textMuted },
  cardPreview: {
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F3F4F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textDark },
  footer: { flexDirection: 'row', gap: 10, padding: 16 },
  newTabButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.emerald,
    borderRadius: 20,
    paddingVertical: 12,
  },
  privateButton: { backgroundColor: '#E5E7EB' },
  newTabText: { color: '#fff', fontWeight: '700' },
});
