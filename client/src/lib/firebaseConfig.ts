export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

type FirebaseEnv = Partial<Record<keyof FirebaseClientConfig, string>> & Record<string, string | undefined>;

export function getFirebaseConfig(env: FirebaseEnv): FirebaseClientConfig {
  return {
    apiKey: env.VITE_FIREBASE_API_KEY ?? "",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: env.VITE_FIREBASE_PROJECT_ID ?? "",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: env.VITE_FIREBASE_APP_ID ?? "",
  };
}

export function isFirebaseConfigured(config: FirebaseClientConfig) {
  return Object.values(config).every((value) => value.trim().length > 0);
}

export const firebaseConfig = getFirebaseConfig(import.meta.env);
export const firebaseConfigured = isFirebaseConfigured(firebaseConfig);
