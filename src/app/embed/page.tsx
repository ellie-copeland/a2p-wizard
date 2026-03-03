"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import A2PWizardComponent, { type WizardConfig } from "@/components/A2PWizard";

function EmbedWizard() {
  const searchParams = useSearchParams();

  const config: WizardConfig = {
    accountId: searchParams.get("accountId") || undefined,
    webhookUrl: searchParams.get("webhook") || searchParams.get("webhookUrl") || undefined,
    embedded: true,
    branding: {
      logoUrl: searchParams.get("logoUrl") || undefined,
      companyName: searchParams.get("companyName") || undefined,
    },
    theme: {
      primaryColor: searchParams.get("primaryColor") || undefined,
      backgroundColor: searchParams.get("backgroundColor") || undefined,
      borderColor: searchParams.get("borderColor") || undefined,
      fontFamily: searchParams.get("fontFamily") || undefined,
      borderRadius: searchParams.get("borderRadius") || undefined,
    },
    // Note: API keys are NOT accepted via URL params for security.
    // They should be passed via postMessage from the SDK after load.
    allowedOrigins: searchParams.get("allowedOrigins")?.split(",").filter(Boolean) || undefined,
  };

  // Parse prefill params (any param starting with "prefill_")
  const prefill: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith("prefill_")) {
      prefill[key.slice(8)] = value;
    }
  });
  if (Object.keys(prefill).length > 0) {
    config.prefill = prefill as WizardConfig["prefill"];
  }

  return <A2PWizardComponent config={config} />;
}

export default function EmbedPage() {
  return (
    <>
      <style>{`html, body { height: 100%; margin: 0; overflow: hidden; } #__next { height: 100%; }`}</style>
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-xs text-[#7F7F7F]">Loading wizard...</div>}>
        <EmbedWizard />
      </Suspense>
    </>
  );
}
