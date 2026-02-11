'use client';
import { useState } from 'react';
import { STEPS } from './components/wizard/constants';
import { BrandData, CampaignData, defaultBrand, defaultCampaign } from './components/wizard/types';
import { Button, ErrorBanner } from './components/wizard/ui';
import Step1 from './components/wizard/Step1BusinessType';
import Step2 from './components/wizard/Step2BusinessInfo';
import Step3 from './components/wizard/Step3BrandReview';
import Step4 from './components/wizard/Step4CampaignSetup';
import Step5 from './components/wizard/Step5Compliance';
import Step6 from './components/wizard/Step6CampaignReview';
import Step7 from './components/wizard/Step7Confirmation';

export default function Home() {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState<BrandData>(defaultBrand);
  const [campaign, setCampaign] = useState<CampaignData>(defaultCampaign);
  const [brandId, setBrandId] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canNext = (): boolean => {
    switch (step) {
      case 0: return !!brand.entityType;
      case 1: return !!(brand.displayName && brand.companyName && brand.ein?.length === 9 && brand.email && brand.phone && brand.street && brand.city && brand.state && brand.postalCode && brand.vertical && brand.brandRelationship);
      case 2: return true;
      case 3: return !!(campaign.usecase && campaign.description.length >= 40 && campaign.sample1 && campaign.messageFlow);
      case 4: return !!(campaign.optinMessage && campaign.optoutMessage && campaign.helpMessage);
      case 5: return campaign.termsAndConditions;
      default: return false;
    }
  };

  const submitBrand = async () => {
    setLoading(true);
    setError('');
    try {
      const payload: any = { ...brand };
      // Remove empty optional fields
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
      setCampaign(c => ({ ...c, brandId: id }));
      setStep(3);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCampaign = async () => {
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
      setStep(6);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 2) return submitBrand();
    if (step === 5) return submitCampaign();
    setStep(s => s + 1);
  };

  const nextLabel = step === 2 ? 'Submit Brand' : step === 5 ? 'Submit Campaign' : 'Continue';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      {step < 6 && (
        <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Step {step + 1} of 7</span>
              <span className="text-xs font-medium text-[var(--accent)]">{STEPS[step]}</span>
            </div>
            <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent)] rounded-full transition-all duration-500" style={{ width: `${((step + 1) / 7) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              {STEPS.map((s, i) => (
                <span key={s} className={`text-[10px] hidden md:block ${i <= step ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {error && <ErrorBanner message={error} />}

        {step === 0 && <Step1 brand={brand} setBrand={setBrand} />}
        {step === 1 && <Step2 brand={brand} setBrand={setBrand} />}
        {step === 2 && <Step3 brand={brand} />}
        {step === 3 && <Step4 campaign={campaign} setCampaign={setCampaign} />}
        {step === 4 && <Step5 campaign={campaign} setCampaign={setCampaign} />}
        {step === 5 && <Step6 campaign={campaign} setCampaign={setCampaign} />}
        {step === 6 && <Step7 brandId={brandId} campaignId={campaignId} />}

        {/* Navigation */}
        {step < 6 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-[var(--border)]">
            <Button variant="secondary" onClick={() => { setError(''); setStep(s => s - 1); }} disabled={step === 0}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canNext() || loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Submitting...
                </span>
              ) : nextLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
