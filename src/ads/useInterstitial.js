import { useCallback, useEffect, useRef } from 'react';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import {
  INTERSTITIAL_UNIT_ID,
  INTERSTITIAL_EVERY_N_PAGES,
  INTERSTITIAL_MIN_GAP_MS,
} from './adConfig';

// Pub plein écran affichée rarement : toutes les N pages ET au plus
// une fois toutes les quelques minutes. Jamais au démarrage de l'appli.
export function useInterstitial() {
  const adRef = useRef(null);
  const loadedRef = useRef(false);
  const lastShownRef = useRef(Date.now());
  const pagesRef = useRef(0);
  const retryRef = useRef(null);

  const load = useCallback(() => {
    loadedRef.current = false;
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID);
    ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true;
    });
    ad.addAdEventListener(AdEventType.CLOSED, () => {
      lastShownRef.current = Date.now();
      load();
    });
    ad.addAdEventListener(AdEventType.ERROR, () => {
      loadedRef.current = false;
      clearTimeout(retryRef.current);
      retryRef.current = setTimeout(load, 60000);
    });
    ad.load();
    adRef.current = ad;
  }, []);

  useEffect(() => {
    load();
    return () => clearTimeout(retryRef.current);
  }, [load]);

  const onPageLoaded = useCallback(() => {
    pagesRef.current += 1;
    if (!loadedRef.current) return;
    if (pagesRef.current < INTERSTITIAL_EVERY_N_PAGES) return;
    if (Date.now() - lastShownRef.current < INTERSTITIAL_MIN_GAP_MS) return;
    pagesRef.current = 0;
    loadedRef.current = false;
    adRef.current?.show().catch(() => {});
  }, []);

  return { onPageLoaded };
}
