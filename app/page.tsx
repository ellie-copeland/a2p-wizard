'use client';
import { useState, useEffect, useCallback } from 'react';
import { STEPS } from './components/wizard/constants';
import { BrandData, CampaignData, defaultBrand, defaultCampaign } from './components/wizard/types';
import { Button, ErrorBanner, InfoBox } from './components/wizard/ui';
import Step1 from './components/wizard/Step1BusinessType';
import Step2 from './components/wizard/Step2BusinessInfo';
import Step3 from './components/wizard/Step3BrandReview';
import Step4 from './components/wizard/Step4CampaignSetup';
import Step5 from './components/wizard/Step5Compliance';
import Step6 from './components/wizard/Step6CampaignReview';
import Step7 from './components/wizard/Step7Confirmation';

const STORAGE_KEY = 'a2p-wizard-state';

interface SavedState {
  step: number;
  brand: BrandData;
  campaign: CampaignData;
  brandId: string;
  campaignId: string;
  brandSubmitted: boolean;
  campaignSubmitted: boolean;
}

function loadState(): SavedState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(state: SavedState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function clearState() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState<BrandData>(defaultBrand);
  const [campaign, setCampaign] = useState<CampaignData>(defaultCampaign);
  const [brandId, setBrandId] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [brandSubmitted, setBrandSubmitted] = useState(false);
  const [campaignSubmitted, setCampaignSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [complianceResult, setComplianceResult] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setStep(saved.step);
      setBrand(saved.brand);
      setCampaign(saved.campaign);
      setBrandId(saved.brandId);
      setCampaignId(saved.campaignId);
      setBrandSubmitted(saved.brandSubmitted);
      setCampaignSubmitted(saved.campaignSubmitted);
    }
    setHydrated(true);
  }, []);

  // Auto-save on every change
  useEffect(() => {
    if (!hydrated) return;
    saveState({ step, brand, campaign, brandId, campaignId, brandSubmitted, campaignSubmitted });
  }, [step, brand, campaign, brandId, campaignId, brandSubmitted, campaignSubmitted, hydrated]);

  // Validation checks for each step (used for warnings, not blocking)
  const stepComplete = (s: number): boolean => {
    switch (s) {
      case 0: return !!brand.entityType;
      case 1: return !!(brand.displayName && brand.companyName && brand.ein?.length === 9 && brand.email && brand.phone && brand.street && brand.city && brand.state && brand.postalCode && brand.vertical && brand.brandRelationship);
      case 2: return true; // Review step
      case 3: return !!(campaign.usecase && campaign.description.length >= 40 && campaign.sample1 && campaign.messageFlow && (campaign.usecase !== 'MIXED' || (campaign.subUsecases && campaign.subUsecases.length >= 2)));
      case 4: return !!(campaign.optinMessage && campaign.optoutMessage && campaign.helpMessage);
      case 5: return campaign.termsAndConditions;
      default: return false;
    }
  };

  // Can always navigate forward/back — submission is what's gated
  const canSubmitBrand = stepComplete(0) && stepComplete(1);
  const canSubmitCampaign = brandSubmitted && stepComplete(3) && stepComplete(4) && stepComplete(5);

  const submitBrand = async () => {
    if (!canSubmitBrand) {
      setError('Please fill in all required brand fields before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload: any = { ...brand };
      if (!payload.website) delete payload.website;
      if (!payload.stockSymbol) delete payload.stockSymbol;
      if (!payload.stockExchange) delete payload.stockExchange;
      if (!payload.firstName) delete payload.firstName;
      if (!payload.lastName) delete payload.lastName;

      const res = await fetch('/api/brand', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error?.errors?.[0]?.detail || data.error?.detail || JSON.stringify(data.error);
        throw new Error(msg);
      }
      const id = data.data?.brandId || data.brandId || data.data?.id || data.id || '';
      setBrandId(id);
      setBrandSubmitted(true);
      setCampaign(c => ({ ...c, brandId: id }));
      setStep(3);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCampaign = async () => {
    if (!canSubmitCampaign) {
      setError('Please fill in all required campaign fields and submit brand first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload: any = { ...campaign };
      if (!payload.sample2) delete payload.sample2;

      const res = await fetch('/api/campaign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error?.errors?.[0]?.detail || data.error?.detail || JSON.stringify(data.error);
        throw new Error(msg);
      }
      const id = data.data?.campaignId || data.campaignId || data.data?.id || data.id || '';
      setCampaignId(id);
      setCampaignSubmitted(true);
      setStep(6);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 2) {
      // Brand review: submit if ready, otherwise just continue
      if (canSubmitBrand && !brandSubmitted) return submitBrand();
      // If already submitted or not ready, just move forward
      setStep(3);
      return;
    }
    if (step === 5) {
      if (canSubmitCampaign) return submitCampaign();
      setError('Please complete all required fields and submit your brand before submitting the campaign.');
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleReset = () => {
    setStep(0);
    setBrand(defaultBrand);
    setCampaign(defaultCampaign);
    setBrandId('');
    setCampaignId('');
    setBrandSubmitted(false);
    setCampaignSubmitted(false);
    setError('');
    setComplianceResult(null);
    clearState();
  };

  // Determine button labels and states
  const getNextLabel = () => {
    if (step === 2) {
      if (brandSubmitted) return 'Continue to Campaign';
      if (canSubmitBrand) return 'Submit Brand';
      return 'Continue';
    }
    if (step === 5) {
      if (canSubmitCampaign) return 'Submit Campaign';
      return 'Continue';
    }
    return 'Continue';
  };

  // Can always click Continue (never disabled), except on final submission steps with loading
  const nextDisabled = loading;

  // Missing fields warning
  const getMissingFields = (s: number): string[] => {
    const missing: string[] = [];
    if (s >= 0 && !brand.entityType) missing.push('Business Type');
    if (s >= 1) {
      if (!brand.displayName) missing.push('Display Name');
      if (!brand.companyName) missing.push('Company Name');
      if (!brand.ein || brand.ein.length !== 9) missing.push('EIN (9 digits)');
      if (!brand.email) missing.push('Email');
      if (!brand.phone) missing.push('Phone');
      if (!brand.street) missing.push('Street');
      if (!brand.city) missing.push('City');
      if (!brand.state) missing.push('State');
      if (!brand.postalCode) missing.push('Postal Code');
      if (!brand.vertical) missing.push('Vertical');
      if (!brand.brandRelationship) missing.push('Volume');
    }
    return missing;
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      {step < 6 && (
        <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Step {step + 1} of 7</span>
              <span className="text-xs font-medium text-[#0ea5e9]">{STEPS[step]}</span>
            </div>
            <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
              <div className="h-full bg-[#0ea5e9] rounded-full transition-all duration-500" style={{ width: `${(step / 7) * 100}%` }} />
            </div>
            {/* Clickable step indicators */}
            <div className="flex justify-between mt-2">
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  onClick={() => { setError(''); setStep(i); }}
                  disabled={i === 6 && !campaignSubmitted}
                  className={`text-[10px] hidden md:block transition-colors ${
                    i === step ? 'text-[#0ea5e9] font-semibold' :
                    i <= step ? 'text-[#0ea5e9] hover:underline cursor-pointer' :
                    'text-[var(--text-secondary)] hover:underline cursor-pointer'
                  } ${i === 6 && !campaignSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Status badges */}
            <div className="flex gap-3 mt-3">
              {brandSubmitted ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">✅ Brand Submitted</span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--text-secondary)] border border-[var(--border)] font-medium">Brand: Draft</span>
              )}
              {campaignSubmitted ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">✅ Campaign Submitted</span>
              ) : brandSubmitted ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--text-secondary)] border border-[var(--border)] font-medium">Campaign: Draft</span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--text-secondary)] border border-[var(--border)] font-medium opacity-50">Campaign: Waiting for Brand</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {error && <ErrorBanner message={error} />}

        {/* Show warning if on brand submit step but fields missing */}
        {step === 2 && !brandSubmitted && !canSubmitBrand && (
          <InfoBox variant="warning">
            Some required fields are incomplete. You can still review, but you&apos;ll need to go back and fill them in before submitting the brand.
            <ul className="mt-1 text-xs list-disc list-inside">
              {getMissingFields(1).map(f => <li key={f}>{f}</li>)}
            </ul>
          </InfoBox>
        )}

        {/* Show info if trying to do campaign without brand */}
        {step >= 3 && step <= 5 && !brandSubmitted && (
          <InfoBox variant="warning">
            Brand hasn&apos;t been submitted yet. You can fill out campaign details now and come back to submit the brand when ready.
          </InfoBox>
        )}

        {step === 0 && <Step1 brand={brand} setBrand={setBrand} />}
        {step === 1 && <Step2 brand={brand} setBrand={setBrand} />}
        {step === 2 && <Step3 brand={brand} complianceResult={complianceResult} onComplianceResult={setComplianceResult} onProceed={() => { if (canSubmitBrand) submitBrand(); else setStep(3); }} />}
        {step === 3 && <Step4 campaign={campaign} setCampaign={setCampaign} brand={brand} />}
        {step === 4 && <Step5 campaign={campaign} setCampaign={setCampaign} brand={brand} />}
        {step === 5 && <Step6 campaign={campaign} setCampaign={setCampaign} brand={brand} />}
        {step === 6 && <Step7 brandId={brandId} campaignId={campaignId} brand={brand} campaign={campaign} onReset={handleReset} />}

        {/* Navigation */}
        {step < 6 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-[var(--border)]">
            <Button variant="secondary" onClick={handleBack} disabled={step === 0}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={nextDisabled}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Submitting...
                </span>
              ) : getNextLabel()}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
