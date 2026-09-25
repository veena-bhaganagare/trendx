import { describe, expect, it } from "vitest";

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const apiKey = process.env.VITE_FIREBASE_API_KEY;

const testLiveFirebase = projectId && apiKey ? it : it.skip;

describe("live Firebase web configuration", () => {
  testLiveFirebase("accepts the configured project and API key", async () => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${encodeURIComponent(apiKey ?? "")}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: "firebase-auth-health-check@example.com",
          continueUri: "https://example.com/",
        }),
      },
    );

    expect(response.ok).toBe(true);
    const payload = (await response.json()) as { kind?: string };
    expect(payload.kind).toBe("identitytoolkit#CreateAuthUriResponse");
  }, 15000);
});
