import { LegalLayout } from "@/components/legal/legal-layout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        By using UNISAVE, you agree to use the service only for content you have the right to
        access, download, or process. UNISAVE provides tooling for publicly accessible media and
        does not guarantee availability of any specific platform or format.
      </p>
      <p>
        The service is provided as-is without warranties. We may update these terms as the
        product evolves.
      </p>
    </LegalLayout>
  );
}
