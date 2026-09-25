import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  emerald: '#059669',
  card: '#FFFFFF',
  textDark: '#1F2937',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
};

export default function ToolBar({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onReload,
  onHome,
  onOpenTabs,
  tabCount,
  onOpenMenu,
}) {
  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.button} onPress={onBack} disabled={!canGoBack}>
        <Ionicons name="chevron-back" size={22} color={canGoBack ? COLORS.textDark : COLORS.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onForward} disabled={!canGoForward}>
        <Ionicons
          name="chevron-forward"
          size={22}
          color={canGoForward ? COLORS.textDark : COLORS.textMuted}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onHome}>
        <Ionicons name="home-outline" size={20} color={COLORS.textDark} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onReload}>
        <Ionicons name="refresh" size={20} color={COLORS.textDark} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={onOpenTabs}>
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>{tabCount}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onOpenMenu}>
        <Ionicons name="menu" size={22} color={COLORS.textDark} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 56,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: { padding: 10 },
  tabButton: { padding: 6 },
  tabBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: { color: COLORS.emerald, fontSize: 12, fontWeight: '700' },
});
