import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__statement">{SITE_TAGLINE}</p>
      <div className="site-footer__meta">
        <span>{SITE_NAME}</span>
        <div>
          <Link href="/practice">Essay Practice</Link>
          <Link href="/library">Essay Library</Link>
          <Link href="/membership">Membership</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/refund">Refunds</Link>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
