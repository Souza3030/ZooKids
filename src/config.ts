export const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ??
    "AIzaSyD1S8wOthzWaAewFWiUWMRQTEme6wYoTiI",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ??
    "zookids-95d7f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "zookids-95d7f",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ??
    "1:93465973556:web:feb6706892c66b3584cb61",
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
export const adminEmail = "acessozookids@gmail.com";
