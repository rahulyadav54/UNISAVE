import { notFound } from "next/navigation";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformPage } from "@/components/platform/platform-page";

export function generateStaticParams() {
  return PLATFORMS.map((p) => ({ platform: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform: slug } = await params;
  const meta = PLATFORMS.find((p) => p.slug === slug);
  if (!meta) return {};
  return {
    title: `${meta.name} — UNISAVE`,
    description: `Analyze publicly accessible ${meta.name} media with UNISAVE.`,
  };
}

export default async function PlatformLandingPage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform: slug } = await params;
  const meta = PLATFORMS.find((p) => p.slug === slug);
  if (!meta) notFound();
  return <PlatformPage platform={meta} />;
}
