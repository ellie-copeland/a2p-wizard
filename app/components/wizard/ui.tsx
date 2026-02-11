'use client';
import React from 'react';

export function Input({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
      <input
        className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
        {...props}
      />
      {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Select({ label, options, error, ...props }: { label: string; options: { value: string; label: string }[]; error?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
      <select
        className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
        {...props}
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, ...props }: { label: string; error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
      <textarea
        className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition min-h-[80px]"
        {...props}
      />
      {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 rounded accent-[var(--accent)]" />
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function Button({ variant = 'primary', ...props }: { variant?: 'primary' | 'secondary' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = 'px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = variant === 'primary'
    ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white'
    : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-secondary)]';
  return <button className={`${base} ${styles}`} {...props} />;
}

export function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-[var(--border)]">
      <span className="text-[var(--text-secondary)] text-sm">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%]">{value || '—'}</span>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-500/10 border border-[var(--error)] text-[var(--error)] rounded-lg p-4 mb-4">
      <p className="text-sm font-medium">Error</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
