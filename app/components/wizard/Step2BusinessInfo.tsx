'use client';
import { VERTICALS, BRAND_RELATIONSHIPS, STOCK_EXCHANGES } from './constants';
import { BrandData } from './types';
import { Input, Select } from './ui';

export default function Step2({ brand, setBrand }: { brand: BrandData; setBrand: (b: BrandData) => void }) {
  const u = (field: keyof BrandData, value: string) => setBrand({ ...brand, [field]: value });
  const showStock = brand.entityType === 'PUBLIC_PROFIT';

  return (
    <div className="step-enter space-y-6">
      <h2 className="text-2xl font-bold">Business Information</h2>
      <p className="text-[var(--text-secondary)]">Tell us about your company.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Display Name" value={brand.displayName} onChange={e => u('displayName', e.target.value)} placeholder="Acme Inc" required />
        <Input label="Legal Company Name" value={brand.companyName} onChange={e => u('companyName', e.target.value)} placeholder="Acme Corporation LLC" required />
        <Input label="EIN (9 digits)" value={brand.ein} onChange={e => u('ein', e.target.value.replace(/\D/g, '').slice(0, 9))} placeholder="123456789" maxLength={9} required />
        <Select label="Industry Vertical" value={brand.vertical} onChange={e => u('vertical', e.target.value)} options={VERTICALS.map(v => ({ value: v, label: v.replace(/_/g, ' ') }))} required />
        <Select label="Message Volume" value={brand.brandRelationship} onChange={e => u('brandRelationship', e.target.value)} options={BRAND_RELATIONSHIPS} required />
        <Input label="Website" value={brand.website} onChange={e => u('website', e.target.value)} placeholder="https://example.com" />
      </div>

      <h3 className="text-lg font-semibold pt-2">Contact</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="First Name" value={brand.firstName} onChange={e => u('firstName', e.target.value)} />
        <Input label="Last Name" value={brand.lastName} onChange={e => u('lastName', e.target.value)} />
        <Input label="Email" type="email" value={brand.email} onChange={e => u('email', e.target.value)} required />
        <Input label="Phone (E.164)" value={brand.phone} onChange={e => u('phone', e.target.value)} placeholder="+15551234567" required />
      </div>

      <h3 className="text-lg font-semibold pt-2">Address</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Street" value={brand.street} onChange={e => u('street', e.target.value)} className="md:col-span-2" required />
        <Input label="City" value={brand.city} onChange={e => u('city', e.target.value)} required />
        <Input label="State (2-letter)" value={brand.state} onChange={e => u('state', e.target.value.toUpperCase().slice(0, 2))} maxLength={2} required />
        <Input label="Postal Code" value={brand.postalCode} onChange={e => u('postalCode', e.target.value)} required />
      </div>

      {showStock && (
        <>
          <h3 className="text-lg font-semibold pt-2">Stock Info</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Stock Symbol" value={brand.stockSymbol} onChange={e => u('stockSymbol', e.target.value)} />
            <Select label="Stock Exchange" value={brand.stockExchange} onChange={e => u('stockExchange', e.target.value)} options={STOCK_EXCHANGES.map(v => ({ value: v, label: v }))} />
          </div>
        </>
      )}
    </div>
  );
}
