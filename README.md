# A2P 10DLC Registration Wizard

A step-by-step wizard for registering brands and campaigns for A2P 10DLC messaging via Telnyx.

## Setup

```bash
npm install
cp .env.local.example .env.local  # Add your TELNYX_API_KEY
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TELNYX_API_KEY` | Your Telnyx API key (never exposed to client) |

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Add `TELNYX_API_KEY` as an environment variable in your Vercel project settings.

## Embedding

The app supports iframe embedding:

```html
<iframe src="https://your-app.vercel.app" width="100%" height="800" frameborder="0"></iframe>
```
