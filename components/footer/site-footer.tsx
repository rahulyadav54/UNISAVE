import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--card-border)] bg-[var(--card-bg)]/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            One Link. One Place. Save What Matters. Analyze and process publicly
            accessible media from supported platforms with a premium, privacy-conscious
            workflow.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span>Service provided & managed by</span>
            <a
              href="https://zayacodehub.in"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 underline underline-offset-2"
            >
              ZAYA CODE HUB
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/tools" className="hover:text-violet-600 dark:hover:text-violet-300">Tools</Link></li>
            <li><Link href="/platforms" className="hover:text-violet-600 dark:hover:text-violet-300">Platforms</Link></li>
            <li><Link href="/api-docs" className="hover:text-violet-600 dark:hover:text-violet-300">API</Link></li>
            <li><Link href="/about" className="hover:text-violet-600 dark:hover:text-violet-300">About</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-violet-600 dark:hover:text-violet-300">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-violet-600 dark:hover:text-violet-300">Terms</Link></li>
            <li><Link href="/copyright" className="hover:text-violet-600 dark:hover:text-violet-300">Copyright</Link></li>
            <li><Link href="/acceptable-use" className="hover:text-violet-600 dark:hover:text-violet-300">Acceptable Use</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--card-border)] py-6 text-center text-xs text-muted-foreground space-y-1">
        <p>
          © {new Date().getFullYear()} UNISAVE. Managed & Provided by{" "}
          <a
            href="https://zayacodehub.in"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-foreground hover:text-violet-500 underline underline-offset-2"
          >
            ZAYA CODE HUB
          </a>
        </p>
        <p className="text-[11px] text-muted-foreground/70">
          You are responsible for having rights to download or process content.
        </p>
      </div>
    </footer>
  );
}


