import { LegalLayout } from "@/components/legal/legal-layout";

export default function AcceptableUsePage() {
  return (
    <LegalLayout title="Acceptable Use">
      <p>You may not use UNISAVE to:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Access private, login-only, or restricted content without authorization</li>
        <li>Bypass DRM, paywalls, authentication, or technical access controls</li>
        <li>Remove or circumvent creator or platform watermarks through unauthorized manipulation</li>
        <li>Abuse the API, scrape at excessive volume, or attack the service</li>
        <li>Violate applicable laws or third-party terms of service</li>
      </ul>
      <p>
        UNISAVE presents legitimately available media variants returned by supported platforms for
        public URLs.
      </p>
    </LegalLayout>
  );
}
