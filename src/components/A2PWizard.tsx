"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BrandData {
  entityType: string;
  displayName: string;
  legalName: string;
  ein: string;
  vertical: string;
  volume: string;
  website: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CampaignData {
  useCase: string;
  description: string;
  sampleMessage1: string;
  sampleMessage2: string;
  messageFlow: string;
  optInMessage: string;
  optInKeywords: string;
  optOutMessage: string;
  optOutKeywords: string;
  helpMessage: string;
  helpKeywords: string;
  flagOptIn: boolean;
  flagOptOut: boolean;
  flagHelp: boolean;
  flagEmbeddedLinks: boolean;
  flagPhoneNumbers: boolean;
  flagNumberPool: boolean;
  flagAgeGated: boolean;
  flagDirectLending: boolean;
  flagAutoRenewal: boolean;
  agreedToTerms: boolean;
}

export interface WizardTheme {
  primaryColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  fontFamily?: string;
  borderRadius?: string;
}

export interface WizardBranding {
  logoUrl?: string;
  companyName?: string;
}

export interface WizardPrefill {
  businessType?: string;
  displayName?: string;
  legalName?: string;
  ein?: string;
  vertical?: string;
  volume?: string;
  website?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  useCase?: string;
  description?: string;
  sampleMessage1?: string;
  sampleMessage2?: string;
  messageFlow?: string;
}

export interface WizardConfig {
  accountId?: string;
  telnyxApiKey?: string;
  googlePlacesKey?: string;
  webhookUrl?: string;
  theme?: WizardTheme;
  branding?: WizardBranding;
  prefill?: WizardPrefill;
  embedded?: boolean;
  allowedOrigins?: string[];
  onStepChange?: (step: number, data: Record<string, unknown>) => void;
  onComplete?: (data: Record<string, unknown>) => void;
  onError?: (error: { code: string; message: string }) => void;
  onReady?: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STEPS = [
  "Business Type",
  "Business Info",
  "Brand Review",
  "Campaign Setup",
  "Compliance",
  "Campaign Review",
  "Confirmation",
];

const ENTITY_TYPES = [
  { value: "PRIVATE_PROFIT", label: "Private Company", desc: "Privately held, for-profit entity" },
  { value: "PUBLIC_PROFIT", label: "Public Company", desc: "Publicly traded, for-profit entity" },
  { value: "NON_PROFIT", label: "Non-Profit", desc: "501(c)(3) or equivalent organization" },
  { value: "GOVERNMENT", label: "Government", desc: "Federal, state, or local government entity" },
  { value: "SOLE_PROPRIETOR", label: "Sole Proprietor", desc: "Individual owner, lower throughput limits" },
];

const VERTICALS = [
  "Agriculture", "Communication", "Construction", "Education", "Energy",
  "Entertainment", "Financial", "Gambling", "Government", "Healthcare",
  "Hospitality", "Insurance", "Legal", "Manufacturing", "NGO",
  "Political", "Postal", "Professional", "Real Estate", "Retail",
  "Technology", "Transportation",
];

const VOLUMES = [
  "1 - 1,000", "1,001 - 10,000", "10,001 - 100,000",
  "100,001 - 250,000", "250,001 - 500,000", "500,001 - 1,000,000",
  "1,000,001 - 5,000,000", "5,000,001+",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const USE_CASES = [
  "2FA / Authentication", "Account Notifications", "Customer Care",
  "Delivery Notifications", "Fraud Alert Messaging", "Higher Education",
  "Low Volume Mixed", "Marketing", "Mixed", "Polling and Voting",
  "Public Service Announcement", "Security Alert",
];

// ─── Shared UI Components ────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-medium text-[#4B5563] mb-1.5 uppercase tracking-wide">
      {children}
      {required && <span className="text-[#F26262] ml-0.5">*</span>}
    </label>
  );
}

