import { TestIds } from 'react-native-google-mobile-ads';

// true = pubs de test de Google (aucun gain, aucun risque pour ton compte).
// Passe à false seulement quand AdMob a approuvé l'appli et que tu as rempli
// les deux ID ci-dessous.
export const USE_TEST_ADS = true;

// ID de tes blocs AdMob (format ca-app-pub-XXXX/YYYY).
// Crée un bloc « Bannière » et un bloc « Interstitiel » dans AdMob.
const REAL_UNITS = {
  banner: 'ca-app-pub-5111098925112092/9375091744',
  interstitial: 'ca-app-pub-5111098925112092/3464289516',
};

export const BANNER_UNIT_ID =
  USE_TEST_ADS || !REAL_UNITS.banner ? TestIds.BANNER : REAL_UNITS.banner;

export const INTERSTITIAL_UNIT_ID =
  USE_TEST_ADS || !REAL_UNITS.interstitial
    ? TestIds.INTERSTITIAL
    : REAL_UNITS.interstitial;

// Fréquence de l'interstitiel : assez rare pour ne pas gêner la navigation.
export const INTERSTITIAL_EVERY_N_PAGES = 6;
export const INTERSTITIAL_MIN_GAP_MS = 3 * 60 * 1000;
