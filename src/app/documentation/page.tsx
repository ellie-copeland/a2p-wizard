"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Section Data ────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "getting-started", title: "Getting Started" },
  { id: "iframe-embed", title: "Iframe Embed" },
  { id: "js-sdk", title: "JS SDK" },
  { id: "configuration", title: "Configuration" },
  { id: "callbacks", title: "Callbacks" },
  { id: "webhooks", title: "Webhooks" },
  { id: "theming", title: "Theming" },
  { id: "prefill", title: "Prefill" },
  { id: "security", title: "Security" },
  { id: "data-structure", title: "Data Structure" },
];

// ─── Code Block Component ────────────────────────────────────────────────────

function CodeBlock({ code, language = "typescript" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="relative group rounded-[5px] overflow-hidden border border-[#2d2d3f]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e] border-b border-[#2d2d3f]">
        <span className="text-[10px] font-medium text-[#7F7F7F] uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="text-[10px] font-medium text-[#7F7F7F] hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6L5 8L9 4" stroke="#12B76A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Copied</>
          ) : (
            <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="4" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M8 4V2.5A1 1 0 007 1.5H2.5A1 1 0 001.5 2.5V7a1 1 0 001 1H4" stroke="currentColor" strokeWidth="1.2"/></svg>Copy</>
          )}
        </button>
      </div>
      <pre className="p-4 bg-[#1e1e2e] overflow-x-auto"><code className="text-[12px] leading-relaxed text-[#e0def4] font-mono whitespace-pre">{code}</code></pre>
    </div>
  );
}

