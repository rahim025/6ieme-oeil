import React from 'react';
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function MenuSheet({ visible, onClose, items }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          {items.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
                item.disabled && styles.rowDisabled,
              ]}
              disabled={item.disabled}
              onPress={() => {
                onClose();
                item.onPress();
              }}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={20} color={COLORS.emerald} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 12,
    paddingBottom: 28,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  rowPressed: { backgroundColor: COLORS.bg },
  rowDisabled: { opacity: 0.4 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.emeraldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' },
});
