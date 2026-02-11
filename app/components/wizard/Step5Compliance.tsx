'use client';
import { CampaignData } from './types';
import { Input, Textarea, Checkbox } from './ui';

export default function Step5({ campaign, setCampaign }: { campaign: CampaignData; setCampaign: (c: CampaignData) => void }) {
  const u = (field: keyof CampaignData, value: any) => setCampaign({ ...campaign, [field]: value });

  return (
    <div className="step-enter space-y-6">
      <h2 className="text-2xl font-bold">Compliance Settings</h2>
      <p className="text-[var(--text-secondary)]">Configure opt-in, opt-out, and help messages.</p>

      <div className="space-y-4">
        <h3 className="font-semibold">Opt-In</h3>
        <Textarea label="Opt-In Message" value={campaign.optinMessage} onChange={e => u('optinMessage', e.target.value)}
          placeholder="You are now subscribed to Acme alerts. Reply HELP for help, STOP to unsubscribe. Msg & data rates may apply." required />
        <Input label="Opt-In Keywords" value={campaign.optinKeywords} onChange={e => u('optinKeywords', e.target.value)} placeholder="START, YES" />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Opt-Out</h3>
        <Textarea label="Opt-Out Message" value={campaign.optoutMessage} onChange={e => u('optoutMessage', e.target.value)} required />
        <Input label="Opt-Out Keywords" value={campaign.optoutKeywords} onChange={e => u('optoutKeywords', e.target.value)} placeholder="STOP, QUIT, CANCEL" />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Help</h3>
        <Textarea label="Help Message" value={campaign.helpMessage} onChange={e => u('helpMessage', e.target.value)} required />
        <Input label="Help Keywords" value={campaign.helpKeywords} onChange={e => u('helpKeywords', e.target.value)} placeholder="HELP" />
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-semibold">Campaign Flags</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <Checkbox label="Subscriber Opt-In supported" checked={campaign.subscriberOptin} onChange={v => u('subscriberOptin', v)} />
          <Checkbox label="Subscriber Opt-Out supported" checked={campaign.subscriberOptout} onChange={v => u('subscriberOptout', v)} />
          <Checkbox label="Subscriber Help supported" checked={campaign.subscriberHelp} onChange={v => u('subscriberHelp', v)} />
          <Checkbox label="Messages contain embedded links" checked={campaign.embeddedLink} onChange={v => u('embeddedLink', v)} />
          <Checkbox label="Messages contain phone numbers" checked={campaign.embeddedPhone} onChange={v => u('embeddedPhone', v)} />
          <Checkbox label="Uses number pool" checked={campaign.numberPool} onChange={v => u('numberPool', v)} />
          <Checkbox label="Age-gated content" checked={campaign.ageGated} onChange={v => u('ageGated', v)} />
          <Checkbox label="Direct lending / loan" checked={campaign.directLending} onChange={v => u('directLending', v)} />
          <Checkbox label="Auto-renewal" checked={campaign.autoRenewal} onChange={v => u('autoRenewal', v)} />
        </div>
      </div>
    </div>
  );
}
