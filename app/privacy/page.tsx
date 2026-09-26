import { LegalLayout } from "@/components/legal/legal-layout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        UNISAVE is designed to minimize unnecessary collection of personal data. URL analysis
        requests are processed to return media metadata and formats. We avoid storing raw URLs
        longer than needed for processing and caching.
      </p>
      <p>
        Recent download history for guests is stored locally in your browser. Optional accounts
        may store usage preferences and download history when that feature launches.
      </p>
      <p>
        Contact: privacy@unisave.app (placeholder — update for production deployment).
      </p>
    </LegalLayout>
  );
}
