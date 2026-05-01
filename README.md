# Serein 🌿

> A mental health support app for Indian college students studying abroad.

Serein combines AI-powered emotional support with daily journaling and mood tracking — all designed with deep cultural awareness around the unique pressures faced by Indian students abroad.

---

## Features

- **AI Chat** — Conversational support powered by Claude, with culturally-aware prompting (family pressure, academic expectations, immigration stress, cultural identity)
- **Daily Journal** — Private, mood-tagged journal entries
- **Mood Dashboard** — Trend charts over 7 or 30 days
- **User Auth** — Email/password registration and login (Google OAuth ready)
- **Resources** — Crisis hotlines and culturally relevant mental health content

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo (SDK 52) |
| Navigation | Expo Router v4 |
| State | Zustand |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| AI | Anthropic Claude API |
| Auth | JWT |
| Deployment | Railway (backend), Expo Go / EAS Build (mobile) |

---

## Project Structure

```
serein/
├── backend/          Node.js/Express API
│   └── src/
│       ├── config/   Database connection
│       ├── models/   Mongoose schemas
│       ├── routes/   auth, journal, mood, chat
│       ├── middleware/ JWT auth guard
│       └── services/ Claude API wrapper
└── mobile/           React Native Expo app
    ├── app/
    │   ├── (auth)/   Login & Register screens
    │   └── (tabs)/   Dashboard, Chat, Journal, Resources
    ├── components/   Reusable UI components
    ├── services/     Axios API client
    ├── store/        Zustand state stores
    └── constants/    Theme, resources data
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Anthropic API key
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, ANTHROPIC_API_KEY
npm run dev
```

### Mobile Setup

```bash
cd mobile
npm install
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your backend URL
npx expo start
```

Then scan the QR code with **Expo Go** (iOS/Android).

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs (min 32 chars) |
| `JWT_EXPIRES_IN` | Token TTL (default: `7d`) |
| `ANTHROPIC_API_KEY` | Your Claude API key |
| `CLAUDE_MODEL` | Model name (default: `claude-opus-4-5`) |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins |
| `NODE_ENV` | `development` or `production` |

### Mobile (`mobile/.env`)

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Backend base URL |

---

## Deployment

### Backend → Railway

1. Push the `backend/` folder to a GitHub repo (or use a monorepo with root set to `backend/`)
2. Create a new Railway project, connect the repo
3. Add environment variables in Railway dashboard
4. Railway auto-detects Node.js and deploys via `railway.json`

### Mobile → Expo Go (sharing)

```bash
cd mobile
npx expo publish
```

Share the link — anyone with Expo Go can open it.

### Mobile → App Store / Google Play (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build --platform all
eas submit
```

You'll need an Apple Developer account ($99/yr) and Google Play Console account ($25 one-time).

---

## Crisis Resources

If you or someone you know is in crisis:

- **iCall (India):** 9152987821
- **Vandrevala Foundation (India, 24/7):** 1860-2662-345
- **AASRA (India, 24/7):** 9820466627
- **988 Lifeline (US):** 988
- **Crisis Text Line (US):** Text HOME to 741741
- **Samaritans (UK):** 116 123
- **Lifeline (Australia):** 13 11 14

---

## License

MIT
