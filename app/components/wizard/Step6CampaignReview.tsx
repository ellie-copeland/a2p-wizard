'use client';
import { CampaignData } from './types';
import { ReviewRow, Checkbox } from './ui';

export default function Step6({ campaign, setCampaign }: { campaign: CampaignData; setCampaign: (c: CampaignData) => void }) {
  return (
    <div className="step-enter space-y-4">
      <h2 className="text-2xl font-bold">Review Campaign</h2>
      <p className="text-[var(--text-secondary)]">Review your campaign details before submission.</p>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-1">
        <ReviewRow label="Use Case" value={campaign.usecase.replace(/_/g, ' ')} />
        <ReviewRow label="Description" value={campaign.description.slice(0, 100) + (campaign.description.length > 100 ? '...' : '')} />
        <ReviewRow label="Sample Message 1" value={campaign.sample1} />
        {campaign.sample2 && <ReviewRow label="Sample Message 2" value={campaign.sample2} />}
        <ReviewRow label="Message Flow" value={campaign.messageFlow.slice(0, 100) + (campaign.messageFlow.length > 100 ? '...' : '')} />
        <ReviewRow label="Opt-In Keywords" value={campaign.optinKeywords} />
        <ReviewRow label="Opt-Out Keywords" value={campaign.optoutKeywords} />
        <ReviewRow label="Help Keywords" value={campaign.helpKeywords} />
        <ReviewRow label="Embedded Links" value={campaign.embeddedLink ? 'Yes' : 'No'} />
        <ReviewRow label="Embedded Phone" value={campaign.embeddedPhone ? 'Yes' : 'No'} />
        <ReviewRow label="Age Gated" value={campaign.ageGated ? 'Yes' : 'No'} />
        <ReviewRow label="Direct Lending" value={campaign.directLending ? 'Yes' : 'No'} />
      </div>
      <div className="pt-4">
        <Checkbox
          label="I agree to the terms and conditions for 10DLC messaging"
          checked={campaign.termsAndConditions}
          onChange={v => setCampaign({ ...campaign, termsAndConditions: v })}
        />
      </div>
    </div>
  );
}
