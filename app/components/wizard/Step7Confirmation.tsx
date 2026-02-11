'use client';

export default function Step7({ brandId, campaignId }: { brandId: string; campaignId: string }) {
  return (
    <div className="step-enter text-center space-y-6 py-8">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--success)]/20 mb-4">
        <svg className="w-10 h-10 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold">Registration Complete!</h2>
      <p className="text-[var(--text-secondary)] max-w-md mx-auto">
        Your brand and campaign have been submitted for review. You&apos;ll receive updates on the approval status.
      </p>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 max-w-sm mx-auto space-y-4">
        <div>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Brand ID</p>
          <p className="font-mono text-sm mt-1 break-all">{brandId}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Campaign ID</p>
          <p className="font-mono text-sm mt-1 break-all">{campaignId}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Status</p>
          <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
            Pending Review
          </span>
        </div>
      </div>
    </div>
  );
}
