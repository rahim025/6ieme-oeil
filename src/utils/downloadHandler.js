import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Extrait un nom de fichier plausible depuis une URL de téléchargement
function guessFileName(url) {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || `fichier-${Date.now()}`;
  } catch (e) {
    return `fichier-${Date.now()}`;
  }
}

// Télécharge un fichier vers le stockage local de l'app puis propose de le partager/enregistrer
export async function downloadFile(url, onProgress) {
  const fileName = guessFileName(url);
  const destination = FileSystem.documentDirectory + fileName;

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    destination,
    {},
    (progress) => {
      if (onProgress) {
        const pct =
          progress.totalBytesWritten / (progress.totalBytesExpectedToWrite || 1);
        onProgress(pct);
      }
    }
  );

  const result = await downloadResumable.downloadAsync();

  if (result && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(result.uri);
  }

  return result;
}
