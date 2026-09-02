"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";
import { SettingsDialog } from "./SettingsDialog";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  ["Essay Practice", "/practice"],
  ["Word Practice", "/words"],
  ["Essay Library", "/library"],
  ["Progress", "/progress"],
  ["Mistake Review", "/vocabulary"],
  ["About Us", "/about"],
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link href="/" className="wordmark" aria-label={`${SITE_NAME} home`}>
          <span className="wordmark__mark" aria-hidden="true">T/</span>
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="site-nav__links" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? "is-active" : ""}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="site-nav__actions">
          <ThemeToggle />
          <SettingsDialog />
          <button className="profile-button" type="button" disabled title="Account sync arrives in Phase 2">
            <UserRound aria-hidden="true" />
            <span>Guest</span>
          </button>
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={pathname === href ? "is-active" : ""}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
