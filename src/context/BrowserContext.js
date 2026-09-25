import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BrowserContext = createContext(null);

const HOME_URL = 'https://www.google.com';
const STORAGE_KEYS = {
  history: '6ieme-oeil:history',
  bookmarks: '6ieme-oeil:bookmarks',
  settings: '6ieme-oeil:settings',
};

let tabIdCounter = 0;
function makeTab(url = HOME_URL) {
  tabIdCounter += 1;
  return {
    id: `tab-${Date.now()}-${tabIdCounter}`,
    url,
    title: 'Nouvel onglet',
    isPrivate: false,
    createdAt: Date.now(),
  };
}

export function BrowserProvider({ children }) {
  const [tabs, setTabs] = useState(() => [makeTab()]);
  const [activeTabId, setActiveTabId] = useState(() => tabs[0]?.id);
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [settings, setSettings] = useState({
    searchEngine: 'google',
    privateMode: false,
  });

  // Chargement initial depuis le stockage local
  useEffect(() => {
    (async () => {
      try {
        const [h, b, s] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.history),
          AsyncStorage.getItem(STORAGE_KEYS.bookmarks),
          AsyncStorage.getItem(STORAGE_KEYS.settings),
        ]);
        if (h) setHistory(JSON.parse(h));
        if (b) setBookmarks(JSON.parse(b));
        if (s) setSettings((prev) => ({ ...prev, ...JSON.parse(s) }));
      } catch (e) {
        // stockage indisponible, on continue avec les valeurs par défaut
      }
    })();
  }, []);

  const persist = useCallback((key, value) => {
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, []);

  const addToHistory = useCallback(
    (entry) => {
      setHistory((prev) => {
        const next = [{ ...entry, visitedAt: Date.now() }, ...prev].slice(0, 500);
        persist(STORAGE_KEYS.history, next);
        return next;
      });
    },
    [persist]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    persist(STORAGE_KEYS.history, []);
  }, [persist]);

  const toggleBookmark = useCallback(
    (entry) => {
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.url === entry.url);
        const next = exists
          ? prev.filter((b) => b.url !== entry.url)
          : [{ ...entry, savedAt: Date.now() }, ...prev];
        persist(STORAGE_KEYS.bookmarks, next);
        return next;
      });
    },
    [persist]
  );

  const isBookmarked = useCallback(
    (url) => bookmarks.some((b) => b.url === url),
    [bookmarks]
  );

  const updateSettings = useCallback(
    (partial) => {
      setSettings((prev) => {
        const next = { ...prev, ...partial };
        persist(STORAGE_KEYS.settings, next);
        return next;
      });
    },
    [persist]
  );

  const newTab = useCallback((url, isPrivate = false) => {
    const tab = { ...makeTab(url), isPrivate };
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
    return tab.id;
  }, []);

  const closeTab = useCallback(
    (tabId) => {
      setTabs((prev) => {
        const next = prev.filter((t) => t.id !== tabId);
        if (next.length === 0) {
          const fresh = makeTab();
          setActiveTabId(fresh.id);
          return [fresh];
        }
        if (activeTabId === tabId) {
          setActiveTabId(next[next.length - 1].id);
        }
        return next;
      });
    },
    [activeTabId]
  );

  const updateTab = useCallback((tabId, partial) => {
    setTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, ...partial } : t)));
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const value = {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    newTab,
    closeTab,
    updateTab,
    history,
    addToHistory,
    clearHistory,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    settings,
    updateSettings,
    HOME_URL,
  };

  return <BrowserContext.Provider value={value}>{children}</BrowserContext.Provider>;
}

export function useBrowser() {
  const ctx = useContext(BrowserContext);
  if (!ctx) throw new Error('useBrowser doit être utilisé dans un BrowserProvider');
  return ctx;
}
