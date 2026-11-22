import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_UNIT_ID } from './adConfig';
import { COLORS } from '../theme';

export default function AdBanner() {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Publicité</Text>
      <BannerAd
        unitId={BANNER_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingTop: 4,
    marginBottom: 8,
  },
  label: { fontSize: 10, color: COLORS.textMuted, marginBottom: 2 },
});
