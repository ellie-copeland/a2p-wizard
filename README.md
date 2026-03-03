# A2P 10DLC Registration Wizard

Embeddable, modular wizard for A2P 10DLC brand and campaign registration. Built with Next.js.

## Quick Start

### Option 1: Direct iframe

```html
<iframe
  src="https://a2p-wizard.vercel.app/embed?accountId=abc123&webhook=https://yourapp.com/a2p-callback"
  style="width:100%;min-height:600px;border:none;"
  title="A2P Registration"
></iframe>
```

### Option 2: JS SDK (recommended)

```html
<div id="wizard"></div>
<script src="https://a2p-wizard.vercel.app/sdk.js"></script>
<script>
  A2PWizard.init({
    container: '#wizard',
    accountId: 'your-account-id',
    telnyxApiKey: 'key_xxx',           // passed securely via postMessage, never in URL
    googlePlacesKey: 'xxx',            // optional
    webhookUrl: 'https://yourapp.com/a2p-callback',
    theme: {
      primaryColor: '#020617',
      backgroundColor: '#F7F9FC',
      borderColor: '#E2E8F0',
      fontFamily: 'Inter',
      borderRadius: '5px',
    },
    branding: {
      logoUrl: 'https://yourcdn.com/logo.svg',
      companyName: 'YourBrand',
    },
    prefill: {
      businessType: 'PRIVATE_PROFIT',
      displayName: 'Acme Inc',
      legalName: 'Acme Corporation LLC',
      ein: '123456789',
    },
    onReady: () => console.log('Wizard loaded'),
    onStepChange: (step, data) => console.log('Step', step, data),
    onComplete: (data) => console.log('Complete', data),
    onError: (err) => console.error('Error', err),
  });
</script>
```

## Config Reference

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `container` | `string \| HTMLElement` | Yes (SDK) | CSS selector or DOM element |
| `accountId` | `string` | Yes | Identifies the linked account |
| `telnyxApiKey` | `string` | No | Telnyx API key (sent via postMessage, not URL) |
| `googlePlacesKey` | `string` | No | Google Places key for address autocomplete |
| `webhookUrl` | `string` | No | URL to POST complete data on submission |
| `baseUrl` | `string` | No | Override wizard URL (auto-detected from SDK script src) |
| `allowedOrigins` | `string[]` | No | Restrict postMessage origins |
| `theme` | `object` | No | Visual overrides (see below) |
| `branding` | `object` | No | White-label options (see below) |
| `prefill` | `object` | No | Pre-fill form fields (see below) |

### Theme

| Key | Default | Description |
|-----|---------|-------------|
| `primaryColor` | `#020617` | Buttons, active states |
| `backgroundColor` | `#F7F9FC` | Page background |
| `borderColor` | `#E2E8F0` | Card and input borders |
| `fontFamily` | `Inter` | Font family |
| `borderRadius` | `5px` | Border radius |

### Branding

| Key | Description |
|-----|-------------|
| `logoUrl` | Logo image URL shown in header |
| `companyName` | Company name shown in header |

### Prefill Fields

`businessType`, `displayName`, `legalName`, `ein`, `vertical`, `volume`, `website`, `firstName`, `lastName`, `email`, `phone`, `street`, `city`, `state`, `postalCode`, `useCase`, `description`, `sampleMessage1`, `sampleMessage2`, `messageFlow`

## Callbacks

### `onReady()`

Fires when the wizard iframe is loaded and ready.

### `onStepChange(step: number, data: object)`

Fires on every step navigation. `step` is 0-indexed (0 = Business Type, 6 = Confirmation).

### `onComplete(data: RegistrationData)`

Fires on final submission. Data structure:

```typescript
interface RegistrationData {
  accountId: string;
  brand: {
    entityType: string;
    displayName: string;
    legalName: string;
    ein: string;
    vertical: string;
    volume: string;
    website: string;
    contact: { firstName: string; lastName: string; email: string; phone: string };
    address: { street: string; city: string; state: string; postalCode: string };
  };
  campaign: {
    useCase: string;
    description: string;
    sampleMessages: string[];
    messageFlow: string;
  };
  compliance: {
    optIn: { message: string; keywords: string };
    optOut: { message: string; keywords: string };
    help: { message: string; keywords: string };
    flags: {
      optIn: boolean; optOut: boolean; help: boolean;
      embeddedLinks: boolean; phoneNumbers: boolean; numberPool: boolean;
      ageGated: boolean; directLending: boolean; autoRenewal: boolean;
    };
  };
  termsAccepted: boolean;
  submittedAt: string; // ISO 8601
}
```

### `onError(error: { code: string; message: string })`

Fires on validation or network errors. Error codes: `WEBHOOK_ERROR`.

## Webhook

If `webhookUrl` is provided, the wizard POSTs the complete `RegistrationData` JSON to it on submission (client-side `fetch`). For production, proxy through your backend to add authentication and retry logic.

## Security

- **API keys** (`telnyxApiKey`, `googlePlacesKey`) are never included in the iframe URL. The SDK sends them via `postMessage` after the iframe loads.
- **Origin validation**: Set `allowedOrigins` to restrict which parent pages can communicate with the wizard.
- **Input sanitization**: All string inputs are trimmed and stripped of `<>` characters.
- The `/embed` route accepts only non-sensitive config via URL params (accountId, branding, theme, prefill data).

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Standalone wizard (no accountId required) |
| `/embed` | Embeddable wizard (accountId via params, no chrome) |
| `/sdk.js` | JavaScript SDK (static file) |

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```
