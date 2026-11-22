import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text, Share } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import AddressBar from '../components/AddressBar';
import ToolBar from '../components/ToolBar';
import MenuSheet from '../components/MenuSheet';
import StartPage from '../components/StartPage';
import AdBanner from '../ads/AdBanner';
import { useInterstitial } from '../ads/useInterstitial';
import { useBrowser } from '../context/BrowserContext';
import { resolveInputToUrl, isHome, HOME_URL } from '../utils/urlUtils';
import { downloadFile } from '../utils/downloadHandler';
import { COLORS } from '../theme';

export default function BrowserScreen() {
  const navigation = useNavigation();
  const webviewRef = useRef(null);
  const {
    activeTab,
    updateTab,
    addToHistory,
    history,
    bookmarks,
    settings,
    isBookmarked,
    toggleBookmark,
    tabs,
    newTab,
  } = useBrowser();

  const { onPageLoaded } = useInterstitial();

  const [navState, setNavState] = useState({ canGoBack: false, canGoForward: false });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadPct, setDownloadPct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = isHome(activeTab.url);

  // Sur la page d'accueil, il n'y a pas de WebView : on remet les états à zéro
  useEffect(() => {
    if (isHomePage) {
      setNavState({ canGoBack: false, canGoForward: false });
      setLoading(false);
      setProgress(0);
    }
  }, [isHomePage, activeTab.id]);

  const historySuggestions = useMemo(
    () =>
      history
        .map((h) => h.url)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .slice(0, 8),
    [history]
  );

  const goTo = useCallback(
    (input) => {
      const url = resolveInputToUrl(input, settings.searchEngine);
      updateTab(activeTab.id, { url, title: url });
    },
    [activeTab, settings.searchEngine, updateTab]
  );

  const openUrl = useCallback(
    (url) => updateTab(activeTab.id, { url, title: url }),
    [activeTab, updateTab]
  );

  const goHome = useCallback(
    () => updateTab(activeTab.id, { url: HOME_URL, title: 'Accueil' }),
    [activeTab, updateTab]
  );

  const handleNavigationStateChange = useCallback(
    (navStateEvent) => {
      setNavState({
        canGoBack: navStateEvent.canGoBack,
        canGoForward: navStateEvent.canGoForward,
      });
      updateTab(activeTab.id, {
        url: navStateEvent.url,
        title: navStateEvent.title || navStateEvent.url,
      });
      if (!navStateEvent.loading && !activeTab.isPrivate) {
        addToHistory({ url: navStateEvent.url, title: navStateEvent.title || navStateEvent.url });
      }
    },
    [activeTab, updateTab, addToHistory]
  );

  const handleDownload = useCallback(async ({ nativeEvent }) => {
    try {
      setDownloadPct(0);
      await downloadFile(nativeEvent.downloadUrl, (pct) => setDownloadPct(pct));
      setDownloadPct(null);
    } catch (e) {
      setDownloadPct(null);
      Alert.alert(
        'Téléchargement impossible',
        "Ce fichier n'a pas pu être téléchargé. Vérifie que la source autorise le téléchargement."
      );
    }
  }, []);

  const menuItems = [
    { icon: 'add-circle-outline', label: 'Nouvel onglet', onPress: () => newTab() },
    { icon: 'eye-off-outline', label: 'Onglet privé', onPress: () => newTab(undefined, true) },
    {
      icon: 'share-social-outline',
      label: 'Partager la page',
      disabled: isHomePage,
      onPress: () => Share.share({ message: activeTab.url }).catch(() => {}),
    },
    { icon: 'time-outline', label: 'Historique', onPress: () => navigation.navigate('History') },
    { icon: 'star-outline', label: 'Favoris', onPress: () => navigation.navigate('Bookmarks') },
    { icon: 'settings-outline', label: 'Paramètres', onPress: () => navigation.navigate('Settings') },
  ];

  const isSecure = activeTab.url?.startsWith('https://');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          6<Text style={styles.logoAccent}>ième</Text> Œil
        </Text>
        {activeTab.isPrivate && (
          <View style={styles.privateBadge}>
            <Text style={styles.privateBadgeText}>Privé</Text>
          </View>
        )}
      </View>

      <AddressBar
        currentUrl={activeTab.url}
        loading={loading}
        isSecure={isSecure}
        onSubmit={goTo}
        suggestions={historySuggestions}
        hideBookmark={isHomePage}
        isBookmarked={isBookmarked(activeTab.url)}
        onToggleBookmark={() => toggleBookmark({ url: activeTab.url, title: activeTab.title })}
      />

      <View style={styles.progressTrack}>
        {loading && !isHomePage && (
          <View style={[styles.progressFill, { width: `${Math.max(progress, 0.08) * 100}%` }]} />
        )}
      </View>

      <View style={styles.webviewWrapper}>
        {isHomePage ? (
          <StartPage onSearch={goTo} onOpen={openUrl} bookmarks={bookmarks} />
        ) : (
          <WebView
            key={activeTab.id}
            ref={webviewRef}
            source={{ uri: activeTab.url }}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={() => setLoading(true)}
            onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
            onLoadEnd={() => {
              setLoading(false);
              onPageLoaded();
            }}
            onFileDownload={handleDownload}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color={COLORS.emerald} />
              </View>
            )}
            incognito={activeTab.isPrivate}
            allowsBackForwardNavigationGestures
          />
        )}

        {downloadPct !== null && (
          <View style={styles.downloadBanner}>
            <Text style={styles.downloadText}>
              Téléchargement… {Math.round(downloadPct * 100)}%
            </Text>
          </View>
        )}
      </View>

      <AdBanner />

      <ToolBar
        canGoBack={navState.canGoBack}
        canGoForward={navState.canGoForward}
        onBack={() => webviewRef.current?.goBack()}
        onForward={() => webviewRef.current?.goForward()}
        onReload={() => webviewRef.current?.reload()}
        onHome={goHome}
        onOpenTabs={() => navigation.navigate('Tabs')}
        tabCount={tabs.length}
        onOpenMenu={() => setMenuOpen(true)}
      />

      <MenuSheet visible={menuOpen} onClose={() => setMenuOpen(false)} items={menuItems} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    gap: 8,
  },
  logo: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  logoAccent: { color: COLORS.emerald },
  privateBadge: {
    backgroundColor: COLORS.textDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  privateBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  progressTrack: { height: 3, marginHorizontal: 20, marginTop: 6 },
  progressFill: { height: 3, borderRadius: 2, backgroundColor: COLORS.emerald },
  webviewWrapper: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 8,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: COLORS.bg,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  downloadBanner: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: COLORS.emerald,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  downloadText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
