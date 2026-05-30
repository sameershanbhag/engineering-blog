import Link from "next/link";

const LINKS = [
  { href: "/explore", label: "Technical Resources" },
  { href: "/", label: "Newsletter" },
  { href: "/explore", label: "Discipline Links" },
  { href: "/", label: "Privacy Policy" },
  { href: "/", label: "Terms of Service" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-outline-variant/40 bg-surface-container-low">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-base font-bold text-primary">
            The Engineering Commons
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            © 2024 The Engineering Commons. Built for builders.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
