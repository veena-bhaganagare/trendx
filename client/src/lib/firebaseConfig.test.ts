import { describe, expect, it } from "vitest";
import { getFirebaseConfig, isFirebaseConfigured } from "./firebaseConfig";

const completeEnv = {
  VITE_FIREBASE_API_KEY: "api-key",
  VITE_FIREBASE_AUTH_DOMAIN: "trendx.firebaseapp.com",
  VITE_FIREBASE_PROJECT_ID: "trendx",
  VITE_FIREBASE_STORAGE_BUCKET: "trendx.firebasestorage.app",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "123456789",
  VITE_FIREBASE_APP_ID: "1:123456789:web:abc123",
};

describe("Firebase client configuration", () => {
  it("maps all six Web App values and recognizes a complete config", () => {
    const config = getFirebaseConfig(completeEnv);
    expect(config.projectId).toBe("trendx");
    expect(config.appId).toBe("1:123456789:web:abc123");
    expect(isFirebaseConfigured(config)).toBe(true);
  });

  it("does not treat missing values as a configured Firebase app", () => {
    const config = getFirebaseConfig({ VITE_FIREBASE_API_KEY: "only-one-value" });
    expect(isFirebaseConfigured(config)).toBe(false);
  });
});
