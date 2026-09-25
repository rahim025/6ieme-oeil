import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { history, clearHistory, activeTab, updateTab, activeTabId } = useBrowser();

  const openUrl = (url) => {
    updateTab(activeTabId, { url });
    navigation.navigate('Browser');
  };

  const confirmClear = () => {
    Alert.alert('Effacer l\'historique', 'Cette action est irréversible.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Effacer', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Historique</Text>
        <TouchableOpacity onPress={confirmClear}>
          <Ionicons name="trash-outline" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item, idx) => `${item.url}-${idx}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun historique pour le moment.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => openUrl(item.url)}>
            <Ionicons name="time-outline" size={18} color={COLORS.textMuted} />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.title || extractDomain(item.url)}
              </Text>
              <Text style={styles.rowUrl} numberOfLines={1}>
                {extractDomain(item.url)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  list: { padding: 12, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  rowUrl: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  empty: { textAlign: 'center', color: COLORS.textMuted, marginTop: 40 },
});
