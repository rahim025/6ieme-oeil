# 6ième Œil

Navigateur web mobile (Android/iOS) basé sur WebView, avec les fonctionnalités
essentielles d'un navigateur moderne type Chrome : barre d'adresse intelligente,
multi-onglets, historique, favoris, navigation privée et téléchargements.

## Fonctionnalités

- Barre d'adresse combinée (URL ou recherche automatiquement détectée)
- Suggestions basées sur l'historique
- Multi-onglets avec vue en grille
- Mode navigation privée par onglet
- Historique de navigation (consultable et effaçable)
- Favoris
- Téléchargement de fichiers vers l'appareil (avec partage/enregistrement)
- Choix du moteur de recherche (Google, DuckDuckGo, Bing)

## Stack technique

- [Expo](https://expo.dev) / React Native
- `react-native-webview`
- `@react-navigation/native` (navigation entre écrans)
- `@react-native-async-storage/async-storage` (persistance locale)
- `expo-file-system` + `expo-sharing` (téléchargements)

## Installation

```bash
npm install
npx expo start
```

Scanne le QR code avec Expo Go (Android/iOS) pour tester l'app en direct.

## Structure du projet

```
6ieme-oeil/
├── App.js
├── package.json
└── src/
    ├── context/
    │   └── BrowserContext.js   # état global : onglets, historique, favoris, réglages
    ├── screens/
    │   ├── BrowserScreen.js    # écran principal (WebView + barre d'adresse)
    │   ├── TabsScreen.js       # grille des onglets ouverts
    │   ├── HistoryScreen.js
    │   ├── BookmarksScreen.js
    │   └── SettingsScreen.js
    ├── components/
    │   ├── AddressBar.js
    │   └── ToolBar.js
    └── utils/
        ├── urlUtils.js         # détection URL vs recherche
        └── downloadHandler.js  # gestion des téléchargements WebView
```

## Publication sur GitHub

```bash
git init
git add .
git commit -m "Initial commit - 6ième Œil"
git branch -M main
git remote add origin https://github.com/<ton-utilisateur>/6ieme-oeil.git
git push -u origin main
```

Pense à ajouter un fichier `.gitignore` (node_modules, .expo, etc.) avant le
premier commit — Expo peut le générer automatiquement via `npx expo init`
si tu repars d'un projet neuf.

## Prochaines étapes possibles

- Build de production avec [EAS Build](https://docs.expo.dev/build/introduction/)
  pour générer un `.apk` / soumettre sur l'App Store
- Blocage de publicités/trackers (injection JS ou liste de filtres)
- Synchronisation des favoris entre appareils
- Mode lecture (extraction de contenu simplifié)
