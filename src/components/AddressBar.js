import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { extractDomain } from '../utils/urlUtils';

const COLORS = {
  emerald: '#059669',
  bg: '#F7F8F7',
  card: '#FFFFFF',
  textDark: '#1F2937',
  textMuted: '#6B7280',
  border: '#E5E7EB',
};

export default function AddressBar({
  currentUrl,
  loading,
  isSecure,
  onSubmit,
  onFocusHistory,
  suggestions = [],
  isBookmarked,
  onToggleBookmark,
}) {
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!editing) {
      setText(currentUrl ? extractDomain(currentUrl) : '');
    }
  }, [currentUrl, editing]);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setEditing(false);
      inputRef.current?.blur();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputRow}>
        {isSecure ? (
          <Ionicons name="lock-closed" size={14} color={COLORS.emerald} style={styles.icon} />
        ) : (
          <Ionicons name="search" size={16} color={COLORS.textMuted} style={styles.icon} />
        )}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={setText}
          onFocus={() => {
            setEditing(true);
            onFocusHistory && onFocusHistory();
          }}
          onBlur={() => setEditing(false)}
          onSubmitEditing={handleSubmit}
          placeholder="Rechercher ou saisir une adresse..."
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="web-search"
          returnKeyType="go"
          selectTextOnFocus
        />
        {loading ? (
          <View style={styles.icon} />
        ) : (
          <TouchableOpacity onPress={onToggleBookmark} style={styles.icon}>
            <Ionicons
              name={isBookmarked ? 'star' : 'star-outline'}
              size={18}
              color={isBookmarked ? COLORS.emerald : COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {editing && suggestions.length > 0 && (
        <View style={styles.suggestBox}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, idx) => `${item}-${idx}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestRow}
                onPress={() => {
                  setText(item);
                  onSubmit(item);
                  setEditing(false);
                }}
              >
                <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.suggestText} numberOfLines={1}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 12, paddingTop: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: { width: 24, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
    paddingHorizontal: 6,
  },
  suggestBox: {
    marginTop: 6,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 220,
    overflow: 'hidden',
  },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  suggestText: { color: COLORS.textDark, fontSize: 14, flexShrink: 1 },
});