function Input({
  value, onChange, placeholder, type = "text", error,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; error?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full h-9 px-3 text-xs rounded-[5px] border bg-white outline-none transition-colors
        ${error ? "border-[#F26262] focus:border-[#F26262]" : "border-[#E2E8F0] focus:border-[#020617]"}
        placeholder:text-[#7F7F7F]`}
    />
  );
}

function Select({
  value, onChange, options, placeholder, error,
}: {
  value: string; onChange: (v: string) => void; options: string[] | { value: string; label: string }[]; placeholder?: string; error?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-9 px-3 text-xs rounded-[5px] border bg-white outline-none transition-colors appearance-none cursor-pointer
        ${!value ? "text-[#7F7F7F]" : "text-[#020617]"}
        ${error ? "border-[#F26262]" : "border-[#E2E8F0] focus:border-[#020617]"}`}
    >
      <option value="">{placeholder || "Select..."}</option>
      {options.map((opt) => {
        const v = typeof opt === "string" ? opt : opt.value;
        const l = typeof opt === "string" ? opt : opt.label;
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
}

function Textarea({
  value, onChange, placeholder, rows = 3, maxLength, error,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; maxLength?: number; error?: boolean;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-3 py-2 text-xs rounded-[5px] border bg-white outline-none transition-colors resize-none
          ${error ? "border-[#F26262]" : "border-[#E2E8F0] focus:border-[#020617]"}
          placeholder:text-[#7F7F7F]`}
      />
      {maxLength && (
        <span className="absolute bottom-2 right-3 text-[10px] text-[#7F7F7F]">
          {value.length} / {maxLength}
        </span>
      )}
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded-[3px] border flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer
          ${checked ? "bg-[#020617] border-[#020617]" : "bg-white border-[#E2E8F0] group-hover:border-[#020617]"}`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-xs text-[#4B5563]">{label}</span>
    </label>
  );
}

function InfoCallout({ children, variant = "info" }: { children: React.ReactNode; variant?: "info" | "warning" | "error" }) {
  const styles = {
    info: "bg-[#F0F4FF] border-[#D0DBFF] text-[#3B5BDB]",
    warning: "bg-[#FFF8F0] border-[#FFE0B2] text-[#E65100]",
    error: "bg-[#FEF2F2] border-[rgba(242,98,98,0.18)] text-[#F26262]",
  };
  const icons = {
    info: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-px">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 6.5V10M7 4.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    warning: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-px">
        <path d="M7 1L13 12H1L7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M7 5.5V8.5M7 10V10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    error: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-px">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 5L9 9M9 5L5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  };
  return (
    <div className={`flex gap-2 px-3 py-2.5 rounded-[5px] border text-[11px] leading-relaxed ${styles[variant]}`}>
      {icons[variant]}
      <div>{children}</div>
    </div>
  );
}

function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-[5px] border border-[#E2E8F0] ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-[#E2E8F0]">
          <h3 className="text-[13px] font-semibold text-[#020617]">{title}</h3>
        </div>
      )}
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value, missing }: { label: string; value?: string; missing?: boolean }) {
  return (
    <div className="flex items-start py-2 border-b border-[#E2E8F0] last:border-0">
      <span className="w-40 flex-shrink-0 text-[11px] text-[#7F7F7F] uppercase tracking-wide">{label}</span>
      <span className={`text-xs ${missing ? "text-[#F26262] italic" : "text-[#020617]"}`}>
        {missing ? "Missing" : value || "—"}
      </span>
    </div>
  );
}

function CheckItem({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${passed ? "bg-[#ECFDF3] text-[#12B76A]" : "bg-[#FEF2F2] text-[#F26262]"}`}>
        {passed ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6L5 8L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 4L8 8M8 4L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        )}
      </div>
      <span className={`text-xs ${passed ? "text-[#020617]" : "text-[#F26262]"}`}>{label}</span>
    </div>
  );
}

function Badge({ text, variant }: { text: string; variant: "success" | "warning" | "error" | "neutral" }) {
  const s = {
    success: "bg-[#ECFDF3] text-[#12B76A] border-[#D1FAE5]",
    warning: "bg-[#FFF8F0] text-[#E65100] border-[#FFE0B2]",
    error: "bg-[#FEF2F2] text-[#F26262] border-[rgba(242,98,98,0.18)]",
    neutral: "bg-[#F1F3F5] text-[#4B5563] border-[#E2E8F0]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] border text-[10px] font-medium uppercase tracking-wide ${s[variant]}`}>
      {text}
    </span>
  );
}

// ─── Progress Bar ────────────────────────────────────────────────────────────

