# TrendX

TrendX is a React + Vite intelligence-feed prototype with a simple white dashboard, interests onboarding, Google sign-in, and Email/Password sign-in support through Firebase.

## Local setup

```bash
pnpm install
pnpm dev
```

The project currently runs as a full-stack WebDev app. The frontend lives in `client/` and uses the existing server/auth scaffolding for local preview.

## Firebase setup

1. Create or open a Firebase project.
2. Enable **Google** and **Email/Password** providers under Firebase Authentication.
3. Register a Firebase Web App and copy its client configuration.
4. Set these Vite variables in your local environment or in the hosting provider; do not commit real credentials:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

The client-side adapter is in `client/src/firebase.js`. Firebase web configuration values are intended for browser use, but access rules and authentication provider settings must still be configured in Firebase Console.

## Useful commands

```bash
pnpm test
pnpm check
pnpm build
```

## Collaboration

Create a feature branch for each change, run the checks above, and open a pull request into `main`.
