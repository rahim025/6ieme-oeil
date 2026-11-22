import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { extractDomain } from '../utils/urlUtils';

const SHORTCUTS = [
  { label: 'Google', icon: 'logo-google', url: 'https://www.google.com', color: '#4285F4' },
  { label: 'YouTube', icon: 'logo-youtube', url: 'https://m.youtube.com', color: '#DC2626' },
  { label: 'Facebook', icon: 'logo-facebook', url: 'https://m.facebook.com', color: '#1877F2' },
  { label: 'TikTok', icon: 'logo-tiktok', url: 'https://www.tiktok.com', color: '#111827' },
  { label: 'Wikipédia', icon: 'book-outline', url: 'https://fr.wikipedia.org', color: '#475569' },
  { label: 'Gmail', icon: 'mail-outline', url: 'https://mail.google.com', color: '#EA4335' },
];

export default function StartPage({ onSearch, onOpen, bookmarks = [] }) {
  const [text, setText] = useState('');

  const submit = () => {
    if (text.trim()) {
      onSearch(text.trim());
      setText('');
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoCircle}>
        <Ionicons name="eye" size={36} color="#fff" />
      </View>
      <Text style={styles.title}>
        6<Text style={styles.titleAccent}>ième</Text> Œil
      </Text>
      <Text style={styles.subtitle}>Le web, simplement.</Text>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={text}
          onChangeText={setText}
          onSubmitEditing={submit}
          placeholder="Rechercher ou saisir une adresse"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
        />
      </View>

      <Text style={styles.sectionTitle}>Accès rapide</Text>
      <View style={styles.grid}>
        {SHORTCUTS.map((s) => (
          <TouchableOpacity
            key={s.label}
            style={styles.shortcut}
            onPress={() => onOpen(s.url)}
            activeOpacity={0.7}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: `${s.color}1A` }]}>
              <Ionicons name={s.icon} size={24} color={s.color} />
            </View>
            <Text style={styles.shortcutLabel} numberOfLines={1}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {bookmarks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Favoris</Text>
          <View style={styles.favList}>
            {bookmarks.slice(0, 4).map((b) => (
              <TouchableOpacity
                key={b.url}
                style={styles.favRow}
                onPress={() => onOpen(b.url)}
                activeOpacity={0.7}
              >
                <Ionicons name="star" size={16} color={COLORS.emerald} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.favTitle} numberOfLines={1}>
                    {b.title || extractDomain(b.url)}
                  </Text>
                  <Text style={styles.favUrl} numberOfLines={1}>
                    {extractDomain(b.url)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 36, paddingBottom: 24 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 30, fontWeight: '800', color: COLORS.textDark },
  titleAccent: { color: COLORS.emerald },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4, marginBottom: 24 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    backgroundColor: COLORS.card,
    borderRadius: 26,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 28,
  },
  searchInput: { flex: 1, fontSize: 16, color: COLORS.textDark },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'stretch', marginBottom: 20 },
  shortcut: { width: '33.33%', alignItems: 'center', paddingVertical: 10 },
  shortcutIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shortcutLabel: { fontSize: 12, color: COLORS.textDark },
  favList: { alignSelf: 'stretch', gap: 8 },
  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
  },
  favTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  favUrl: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
});
