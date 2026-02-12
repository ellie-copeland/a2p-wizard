'use client';
import React from 'react';

export function Input({ label, error, className: wrapClass, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={wrapClass}>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
      <input
        className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition"
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
    ? 'bg-[#0ea5e9] hover:bg-[#0284c7] text-white'
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

export function InfoBox({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'info' | 'warning' | 'success' }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };
  const icons = { info: 'ℹ️', warning: '⚠️', success: '✅' };
  return (
    <div className={`rounded-lg border p-3 text-sm ${styles[variant]}`}>
      <span className="mr-1.5">{icons[variant]}</span>
      {children}
    </div>
  );
}

export function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[var(--text-secondary)] mt-0.5 ml-0.5">{children}</p>;
}

export function ValidationItem({ passed, warn, label }: { passed: boolean; warn?: boolean; label: string }) {
  const icon = passed ? '✅' : warn ? '⚠️' : '❌';
  const color = passed ? 'text-green-700' : warn ? 'text-amber-700' : 'text-red-600';
  return (
    <div className={`flex items-center gap-2 text-sm ${color}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0ea5e9] text-white hover:opacity-90 transition"
    >
      {copied ? '✓ Copied!' : label}
    </button>
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
