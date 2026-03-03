/* ============================================
   BioArchive - Yapilandirma
   ============================================ */

const Config = {
  // API base URL - Production'da degistirin
  API_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://api.bioarchive.com.tr/api',

  // Uygulama bilgileri
  APP_NAME: 'BioArchive',
  APP_VERSION: '1.0.0',

  // LocalStorage anahtarlari
  STORAGE_KEYS: {
    THEME: 'bioarchive-theme',
    TOKEN: 'bioarchive-token',
    REFRESH_TOKEN: 'bioarchive-refresh-token',
    USER: 'bioarchive-user',
    POSTS: 'bioarchive-posts',
    SAVED: 'bioarchive-saved',
    MESSAGES: 'bioarchive-messages',
  },

  // Sayfalama
  POSTS_PER_PAGE: 20,

  // Chat
  MAX_MESSAGE_LENGTH: 5000,
  MAX_CHAT_HISTORY: 50,

  // Dosya yukleme
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};
