import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import AddressBar from '../components/AddressBar';
import ToolBar from '../components/ToolBar';
import { useBrowser } from '../context/BrowserContext';
import { resolveInputToUrl } from '../utils/urlUtils';
import { downloadFile } from '../utils/downloadHandler';

const COLORS = { bg: '#F3F4F2', emerald: '#059669' };

export default function BrowserScreen() {
  const navigation = useNavigation();
  const webviewRef = useRef(null);
  const {
    activeTab,
    updateTab,
    addToHistory,
    history,
    settings,
    isBookmarked,
    toggleBookmark,
    tabs,
    HOME_URL,
  } = useBrowser();

  const [navState, setNavState] = useState({ canGoBack: false, canGoForward: false });
  const [loading, setLoading] = useState(false);
  const [downloadPct, setDownloadPct] = useState(null);

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
      updateTab(activeTab.id, { url });
    },
    [activeTab, settings.searchEngine, updateTab]
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
        isBookmarked={isBookmarked(activeTab.url)}
        onToggleBookmark={() =>
          toggleBookmark({ url: activeTab.url, title: activeTab.title })
        }
      />

      <View style={styles.webviewWrapper}>
        <WebView
          ref={webviewRef}
          source={{ uri: activeTab.url }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
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

        {downloadPct !== null && (
          <View style={styles.downloadBanner}>
            <Text style={styles.downloadText}>
              Téléchargement… {Math.round(downloadPct * 100)}%
            </Text>
          </View>
        )}
      </View>

      <ToolBar
        canGoBack={navState.canGoBack}
        canGoForward={navState.canGoForward}
        onBack={() => webviewRef.current?.goBack()}
        onForward={() => webviewRef.current?.goForward()}
        onReload={() => webviewRef.current?.reload()}
        onHome={() => goTo(HOME_URL)}
        onOpenTabs={() => navigation.navigate('Tabs')}
        tabCount={tabs.length}
        onOpenMenu={() => showMenu(navigation)}
      />
    </SafeAreaView>
  );
}

function showMenu(navigation) {
  Alert.alert('Menu', undefined, [
    { text: 'Historique', onPress: () => navigation.navigate('History') },
    { text: 'Favoris', onPress: () => navigation.navigate('Bookmarks') },
    { text: 'Paramètres', onPress: () => navigation.navigate('Settings') },
    { text: 'Annuler', style: 'cancel' },
  ]);
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
  logo: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  logoAccent: { color: COLORS.emerald },
  privateBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  privateBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  webviewWrapper: { flex: 1, margin: 12, borderRadius: 18, overflow: 'hidden' },
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
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  downloadText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
