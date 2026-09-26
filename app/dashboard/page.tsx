import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Optional accounts (email and Google OAuth) are planned. Core UNISAVE features remain
        available without signing in.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Overview", "Downloads", "Favorites", "API Keys", "Usage Analytics", "Settings"].map((item) => (
          <Card key={item} className="p-6 transition-all hover:border-violet-500/30">
            <h2 className="text-lg font-bold text-foreground">{item}</h2>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Requires account — coming soon</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

