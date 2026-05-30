import Link from "next/link";

/** Centered card layout shared by the login and register pages. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          The Engineering Commons
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-on-surface">{title}</h1>
        <p className="mt-1.5 text-sm text-on-surface-variant">{subtitle}</p>
      </div>

      <div className="mt-8 rounded-xl bg-surface-container-low p-6 sm:p-8">
        {children}
      </div>

      <p className="mt-6 text-center text-sm text-on-surface-variant">{footer}</p>
    </div>
  );
}

/** Labeled "or" divider between OAuth and email forms. */
export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-outline-variant/60" />
      <span className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
        or
      </span>
      <span className="h-px flex-1 bg-outline-variant/60" />
    </div>
  );
}
