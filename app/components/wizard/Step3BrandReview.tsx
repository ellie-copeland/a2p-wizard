'use client';
import { BrandData } from './types';
import { ReviewRow } from './ui';

export default function Step3({ brand }: { brand: BrandData }) {
  return (
    <div className="step-enter space-y-4">
      <h2 className="text-2xl font-bold">Review Brand Information</h2>
      <p className="text-[var(--text-secondary)]">Please confirm everything looks correct before submitting.</p>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-1">
        <ReviewRow label="Entity Type" value={brand.entityType.replace(/_/g, ' ')} />
        <ReviewRow label="Display Name" value={brand.displayName} />
        <ReviewRow label="Company Name" value={brand.companyName} />
        <ReviewRow label="EIN" value={brand.ein} />
        <ReviewRow label="Vertical" value={brand.vertical.replace(/_/g, ' ')} />
        <ReviewRow label="Volume" value={brand.brandRelationship.replace(/_/g, ' ')} />
        <ReviewRow label="Email" value={brand.email} />
        <ReviewRow label="Phone" value={brand.phone} />
        <ReviewRow label="Address" value={`${brand.street}, ${brand.city}, ${brand.state} ${brand.postalCode}`} />
        {brand.website && <ReviewRow label="Website" value={brand.website} />}
        {brand.firstName && <ReviewRow label="Contact" value={`${brand.firstName} ${brand.lastName}`} />}
      </div>
    </div>
  );
}