function ProgressBar({ currentStep, onStepClick, branding }: { currentStep: number; onStepClick: (s: number) => void; branding?: WizardBranding }) {
  return (
    <div className="bg-white border-b border-[#E2E8F0]">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {branding?.logoUrl && (
              <img src={branding.logoUrl} alt={branding.companyName || ""} className="h-6 w-auto" />
            )}
            <h1 className="text-sm font-semibold text-[#020617]">
              {branding?.companyName ? `${branding.companyName} — ` : ""}A2P 10DLC Registration
            </h1>
          </div>
          <span className="text-[11px] text-[#7F7F7F]">Step {currentStep + 1} of {STEPS.length}</span>
        </div>
        <div className="h-1 bg-[#E2E8F0] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[#020617] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-1">
          {STEPS.map((step, i) => (
            <button
              key={step}
              onClick={() => onStepClick(i)}
              disabled={i > currentStep}
              className={`flex-1 text-center py-1.5 rounded-[4px] text-[10px] font-medium uppercase tracking-wide transition-colors
                ${i === currentStep ? "border border-[#020617] text-[#020617] bg-white" : i < currentStep ? "border border-[#E2E8F0] bg-[#F7F9FC] text-[#4B5563] hover:bg-[#E2E8F0] cursor-pointer" : "text-[#7F7F7F] cursor-not-allowed"}`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step Components ─────────────────────────────────────────────────────────

function StepBusinessType({ brand, setBrand }: { brand: BrandData; setBrand: (b: BrandData) => void }) {
  return (
    <div className="step-animate space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[#020617] mb-1">Select Business Type</h2>
        <p className="text-xs text-[#7F7F7F]">Choose the entity type that best describes your organization.</p>
      </div>
      <InfoCallout variant="info">
        <strong>Throughput limits:</strong> Sole Proprietors are limited to 1 SMS/sec with a daily cap.
        Other entity types can achieve higher throughput after vetting.
      </InfoCallout>
      <div className="grid gap-2">
        {ENTITY_TYPES.map((et) => (
          <button
            key={et.value}
            onClick={() => setBrand({ ...brand, entityType: et.value })}
            className={`flex items-center gap-3 p-3.5 rounded-[5px] border text-left transition-all
              ${brand.entityType === et.value
                ? "border-[#020617] bg-[#FAFBFC] ring-1 ring-[#020617]"
                : "border-[#E2E8F0] bg-white hover:border-[#020617]/30"}`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
              ${brand.entityType === et.value ? "border-[#020617]" : "border-[#E2E8F0]"}`}>
              {brand.entityType === et.value && <div className="w-2 h-2 rounded-full bg-[#020617]" />}
            </div>
            <div>
              <div className="text-xs font-medium text-[#020617]">{et.label}</div>
              <div className="text-[11px] text-[#7F7F7F]">{et.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepBusinessInfo({ brand, setBrand }: { brand: BrandData; setBrand: (b: BrandData) => void }) {
  const u = (field: keyof BrandData) => (v: string) => setBrand({ ...brand, [field]: v });
  return (
    <div className="step-animate space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#020617] mb-1">Business Information</h2>
        <p className="text-xs text-[#7F7F7F]">Provide accurate details about your business for brand registration.</p>
      </div>
      <InfoCallout variant="warning">
        Your EIN and Legal Company Name must match your IRS records exactly. Mismatches will cause registration failure.
      </InfoCallout>
      <Card title="Company Details">
        <div className="grid grid-cols-2 gap-4">
          <div><Label required>Display Name</Label><Input value={brand.displayName} onChange={u("displayName")} placeholder="Acme Inc" /></div>
          <div><Label required>Legal Company Name</Label><Input value={brand.legalName} onChange={u("legalName")} placeholder="Acme Incorporated" /></div>
          <div><Label required>EIN</Label><Input value={brand.ein} onChange={u("ein")} placeholder="XX-XXXXXXX" /></div>
          <div><Label required>Industry Vertical</Label><Select value={brand.vertical} onChange={u("vertical")} options={VERTICALS} placeholder="Select industry..." /></div>
          <div><Label required>Monthly Message Volume</Label><Select value={brand.volume} onChange={u("volume")} options={VOLUMES} placeholder="Select volume..." /></div>
          <div><Label>Website</Label><Input value={brand.website} onChange={u("website")} placeholder="https://example.com" /></div>
        </div>
      </Card>
      <Card title="Contact Information">
        <div className="grid grid-cols-2 gap-4">
          <div><Label required>First Name</Label><Input value={brand.firstName} onChange={u("firstName")} placeholder="John" /></div>
          <div><Label required>Last Name</Label><Input value={brand.lastName} onChange={u("lastName")} placeholder="Doe" /></div>
          <div><Label required>Email</Label><Input value={brand.email} onChange={u("email")} placeholder="john@example.com" type="email" /></div>
          <div><Label required>Phone</Label><Input value={brand.phone} onChange={u("phone")} placeholder="+1 (555) 000-0000" /></div>
        </div>
      </Card>
      <Card title="Business Address">
        <div className="space-y-4">
          <div>
            <Label required>Street Address</Label>
            <Input value={brand.street} onChange={u("street")} placeholder="Start typing for suggestions..." />
            <p className="mt-1 text-[10px] text-[#7F7F7F]">Google Places autocomplete would populate remaining fields</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label required>City</Label><Input value={brand.city} onChange={u("city")} placeholder="San Francisco" /></div>
            <div><Label required>State</Label><Select value={brand.state} onChange={u("state")} options={US_STATES} placeholder="State..." /></div>
            <div><Label required>Postal Code</Label><Input value={brand.postalCode} onChange={u("postalCode")} placeholder="94102" /></div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StepBrandReview({ brand }: { brand: BrandData }) {
  const entityLabel = ENTITY_TYPES.find((e) => e.value === brand.entityType)?.label || "";
  const missingFields: string[] = [];
  if (!brand.entityType) missingFields.push("Business Type");
  if (!brand.displayName) missingFields.push("Display Name");
  if (!brand.legalName) missingFields.push("Legal Name");
  if (!brand.ein) missingFields.push("EIN");
  if (!brand.vertical) missingFields.push("Industry");
  if (!brand.volume) missingFields.push("Volume");
  if (!brand.firstName) missingFields.push("First Name");
  if (!brand.lastName) missingFields.push("Last Name");
  if (!brand.email) missingFields.push("Email");
  if (!brand.phone) missingFields.push("Phone");
  if (!brand.street) missingFields.push("Street");
  if (!brand.city) missingFields.push("City");
  if (!brand.state) missingFields.push("State");
  if (!brand.postalCode) missingFields.push("Postal Code");

  return (
    <div className="step-animate space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#020617] mb-1">Brand Review</h2>
          <p className="text-xs text-[#7F7F7F]">Review your brand information before proceeding to campaign setup.</p>
        </div>
        <Badge text={missingFields.length === 0 ? "Complete" : `${missingFields.length} missing`} variant={missingFields.length === 0 ? "success" : "error"} />
      </div>
      {missingFields.length > 0 && (
        <InfoCallout variant="error">Missing required fields: {missingFields.join(", ")}. Go back to complete them.</InfoCallout>
      )}
      {!brand.website && (
        <InfoCallout variant="warning">No website URL provided. This may reduce your brand trust score and limit auto-generation features.</InfoCallout>
      )}
      <Card title="Company Details">
        <ReviewRow label="Entity Type" value={entityLabel} missing={!brand.entityType} />
        <ReviewRow label="Display Name" value={brand.displayName} missing={!brand.displayName} />
        <ReviewRow label="Legal Name" value={brand.legalName} missing={!brand.legalName} />
        <ReviewRow label="EIN" value={brand.ein} missing={!brand.ein} />
        <ReviewRow label="Industry" value={brand.vertical} missing={!brand.vertical} />
        <ReviewRow label="Volume" value={brand.volume} missing={!brand.volume} />
        <ReviewRow label="Website" value={brand.website} />
      </Card>
      <Card title="Contact">
        <ReviewRow label="Name" value={brand.firstName || brand.lastName ? `${brand.firstName} ${brand.lastName}`.trim() : ""} missing={!brand.firstName || !brand.lastName} />
        <ReviewRow label="Email" value={brand.email} missing={!brand.email} />
        <ReviewRow label="Phone" value={brand.phone} missing={!brand.phone} />
      </Card>
      <Card title="Address">
        <ReviewRow label="Street" value={brand.street} missing={!brand.street} />
        <ReviewRow label="City" value={brand.city} missing={!brand.city} />
        <ReviewRow label="State" value={brand.state} missing={!brand.state} />
        <ReviewRow label="Postal Code" value={brand.postalCode} missing={!brand.postalCode} />
      </Card>
    </div>
  );
}

function StepCampaignSetup({
  campaign, setCampaign, hasWebsite,
}: {
  campaign: CampaignData; setCampaign: (c: CampaignData) => void; hasWebsite: boolean;
}) {
  const u = (field: keyof CampaignData) => (v: string) => setCampaign({ ...campaign, [field]: v });
  const [generating, setGenerating] = useState(false);

  const handleAutoGenerate = () => {
    if (!hasWebsite) return;
    setGenerating(true);
    setTimeout(() => {
      setCampaign({
        ...campaign,
        description: "This campaign sends transactional and promotional SMS messages to customers who have opted in through our website. Messages include order confirmations, shipping updates, appointment reminders, and occasional promotional offers.",
        sampleMessage1: "Hi {firstName}, your order #{orderNumber} has shipped! Track it here: {trackingUrl}. Reply STOP to opt out.",
        sampleMessage2: "Reminder: Your appointment is tomorrow at {time}. Reply CONFIRM to confirm or HELP for assistance. Reply STOP to unsubscribe.",
        messageFlow: "Customers opt in by providing their phone number on our website checkout page or account settings. They check a box confirming consent to receive SMS messages. A confirmation message is sent upon opt-in.",
      });
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="step-animate space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#020617] mb-1">Campaign Setup</h2>
        <p className="text-xs text-[#7F7F7F]">Configure your messaging campaign details and sample content.</p>
      </div>
      <Card>
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label required>Use Case</Label>
              <Select value={campaign.useCase} onChange={u("useCase")} options={USE_CASES} placeholder="Select use case..." />
            </div>
            <button
              onClick={handleAutoGenerate}
              disabled={!hasWebsite || generating}
              className={`h-9 px-4 rounded-[5px] border text-xs font-medium transition-colors flex items-center gap-2
                ${hasWebsite ? "border-[#E2E8F0] text-[#020617] hover:bg-[#F1F3F5]" : "border-[#E2E8F0] text-[#7F7F7F] cursor-not-allowed"}`}
            >
              {generating ? (
                <><div className="skeleton w-3 h-3 rounded-full" />Generating...</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>Auto-Generate</>
              )}
            </button>
          </div>
          {!hasWebsite && <p className="text-[10px] text-[#7F7F7F]">Add a website URL in Business Info to enable auto-generation.</p>}
        </div>
      </Card>
      <Card title="Campaign Content">
        <div className="space-y-4">
          <div>
            <Label required>Campaign Description</Label>
            <Textarea value={campaign.description} onChange={u("description")} placeholder="Describe the purpose of your messaging campaign (40-4096 characters)..." rows={4} maxLength={4096} />
            {campaign.description.length > 0 && campaign.description.length < 40 && (
              <p className="mt-1 text-[10px] text-[#F26262]">Minimum 40 characters required ({40 - campaign.description.length} more needed)</p>
            )}
          </div>
          <InfoCallout>
            Use placeholders like <code className="bg-white/60 px-1 py-0.5 rounded text-[10px]">{"{firstName}"}</code>,{" "}
            <code className="bg-white/60 px-1 py-0.5 rounded text-[10px]">{"{orderNumber}"}</code>, etc. in your sample messages.
          </InfoCallout>
          <div><Label required>Sample Message 1</Label><Textarea value={campaign.sampleMessage1} onChange={u("sampleMessage1")} placeholder="Hi {firstName}, your order #{orderNumber} has shipped! Track: {url}. Reply STOP to opt out." rows={2} /></div>
          <div><Label required>Sample Message 2</Label><Textarea value={campaign.sampleMessage2} onChange={u("sampleMessage2")} placeholder="Reminder: Your appointment with {businessName} is on {date} at {time}. Reply HELP for help." rows={2} /></div>
          <div><Label required>Message Flow</Label><Textarea value={campaign.messageFlow} onChange={u("messageFlow")} placeholder="Describe how users opt in to receive messages and the expected message flow..." rows={3} /></div>
        </div>
      </Card>
    </div>
  );
}

function StepCompliance({
  campaign, setCampaign,
}: {
  campaign: CampaignData; setCampaign: (c: CampaignData) => void;
}) {
  const u = (field: keyof CampaignData) => (v: string) => setCampaign({ ...campaign, [field]: v });
  const ub = (field: keyof CampaignData) => (v: boolean) => setCampaign({ ...campaign, [field]: v });
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setCampaign({
        ...campaign,
        optInMessage: "You have opted in to receive SMS messages from us. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.",
        optInKeywords: "START, YES, SUBSCRIBE",
        optOutMessage: "You have been unsubscribed and will no longer receive messages from us. Reply START to re-subscribe.",
        optOutKeywords: "STOP, UNSUBSCRIBE, CANCEL, END, QUIT",
        helpMessage: "For help, contact support@example.com or call (555) 000-0000. Msg & data rates may apply. Reply STOP to cancel.",
        helpKeywords: "HELP, INFO",
        flagOptIn: true,
        flagOptOut: true,
        flagHelp: true,
      });
      setGenerating(false);
    }, 1000);
  };

  return (
    <div className="step-animate space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#020617] mb-1">Compliance Settings</h2>
          <p className="text-xs text-[#7F7F7F]">Configure opt-in, opt-out, and help responses to meet carrier requirements.</p>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="h-8 px-3 rounded-[5px] border border-[#E2E8F0] text-[11px] font-medium text-[#020617] hover:bg-[#F1F3F5] transition-colors flex items-center gap-2">
          {generating ? (<><div className="skeleton w-3 h-3 rounded-full" /> Generating...</>) : (<><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 8.5L10 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>Generate Compliant Messages</>)}
        </button>
      </div>
      <Card title="Opt-In">
        <div className="space-y-3">
          <div><Label required>Opt-In Message</Label><Textarea value={campaign.optInMessage} onChange={u("optInMessage")} placeholder="Message sent when a user opts in..." rows={2} /></div>
          <div><Label required>Opt-In Keywords</Label><Input value={campaign.optInKeywords} onChange={u("optInKeywords")} placeholder="START, YES, SUBSCRIBE" /></div>
        </div>
      </Card>
      <Card title="Opt-Out">
        <div className="space-y-3">
          <div><Label required>Opt-Out Message</Label><Textarea value={campaign.optOutMessage} onChange={u("optOutMessage")} placeholder="Message sent when a user opts out..." rows={2} /></div>
          <div><Label required>Opt-Out Keywords</Label><Input value={campaign.optOutKeywords} onChange={u("optOutKeywords")} placeholder="STOP, UNSUBSCRIBE, CANCEL, END, QUIT" /></div>
        </div>
      </Card>
      <Card title="Help">
        <div className="space-y-3">
          <div><Label required>Help Message</Label><Textarea value={campaign.helpMessage} onChange={u("helpMessage")} placeholder="Message sent when a user texts HELP..." rows={2} /></div>
          <div><Label required>Help Keywords</Label><Input value={campaign.helpKeywords} onChange={u("helpKeywords")} placeholder="HELP, INFO" /></div>
        </div>
      </Card>
      <Card title="Campaign Flags">
        <div className="grid grid-cols-2 gap-3">
          <Checkbox checked={campaign.flagOptIn} onChange={ub("flagOptIn")} label="Opt-In supported" />
          <Checkbox checked={campaign.flagOptOut} onChange={ub("flagOptOut")} label="Opt-Out supported" />
          <Checkbox checked={campaign.flagHelp} onChange={ub("flagHelp")} label="Help supported" />
          <Checkbox checked={campaign.flagEmbeddedLinks} onChange={ub("flagEmbeddedLinks")} label="Embedded links" />
          <Checkbox checked={campaign.flagPhoneNumbers} onChange={ub("flagPhoneNumbers")} label="Phone numbers in content" />
          <Checkbox checked={campaign.flagNumberPool} onChange={ub("flagNumberPool")} label="Number pool" />
          <Checkbox checked={campaign.flagAgeGated} onChange={ub("flagAgeGated")} label="Age-gated content" />
          <Checkbox checked={campaign.flagDirectLending} onChange={ub("flagDirectLending")} label="Direct lending" />
          <Checkbox checked={campaign.flagAutoRenewal} onChange={ub("flagAutoRenewal")} label="Auto-renewal" />
        </div>
      </Card>
    </div>
  );
}

function StepCampaignReview({
  brand, campaign, setCampaign,
}: {
  brand: BrandData; campaign: CampaignData; setCampaign: (c: CampaignData) => void;
}) {
  const checks = [
    { label: "Use case selected", passed: !!campaign.useCase },
    { label: "Description meets minimum length (40 chars)", passed: campaign.description.length >= 40 },
    { label: "Sample message 1 provided", passed: !!campaign.sampleMessage1 },
    { label: "Sample message 2 provided", passed: !!campaign.sampleMessage2 },
    { label: "Message flow described", passed: !!campaign.messageFlow },
    { label: "Opt-in message configured", passed: !!campaign.optInMessage },
    { label: "Opt-in keywords set", passed: !!campaign.optInKeywords },
    { label: "Opt-out message configured", passed: !!campaign.optOutMessage },
    { label: "Opt-out keywords set", passed: !!campaign.optOutKeywords },
    { label: "Help message configured", passed: !!campaign.helpMessage },
    { label: "Help keywords set", passed: !!campaign.helpKeywords },
    { label: "Opt-In flag enabled", passed: campaign.flagOptIn },
    { label: "Opt-Out flag enabled", passed: campaign.flagOptOut },
    { label: "Help flag enabled", passed: campaign.flagHelp },
  ];
  const allPassed = checks.every((c) => c.passed);
  const passedCount = checks.filter((c) => c.passed).length;
  const activeFlags = [
    campaign.flagOptIn && "Opt-In", campaign.flagOptOut && "Opt-Out", campaign.flagHelp && "Help",
    campaign.flagEmbeddedLinks && "Embedded Links", campaign.flagPhoneNumbers && "Phone Numbers",
    campaign.flagNumberPool && "Number Pool", campaign.flagAgeGated && "Age-Gated",
    campaign.flagDirectLending && "Direct Lending", campaign.flagAutoRenewal && "Auto-Renewal",
  ].filter(Boolean);

  return (
    <div className="step-animate space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#020617] mb-1">Campaign Review</h2>
          <p className="text-xs text-[#7F7F7F]">Review all details before submitting your campaign for registration.</p>
        </div>
        <Badge text={allPassed ? "Ready" : `${passedCount}/${checks.length}`} variant={allPassed ? "success" : "warning"} />
      </div>
      <Card title="Pre-Submission Checklist">
        <div className="grid grid-cols-2 gap-x-4">
          {checks.map((c) => <CheckItem key={c.label} passed={c.passed} label={c.label} />)}
        </div>
      </Card>
      <Card title="Campaign Details">
        <ReviewRow label="Use Case" value={campaign.useCase} missing={!campaign.useCase} />
        <ReviewRow label="Description" value={campaign.description ? `${campaign.description.slice(0, 100)}...` : ""} missing={!campaign.description} />
        <ReviewRow label="Sample Msg 1" value={campaign.sampleMessage1 ? `${campaign.sampleMessage1.slice(0, 80)}...` : ""} missing={!campaign.sampleMessage1} />
        <ReviewRow label="Sample Msg 2" value={campaign.sampleMessage2 ? `${campaign.sampleMessage2.slice(0, 80)}...` : ""} missing={!campaign.sampleMessage2} />
        <ReviewRow label="Message Flow" value={campaign.messageFlow ? `${campaign.messageFlow.slice(0, 80)}...` : ""} missing={!campaign.messageFlow} />
      </Card>
      <Card title="Compliance">
        <ReviewRow label="Opt-In Msg" value={campaign.optInMessage ? "Configured" : ""} missing={!campaign.optInMessage} />
        <ReviewRow label="Opt-In Keys" value={campaign.optInKeywords} missing={!campaign.optInKeywords} />
        <ReviewRow label="Opt-Out Msg" value={campaign.optOutMessage ? "Configured" : ""} missing={!campaign.optOutMessage} />
        <ReviewRow label="Opt-Out Keys" value={campaign.optOutKeywords} missing={!campaign.optOutKeywords} />
        <ReviewRow label="Help Msg" value={campaign.helpMessage ? "Configured" : ""} missing={!campaign.helpMessage} />
        <ReviewRow label="Help Keys" value={campaign.helpKeywords} missing={!campaign.helpKeywords} />
      </Card>
      <Card title="Flags">
        <div className="flex flex-wrap gap-2">
          {activeFlags.length > 0 ? activeFlags.map((f) => <Badge key={f as string} text={f as string} variant="neutral" />) : <span className="text-xs text-[#7F7F7F]">No flags enabled</span>}
        </div>
      </Card>
      <Card>
        <div className="space-y-3">
          <div className="text-xs text-[#4B5563] leading-relaxed">
            <strong>Terms & Conditions:</strong> By submitting this registration, you confirm that all information
            provided is accurate and that your messaging practices comply with CTIA guidelines, carrier policies,
            and applicable laws including the TCPA. You understand that providing false information may result in
            brand suspension and messaging restrictions.
          </div>
          <Checkbox checked={campaign.agreedToTerms} onChange={(v) => setCampaign({ ...campaign, agreedToTerms: v })} label="I agree to the Terms & Conditions" />
        </div>
      </Card>
    </div>
  );
}

function StepConfirmation({ brand, accountId }: { brand: BrandData; accountId?: string }) {
  return (
    <div className="step-animate flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#ECFDF3] flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 16L14 22L24 10" stroke="#12B76A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[#020617] mb-2">Registration Submitted</h2>
      <p className="text-sm text-[#4B5563] max-w-md mb-6">
        Your A2P 10DLC brand and campaign registration for <strong>{brand.displayName || "your business"}</strong> has
        been submitted successfully. You&apos;ll receive status updates via email.
      </p>
      <div className="flex gap-2">
        <Badge text="Brand: Pending" variant="warning" />
        <Badge text="Campaign: Pending" variant="warning" />
      </div>
      {accountId && (
        <div className="mt-4 text-[10px] text-[#7F7F7F]">Account: {accountId}</div>
      )}
      <div className="mt-8 text-[11px] text-[#7F7F7F]">
        Registration typically takes 1-7 business days for review.
      </div>
    </div>
  );
}

// ─── Sanitize helper ─────────────────────────────────────────────────────────

function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/[<>]/g, "").trim().slice(0, 4096);
}

// ─── Build complete data payload ─────────────────────────────────────────────

function buildCompletePayload(accountId: string | undefined, brand: BrandData, campaign: CampaignData) {
  return {
    accountId: accountId || "",
    brand: {
      entityType: brand.entityType,
      displayName: brand.displayName,
      legalName: brand.legalName,
      ein: brand.ein,
      vertical: brand.vertical,
      volume: brand.volume,
      website: brand.website,
      contact: {
        firstName: brand.firstName,
        lastName: brand.lastName,
        email: brand.email,
        phone: brand.phone,
      },
      address: {
        street: brand.street,
        city: brand.city,
        state: brand.state,
        postalCode: brand.postalCode,
      },
    },
    campaign: {
      useCase: campaign.useCase,
      description: campaign.description,
      sampleMessages: [campaign.sampleMessage1, campaign.sampleMessage2],
      messageFlow: campaign.messageFlow,
    },
    compliance: {
      optIn: { message: campaign.optInMessage, keywords: campaign.optInKeywords },
      optOut: { message: campaign.optOutMessage, keywords: campaign.optOutKeywords },
      help: { message: campaign.helpMessage, keywords: campaign.helpKeywords },
      flags: {
        optIn: campaign.flagOptIn,
        optOut: campaign.flagOptOut,
        help: campaign.flagHelp,
        embeddedLinks: campaign.flagEmbeddedLinks,
        phoneNumbers: campaign.flagPhoneNumbers,
        numberPool: campaign.flagNumberPool,
        ageGated: campaign.flagAgeGated,
        directLending: campaign.flagDirectLending,
        autoRenewal: campaign.flagAutoRenewal,
      },
    },
    termsAccepted: campaign.agreedToTerms,
    submittedAt: new Date().toISOString(),
  };
}

// ─── Main Wizard Component ───────────────────────────────────────────────────

export default function A2PWizardComponent({ config = {} }: { config?: WizardConfig }) {
  const { accountId, embedded, branding, webhookUrl, allowedOrigins } = config;

  // Apply prefill
  const initialBrand: BrandData = {
    entityType: config.prefill?.businessType || "",
    displayName: config.prefill?.displayName || "",
    legalName: config.prefill?.legalName || "",
    ein: config.prefill?.ein || "",
    vertical: config.prefill?.vertical || "",
    volume: config.prefill?.volume || "",
    website: config.prefill?.website || "",
    firstName: config.prefill?.firstName || "",
    lastName: config.prefill?.lastName || "",
    email: config.prefill?.email || "",
    phone: config.prefill?.phone || "",
    street: config.prefill?.street || "",
    city: config.prefill?.city || "",
    state: config.prefill?.state || "",
    postalCode: config.prefill?.postalCode || "",
  };

  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState<BrandData>(initialBrand);
  const [campaign, setCampaign] = useState<CampaignData>({
    useCase: config.prefill?.useCase || "",
    description: config.prefill?.description || "",
    sampleMessage1: config.prefill?.sampleMessage1 || "",
    sampleMessage2: config.prefill?.sampleMessage2 || "",
    messageFlow: config.prefill?.messageFlow || "",
    optInMessage: "", optInKeywords: "", optOutMessage: "", optOutKeywords: "",
    helpMessage: "", helpKeywords: "",
    flagOptIn: false, flagOptOut: false, flagHelp: false,
    flagEmbeddedLinks: false, flagPhoneNumbers: false, flagNumberPool: false,
    flagAgeGated: false, flagDirectLending: false, flagAutoRenewal: false,
    agreedToTerms: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const readyFired = useRef(false);

  // postMessage helper for embedded mode
  const postToParent = useCallback((type: string, data: Record<string, unknown>) => {
    if (!embedded || typeof window === "undefined" || !window.parent || window.parent === window) return;
    window.parent.postMessage({ source: "a2p-wizard", type, ...data }, "*");
  }, [embedded]);

  // Auto-resize for embed
  useEffect(() => {
    if (!embedded || typeof window === "undefined") return;
    const observer = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight;
      postToParent("resize", { height });
    });
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [embedded, postToParent]);

  // Fire ready
  useEffect(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    config.onReady?.();
    postToParent("ready", {});
  }, [config, postToParent]);

  // Listen for postMessage config (SDK sends keys securely after load)
  useEffect(() => {
    if (!embedded || typeof window === "undefined") return;
    const handler = (event: MessageEvent) => {
      if (allowedOrigins && allowedOrigins.length > 0 && !allowedOrigins.includes(event.origin)) return;
      const msg = event.data;
      if (!msg || msg.source !== "a2p-wizard-sdk") return;
      // SDK can send config updates — currently we handle keys via postMessage
      // Future: handle prefill updates, theme changes, etc.
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [embedded, allowedOrigins]);

  // Step data helper for callbacks
  const getStepData = useCallback((stepIndex: number): Record<string, unknown> => {
    switch (stepIndex) {
      case 0: return { entityType: brand.entityType };
      case 1: return { ...brand };
      case 2: return { ...brand };
      case 3: return { useCase: campaign.useCase, description: campaign.description, sampleMessage1: campaign.sampleMessage1, sampleMessage2: campaign.sampleMessage2, messageFlow: campaign.messageFlow };
      case 4: return { optInMessage: campaign.optInMessage, optInKeywords: campaign.optInKeywords, optOutMessage: campaign.optOutMessage, optOutKeywords: campaign.optOutKeywords, helpMessage: campaign.helpMessage, helpKeywords: campaign.helpKeywords, flagOptIn: campaign.flagOptIn, flagOptOut: campaign.flagOptOut, flagHelp: campaign.flagHelp };
      case 5: return { agreedToTerms: campaign.agreedToTerms };
      default: return {};
    }
  }, [brand, campaign]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return !!brand.entityType;
      case 1: return !!(brand.displayName && brand.legalName && brand.ein && brand.vertical && brand.volume && brand.firstName && brand.lastName && brand.email && brand.phone && brand.street && brand.city && brand.state && brand.postalCode);
      case 2: return true;
      case 3: return !!(campaign.useCase && campaign.description.length >= 40 && campaign.sampleMessage1 && campaign.sampleMessage2 && campaign.messageFlow);
      case 4: return !!(campaign.optInMessage && campaign.optInKeywords && campaign.optOutMessage && campaign.optOutKeywords && campaign.helpMessage && campaign.helpKeywords);
      case 5: return campaign.agreedToTerms;
      default: return false;
    }
  }, [step, brand, campaign]);

  const handleNext = useCallback(() => {
    if (step === 5) {
      // Submit
      const payload = buildCompletePayload(accountId, brand, campaign);
      config.onComplete?.(payload);
      postToParent("complete", { data: payload });

      // Webhook
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => {
          const error = { code: "WEBHOOK_ERROR", message: err.message || "Webhook delivery failed" };
          config.onError?.(error);
          postToParent("error", { error });
        });
      }

      setStep(6);
      const stepData = getStepData(6);
      config.onStepChange?.(6, stepData);
      postToParent("stepChange", { step: 6, data: stepData });
    } else if (step < STEPS.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      const stepData = getStepData(nextStep);
      config.onStepChange?.(nextStep, stepData);
      postToParent("stepChange", { step: nextStep, data: stepData });
    }
  }, [step, accountId, brand, campaign, config, postToParent, webhookUrl, getStepData]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      const stepData = getStepData(prevStep);
      config.onStepChange?.(prevStep, stepData);
      postToParent("stepChange", { step: prevStep, data: stepData });
    }
  }, [step, config, postToParent, getStepData]);

  const isConfirmation = step === 6;

  // Apply custom theme via CSS variables
  const themeStyle: React.CSSProperties = {};
  if (config.theme?.backgroundColor) themeStyle.backgroundColor = config.theme.backgroundColor;
  if (config.theme?.fontFamily) themeStyle.fontFamily = config.theme.fontFamily;

  return (
    <div
      ref={containerRef}
      className={embedded ? "flex flex-col h-screen" : "min-h-screen flex flex-col"}
      style={themeStyle}
    >
      <ProgressBar
        currentStep={step}
        onStepClick={(s) => { if (s <= step) { setStep(s); config.onStepChange?.(s, getStepData(s)); postToParent("stepChange", { step: s, data: getStepData(s) }); } }}
        branding={branding}
      />

      <div className="flex-1 overflow-y-auto max-w-3xl w-full mx-auto px-6 py-8">
        {step === 0 && <StepBusinessType brand={brand} setBrand={setBrand} />}
        {step === 1 && <StepBusinessInfo brand={brand} setBrand={setBrand} />}
        {step === 2 && <StepBrandReview brand={brand} />}
        {step === 3 && <StepCampaignSetup campaign={campaign} setCampaign={setCampaign} hasWebsite={!!brand.website} />}
        {step === 4 && <StepCompliance campaign={campaign} setCampaign={setCampaign} />}
        {step === 5 && <StepCampaignReview brand={brand} campaign={campaign} setCampaign={setCampaign} />}
        {step === 6 && <StepConfirmation brand={brand} accountId={accountId} />}
      </div>

      {!isConfirmation && (
        <div className="bg-white border-t border-[#E2E8F0] h-[60px]">
          <div className="max-w-3xl mx-auto px-6 h-full flex items-center justify-end gap-3 relative">
            {accountId && (
              <span className="text-[10px] text-[#7F7F7F] absolute left-6 bottom-1">Account: {accountId}</span>
            )}
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`h-9 px-4 rounded-[5px] border text-xs font-medium transition-colors
                ${step === 0 ? "border-[#E2E8F0] text-[#7F7F7F] cursor-not-allowed opacity-0" : "border-[#E2E8F0] text-[#020617] hover:bg-[#F1F3F5]"}`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`h-9 px-5 rounded-[5px] text-xs font-medium transition-colors
                ${canProceed ? "bg-[#020617] text-white hover:bg-[#1a1a2e]" : "bg-[#E2E8F0] text-[#7F7F7F] cursor-not-allowed"}`}
            >
              {step === 5 ? "Submit Registration" : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
