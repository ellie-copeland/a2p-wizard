'use client';
import { USE_CASES } from './constants';
import { CampaignData } from './types';
import { Select, Textarea, Input } from './ui';

export default function Step4({ campaign, setCampaign }: { campaign: CampaignData; setCampaign: (c: CampaignData) => void }) {
  const u = (field: keyof CampaignData, value: any) => setCampaign({ ...campaign, [field]: value });

  return (
    <div className="step-enter space-y-6">
      <h2 className="text-2xl font-bold">Campaign Setup</h2>
      <p className="text-[var(--text-secondary)]">Define your messaging campaign.</p>

      <Select
        label="Use Case"
        value={campaign.usecase}
        onChange={e => u('usecase', e.target.value)}
        options={USE_CASES.map(v => ({ value: v, label: v.replace(/_/g, ' ') }))}
        required
      />

      <Textarea
        label="Campaign Description (40-4096 chars)"
        value={campaign.description}
        onChange={e => u('description', e.target.value)}
        placeholder="Describe what this campaign is for..."
        minLength={40}
        maxLength={4096}
        required
      />
      <p className="text-xs text-[var(--text-secondary)]">{campaign.description.length}/4096 characters</p>

      <Input
        label="Sample Message 1"
        value={campaign.sample1}
        onChange={e => u('sample1', e.target.value)}
        placeholder="Hi {{name}}, your appointment is confirmed for tomorrow at 2pm."
        required
      />

      <Input
        label="Sample Message 2 (optional)"
        value={campaign.sample2}
        onChange={e => u('sample2', e.target.value)}
        placeholder="Reminder: your payment of $50 is due on 3/15."
      />

      <Textarea
        label="Message Flow (how do users opt in?)"
        value={campaign.messageFlow}
        onChange={e => u('messageFlow', e.target.value)}
        placeholder="Users opt in by submitting a form on our website and checking a box to receive SMS notifications..."
        required
      />
    </div>
  );
}
