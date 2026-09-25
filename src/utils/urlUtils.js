// Moteurs de recherche disponibles
export const SEARCH_ENGINES = {
  google: {
    name: 'Google',
    searchUrl: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    suggestUrl: (q) =>
      `https://www.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`,
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    searchUrl: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
    suggestUrl: (q) =>
      `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&type=list`,
  },
  bing: {
    name: 'Bing',
    searchUrl: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    suggestUrl: (q) =>
      `https://www.bing.com/osjson.aspx?query=${encodeURIComponent(q)}`,
  },
};

// Détecte si le texte saisi ressemble à une URL plutôt qu'à une recherche
export function looksLikeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return false;

  // Déjà un schéma explicite
  if (/^[a-zA-Z]+:\/\//.test(trimmed)) return true;

  // Pas d'espace + présence d'un point suivi d'un TLD plausible
  if (!/\s/.test(trimmed) && /^[\w-]+(\.[\w-]+)+(:\d+)?(\/.*)?$/.test(trimmed)) {
    return true;
  }

  // localhost ou adresse IP
  if (/^localhost(:\d+)?/.test(trimmed)) return true;
  if (/^(\d{1,3}\.){3}\d{1,3}(:\d+)?/.test(trimmed)) return true;

  return false;
}

// Normalise l'entrée utilisateur en une URL chargeable, ou construit une recherche
export function resolveInputToUrl(input, engineKey = 'google') {
  const trimmed = input.trim();
  const engine = SEARCH_ENGINES[engineKey] || SEARCH_ENGINES.google;

  if (looksLikeUrl(trimmed)) {
    if (!/^[a-zA-Z]+:\/\//.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }

  return engine.searchUrl(trimmed);
}

// Extrait un nom de domaine lisible à afficher dans la barre d'adresse
export function extractDomain(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
}
