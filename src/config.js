/**
 * Configuration pour le dashboard
 */

export const config = {
  // Mode de données: 'mock' pour utiliser le serveur mock local, 'live' pour les données réelles FFVB
  dataMode: 'live',

  // URLs
  mockServerUrl: 'http://localhost:3001/ffvb-data',
  liveDataUrl: 'https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php?saison=2025/2026&codent=PTBR35&poule=DMA',

  // Proxy CORS pour les données live (si nécessaire)
  corsProxy: 'https://cors-anywhere.com/'
}