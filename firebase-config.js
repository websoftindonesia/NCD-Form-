// Ganti nilai contoh ini dengan konfigurasi dari Firebase Console > Project settings > Your apps > SDK setup.
// Konfigurasi Web Firebase bersifat publik; keamanan data diatur melalui Firestore Rules.
export const firebaseConfig = {
  apiKey: 'GANTI_DENGAN_API_KEY',
  authDomain: 'GANTI_DENGAN_PROJECT_ID.firebaseapp.com',
  projectId: 'GANTI_DENGAN_PROJECT_ID',
  appId: 'GANTI_DENGAN_APP_ID',
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some((value) => value.startsWith('GANTI_'));
