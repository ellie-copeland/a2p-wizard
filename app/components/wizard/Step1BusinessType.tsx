'use client';
import { ENTITY_TYPES } from './constants';
import { BrandData } from './types';

export default function Step1({ brand, setBrand }: { brand: BrandData; setBrand: (b: BrandData) => void }) {
  return (
    <div className="step-enter space-y-4">
      <h2 className="text-2xl font-bold">What type of business are you?</h2>
      <p className="text-[var(--text-secondary)]">Select your business entity type to get started.</p>
      <div className="grid gap-3 mt-6">
        {ENTITY_TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => setBrand({ ...brand, entityType: t.value })}
            className={`text-left p-4 rounded-xl border-2 transition ${
              brand.entityType === t.value
                ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                : 'border-[var(--border)] hover:border-[var(--accent)]/50'
            }`}
          >
            <div className="font-semibold">{t.label}</div>
            <div className="text-sm text-[var(--text-secondary)]">{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