// ─── Table Component ─────────────────────────────────────────────────────────

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-[5px] border border-[#E2E8F0]">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#F1F3F5]">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-2.5 font-semibold text-[#020617] border-b border-[#E2E8F0] whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#E2E8F0] last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 ${j === 0 ? "font-mono text-[#7C3AED] text-[11px]" : "text-[#4B5563]"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Inline Code ─────────────────────────────────────────────────────────────

function IC({ children }: { children: React.ReactNode }) {
  return <code className="px-1.5 py-0.5 bg-[#F1F3F5] rounded-[3px] text-[11px] font-mono text-[#7C3AED]">{children}</code>;
}

// ─── Callout ─────────────────────────────────────────────────────────────────

function Callout({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" }) {
  const styles = type === "info"
    ? "bg-[#F0F4FF] border-[#D0DBFF] text-[#3B5BDB]"
    : "bg-[#FFF8F0] border-[#FFE0B2] text-[#E65100]";
  return (
    <div className={`flex gap-2.5 px-4 py-3 rounded-[5px] border text-xs leading-relaxed ${styles}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M8 7V11M8 5.5V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <div>{children}</div>
    </div>
  );
}

// ─── Section Content ─────────────────────────────────────────────────────────

function SectionGettingStarted() {
  return (
    <section id="getting-started" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">Getting Started</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        The A2P 10DLC Registration Wizard is an embeddable, multi-step form that guides users through brand and campaign registration for A2P 10DLC messaging compliance. It handles business entity selection, brand information, campaign setup, compliance configuration, and final submission — all in a polished, production-ready UI.
      </p>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
        You can integrate the wizard in two ways: a simple <strong>iframe embed</strong> for zero-dependency integration, or the <strong>JavaScript SDK</strong> for full programmatic control with callbacks, secure API key handling, and auto-resizing.
      </p>
      <h3 className="text-sm font-semibold text-[#020617] mb-3">Quick Start (SDK)</h3>
      <CodeBlock language="html" code={`<div id="wizard"></div>
<script src="https://a2p-wizard.vercel.app/sdk.js"></script>
<script>
  A2PWizard.init({
    container: '#wizard',
    accountId: 'your-account-id',
    webhookUrl: 'https://yourapp.com/a2p-callback',
    onComplete: (data) => console.log('Registration complete', data),
  });
</script>`} />
      <div className="mt-4">
        <Callout>
          The wizard is hosted at <IC>https://a2p-wizard.vercel.app</IC>. All integration methods load from this URL by default.
        </Callout>
      </div>
    </section>
  );
}

function SectionIframeEmbed() {
  return (
    <section id="iframe-embed" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">Iframe Embed</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        The simplest integration method. Embed the wizard directly with an iframe tag. Configuration is passed via URL parameters.
      </p>
      <CodeBlock language="html" code={`<iframe
  src="https://a2p-wizard.vercel.app/embed?accountId=abc123&webhook=https://yourapp.com/a2p-callback"
  style="width:100%;min-height:600px;border:none;"
  title="A2P Registration"
></iframe>`} />
      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">URL Parameters</h3>
      <Table
        headers={["Parameter", "Description"]}
        rows={[
          ["accountId", "Required. Identifies the linked account."],
          ["webhook", "URL to POST complete registration data on submission."],
          ["allowedOrigins", "Comma-separated list of allowed parent origins."],
          ["logoUrl", "Logo image URL for white-label branding."],
          ["companyName", "Company name shown in the wizard header."],
          ["primaryColor", "Primary color for buttons and active states."],
          ["backgroundColor", "Page background color."],
          ["borderColor", "Border color for cards and inputs."],
          ["fontFamily", "Font family name."],
          ["borderRadius", "Border radius value (e.g. 5px)."],
          ["prefill_*", "Prefill any form field (e.g. prefill_displayName=Acme)."],
        ]}
      />
      <div className="mt-4">
        <Callout type="warning">
          Never include API keys in iframe URLs. Sensitive credentials like <IC>telnyxApiKey</IC> and <IC>googlePlacesKey</IC> should only be sent via the SDK&apos;s postMessage mechanism.
        </Callout>
      </div>
    </section>
  );
}

function SectionJsSdk() {
  return (
    <section id="js-sdk" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">JavaScript SDK</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        The SDK provides full programmatic control over the wizard: callbacks, secure API key delivery via postMessage, automatic iframe resizing, and theme/branding customization.
      </p>
      <h3 className="text-sm font-semibold text-[#020617] mb-3">Installation</h3>
      <CodeBlock language="html" code={`<script src="https://a2p-wizard.vercel.app/sdk.js"></script>`} />
      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">Full Example</h3>
      <CodeBlock language="html" code={`<div id="wizard"></div>
<script src="https://a2p-wizard.vercel.app/sdk.js"></script>
<script>
  A2PWizard.init({
    container: '#wizard',
    accountId: 'your-account-id',
    telnyxApiKey: 'key_xxx',           // sent via postMessage, never in URL
    googlePlacesKey: 'AIza...',        // optional, enables address autocomplete
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
</script>`} />
      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">Methods</h3>
      <Table
        headers={["Method", "Description"]}
        rows={[
          ["A2PWizard.init(config)", "Initialize the wizard with the given config. Returns the A2PWizard instance."],
          ["A2PWizard.destroy()", "Remove the wizard iframe and clean up."],
        ]}
      />
      <div className="mt-4">
        <Callout>
          The SDK auto-detects its base URL from the script tag <IC>src</IC> attribute. Override with <IC>baseUrl</IC> if needed.
        </Callout>
      </div>
    </section>
  );
}

function SectionConfiguration() {
  return (
    <section id="configuration" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">Configuration</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        Complete reference for all configuration options passed to <IC>A2PWizard.init()</IC>.
      </p>
      <Table
        headers={["Parameter", "Type", "Required", "Default", "Description"]}
        rows={[
          ["container", "string | HTMLElement", "Yes (SDK)", "—", "CSS selector or DOM element to mount the wizard into."],
          ["accountId", "string", "Yes", "—", "Identifies the linked account for the registration."],
          ["telnyxApiKey", "string", "No", "—", "Telnyx API key. Sent securely via postMessage, never in URL."],
          ["googlePlacesKey", "string", "No", "—", "Google Places API key for address autocomplete."],
          ["webhookUrl", "string", "No", "—", "URL to POST complete registration data on submission."],
          ["baseUrl", "string", "No", "Auto-detected", "Override the wizard base URL."],
          ["allowedOrigins", "string[]", "No", "[] (all)", "Restrict which parent origins can communicate via postMessage."],
          ["theme", "object", "No", "See Theming", "Visual customization overrides."],
          ["branding", "object", "No", "—", "White-label branding options."],
          ["prefill", "object", "No", "—", "Pre-fill form fields with initial values."],
          ["onReady", "() => void", "No", "—", "Called when the wizard iframe is loaded and ready."],
          ["onStepChange", "(step, data) => void", "No", "—", "Called on every step navigation."],
          ["onComplete", "(data) => void", "No", "—", "Called on final submission with complete registration data."],
          ["onError", "(error) => void", "No", "—", "Called on validation or network errors."],
        ]}
      />
    </section>
  );
}

function SectionCallbacks() {
  return (
    <section id="callbacks" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">Callbacks</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        The SDK fires callbacks at key lifecycle events. All callbacks are optional.
      </p>

      <h3 className="text-sm font-semibold text-[#020617] mb-3">onReady</h3>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-3">Fires when the wizard iframe is loaded and ready to accept input.</p>
      <CodeBlock language="typescript" code={`onReady: () => void

// Example
A2PWizard.init({
  // ...
  onReady: () => {
    console.log('Wizard is ready');
    document.getElementById('loading')?.remove();
  },
});`} />

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">onStepChange</h3>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-3">Fires on every step navigation. <IC>step</IC> is 0-indexed (0 = Business Type, 6 = Confirmation). <IC>data</IC> contains the current step&apos;s form values.</p>
      <CodeBlock language="typescript" code={`onStepChange: (step: number, data: Record<string, unknown>) => void

// Steps: 0=Business Type, 1=Business Info, 2=Brand Review,
//         3=Campaign Setup, 4=Compliance, 5=Campaign Review, 6=Confirmation

// Example
A2PWizard.init({
  // ...
  onStepChange: (step, data) => {
    analytics.track('wizard_step', { step, ...data });
    updateProgressUI(step);
  },
});`} />

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">onComplete</h3>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-3">Fires on final submission with the complete <IC>RegistrationData</IC> payload.</p>
      <CodeBlock language="typescript" code={`onComplete: (data: RegistrationData) => void

// Example
A2PWizard.init({
  // ...
  onComplete: (data) => {
    // Save to your backend
    fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    showSuccessMessage();
  },
});`} />

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">onError</h3>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-3">Fires on validation or network errors.</p>
      <CodeBlock language="typescript" code={`onError: (error: { code: string; message: string }) => void

// Error codes: 'WEBHOOK_ERROR'

// Example
A2PWizard.init({
  // ...
  onError: (err) => {
    console.error(\`[\${err.code}] \${err.message}\`);
    Sentry.captureException(new Error(err.message));
  },
});`} />
    </section>
  );
}

function SectionWebhooks() {
  return (
    <section id="webhooks" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">Webhooks</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        When <IC>webhookUrl</IC> is configured, the wizard sends a <IC>POST</IC> request with the complete registration data as JSON on submission. The request is made client-side from the user&apos;s browser.
      </p>

      <h3 className="text-sm font-semibold text-[#020617] mb-3">Delivery</h3>
      <CodeBlock language="http" code={`POST https://yourapp.com/a2p-callback
Content-Type: application/json

{
  "accountId": "abc123",
  "brand": { ... },
  "campaign": { ... },
  "compliance": { ... },
  "termsAccepted": true,
  "submittedAt": "2025-01-15T12:00:00.000Z"
}`} />

      <div className="mt-4">
        <Callout type="warning">
          The webhook is delivered via a client-side <IC>fetch()</IC> call. For production use, proxy through your backend to add authentication headers, retry logic, and error handling. CORS headers must be configured on your webhook endpoint.
        </Callout>
      </div>

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">Error Handling</h3>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-3">
        If the webhook request fails, the <IC>onError</IC> callback fires with code <IC>WEBHOOK_ERROR</IC>. The wizard still shows the success confirmation — webhook failures don&apos;t block the user experience.
      </p>
    </section>
  );
}

function SectionTheming() {
  return (
    <section id="theming" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">Theming</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        Customize the wizard&apos;s appearance to match your brand using the <IC>theme</IC> and <IC>branding</IC> config options.
      </p>

      <h3 className="text-sm font-semibold text-[#020617] mb-3">Theme Options</h3>
      <Table
        headers={["Key", "Type", "Default", "Description"]}
        rows={[
          ["primaryColor", "string", "#020617", "Buttons, active states, progress bar."],
          ["backgroundColor", "string", "#F7F9FC", "Page background color."],
          ["borderColor", "string", "#E2E8F0", "Card and input border color."],
          ["fontFamily", "string", "Inter", "Font family for all text."],
          ["borderRadius", "string", "5px", "Border radius for cards and inputs."],
        ]}
      />

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">Branding Options</h3>
      <Table
        headers={["Key", "Type", "Description"]}
        rows={[
          ["logoUrl", "string", "Logo image URL displayed in the wizard header."],
          ["companyName", "string", "Company name shown next to the logo in the header."],
        ]}
      />

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">Example: Custom Theme</h3>
      <CodeBlock language="javascript" code={`A2PWizard.init({
  container: '#wizard',
  accountId: 'abc123',
  theme: {
    primaryColor: '#6366F1',       // Indigo buttons
    backgroundColor: '#FAFAFA',    // Light gray background
    borderColor: '#D1D5DB',        // Subtle borders
    fontFamily: 'Helvetica Neue',
    borderRadius: '8px',           // Rounder corners
  },
  branding: {
    logoUrl: 'https://yourcdn.com/logo.svg',
    companyName: 'Acme Corp',
  },
});`} />
    </section>
  );
}

function SectionPrefill() {
  return (
    <section id="prefill" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">Prefill</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        Pre-populate form fields with known data to streamline the registration process. Prefill values are passed via the <IC>prefill</IC> config option (SDK) or as <IC>prefill_*</IC> URL parameters (iframe).
      </p>

      <h3 className="text-sm font-semibold text-[#020617] mb-3">Available Fields</h3>
      <Table
        headers={["Field", "Step", "Description"]}
        rows={[
          ["businessType", "Business Type", "Entity type: PRIVATE_PROFIT, PUBLIC_PROFIT, NON_PROFIT, GOVERNMENT, SOLE_PROPRIETOR"],
          ["displayName", "Business Info", "Brand display name"],
          ["legalName", "Business Info", "Legal company name (must match IRS records)"],
          ["ein", "Business Info", "Employer Identification Number"],
          ["vertical", "Business Info", "Industry vertical (e.g. Technology, Healthcare)"],
          ["volume", "Business Info", "Monthly message volume range"],
          ["website", "Business Info", "Company website URL"],
          ["firstName", "Business Info", "Contact first name"],
          ["lastName", "Business Info", "Contact last name"],
          ["email", "Business Info", "Contact email address"],
          ["phone", "Business Info", "Contact phone number"],
          ["street", "Business Info", "Street address"],
          ["city", "Business Info", "City"],
          ["state", "Business Info", "US state code (e.g. CA, NY)"],
          ["postalCode", "Business Info", "ZIP code"],
          ["useCase", "Campaign Setup", "Campaign use case"],
          ["description", "Campaign Setup", "Campaign description"],
          ["sampleMessage1", "Campaign Setup", "First sample message"],
          ["sampleMessage2", "Campaign Setup", "Second sample message"],
          ["messageFlow", "Campaign Setup", "Message flow description"],
        ]}
      />

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">SDK Example</h3>
      <CodeBlock language="javascript" code={`A2PWizard.init({
  container: '#wizard',
  accountId: 'abc123',
  prefill: {
    businessType: 'PRIVATE_PROFIT',
    displayName: 'Acme Inc',
    legalName: 'Acme Corporation LLC',
    ein: '123456789',
    vertical: 'Technology',
    website: 'https://acme.com',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@acme.com',
  },
});`} />

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">Iframe Example</h3>
      <CodeBlock language="html" code={`<iframe
  src="https://a2p-wizard.vercel.app/embed?accountId=abc123&prefill_displayName=Acme%20Inc&prefill_ein=123456789&prefill_businessType=PRIVATE_PROFIT"
  style="width:100%;min-height:600px;border:none;"
></iframe>`} />
    </section>
  );
}

function SectionSecurity() {
  return (
    <section id="security" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">Security</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        The wizard is designed with security best practices for cross-origin iframe communication.
      </p>

      <h3 className="text-sm font-semibold text-[#020617] mb-3">API Key Handling</h3>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-3">
        Sensitive credentials (<IC>telnyxApiKey</IC>, <IC>googlePlacesKey</IC>) are <strong>never</strong> included in the iframe URL. The SDK sends them securely via <IC>postMessage</IC> after the iframe loads and reports ready.
      </p>
      <CodeBlock language="javascript" code={`// SDK internally sends keys via postMessage:
iframe.contentWindow.postMessage({
  source: 'a2p-wizard-sdk',
  type: 'config',
  telnyxApiKey: 'key_xxx',
  googlePlacesKey: 'AIza...',
}, wizardOrigin);`} />

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">Origin Validation</h3>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-3">
        Use <IC>allowedOrigins</IC> to restrict which parent pages can communicate with the wizard. When set, the wizard ignores postMessage events from unlisted origins.
      </p>
      <CodeBlock language="javascript" code={`A2PWizard.init({
  container: '#wizard',
  accountId: 'abc123',
  allowedOrigins: ['https://yourapp.com', 'https://staging.yourapp.com'],
});`} />

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">Input Sanitization</h3>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-3">
        All string inputs are automatically trimmed and stripped of <IC>&lt;&gt;</IC> characters to prevent XSS injection. Values are capped at 4,096 characters.
      </p>

      <h3 className="text-sm font-semibold text-[#020617] mt-6 mb-3">Best Practices</h3>
      <ul className="space-y-2 text-sm text-[#4B5563]">
        <li className="flex items-start gap-2"><span className="text-[#12B76A] mt-0.5">✓</span> Always set <IC>allowedOrigins</IC> in production.</li>
        <li className="flex items-start gap-2"><span className="text-[#12B76A] mt-0.5">✓</span> Use the SDK instead of bare iframes to keep API keys out of URLs.</li>
        <li className="flex items-start gap-2"><span className="text-[#12B76A] mt-0.5">✓</span> Proxy webhook calls through your backend to add auth headers.</li>
        <li className="flex items-start gap-2"><span className="text-[#12B76A] mt-0.5">✓</span> Validate webhook payloads server-side before processing.</li>
        <li className="flex items-start gap-2"><span className="text-[#F26262] mt-0.5">✗</span> Never expose API keys in client-side code or URL params.</li>
      </ul>
    </section>
  );
}

function SectionDataStructure() {
  return (
    <section id="data-structure" className="scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#020617] mb-2">Data Structure</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
        The complete TypeScript interface for the registration payload delivered via <IC>onComplete</IC> and webhooks.
      </p>
      <CodeBlock language="typescript" code={`interface RegistrationData {
  accountId: string;
  brand: {
    entityType: string;       // PRIVATE_PROFIT | PUBLIC_PROFIT | NON_PROFIT | GOVERNMENT | SOLE_PROPRIETOR
    displayName: string;
    legalName: string;
    ein: string;
    vertical: string;
    volume: string;
    website: string;
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
    };
  };
  campaign: {
    useCase: string;
    description: string;
    sampleMessages: string[];  // Array of 2 sample messages
    messageFlow: string;
  };
  compliance: {
    optIn: {
      message: string;
      keywords: string;
    };
    optOut: {
      message: string;
      keywords: string;
    };
    help: {
      message: string;
      keywords: string;
    };
    flags: {
      optIn: boolean;
      optOut: boolean;
      help: boolean;
      embeddedLinks: boolean;
      phoneNumbers: boolean;
      numberPool: boolean;
      ageGated: boolean;
      directLending: boolean;
      autoRenewal: boolean;
    };
  };
  termsAccepted: boolean;
  submittedAt: string;         // ISO 8601 timestamp
}`} />
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map(s => ({
        id: s.id,
        el: document.getElementById(s.id),
      })).filter(s => s.el);

      let current = sections[0]?.id || "getting-started";
      for (const section of sections) {
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= 100) current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNavOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9FC]" style={{ fontFamily: "Inter, -apple-system, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm font-semibold text-[#020617] hover:text-[#4B5563] transition-colors">
              A2P Wizard
            </a>
            <span className="text-[#E2E8F0]">/</span>
            <span className="text-sm text-[#4B5563]">Documentation</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs font-medium text-[#4B5563] hover:text-[#020617] transition-colors hidden sm:block">
              Live Demo →
            </a>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-1.5 rounded-[5px] hover:bg-[#F1F3F5] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 5H15M3 9H15M3 13H15" stroke="#020617" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto flex">
        {/* Sidebar */}
        <aside className={`
          ${mobileNavOpen ? "fixed inset-0 z-40 bg-white pt-14 px-6 block" : "hidden"}
          lg:block lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:w-56 lg:flex-shrink-0 lg:px-0 lg:pt-0
          lg:bg-transparent lg:z-auto
        `}>
          {mobileNavOpen && (
            <button onClick={() => setMobileNavOpen(false)} className="absolute top-4 right-4 p-2 lg:hidden">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5 5L13 13M13 5L5 13" stroke="#020617" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <nav className="py-8 pl-6 pr-4 lg:overflow-y-auto lg:h-full">
            <p className="text-[10px] font-semibold text-[#7F7F7F] uppercase tracking-wider mb-3">Documentation</p>
            <ul className="space-y-0.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left px-3 py-2 rounded-[5px] text-[13px] transition-colors ${
                      activeSection === s.id
                        ? "bg-[#020617] text-white font-medium"
                        : "text-[#4B5563] hover:bg-[#E2E8F0]/50 hover:text-[#020617]"
                    }`}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-6 lg:px-12 py-8 lg:py-10">
          <div className="max-w-[720px] space-y-16">
            <SectionGettingStarted />
            <SectionIframeEmbed />
            <SectionJsSdk />
            <SectionConfiguration />
            <SectionCallbacks />
            <SectionWebhooks />
            <SectionTheming />
            <SectionPrefill />
            <SectionSecurity />
            <SectionDataStructure />
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-[#E2E8F0] max-w-[720px]">
            <p className="text-xs text-[#7F7F7F]">
              A2P 10DLC Registration Wizard — Built for seamless integration.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
