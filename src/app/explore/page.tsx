import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Icon } from "@/components/icon";

export const metadata = {
  title: "Explore Engineering — The Engineering Commons",
};

export default async function ExplorePage() {
  const disciplines = await api.listDisciplines();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">
          Explore Engineering
        </h1>
        <p className="mt-4 text-lg text-on-surface-variant">
          Dive into the core disciplines driving modern innovation. Discover
          foundational principles, cutting-edge research, and practical
          applications across specialized fields.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {disciplines.map((d) => (
          <Link
            key={d.slug}
            href={`/?discipline=${d.slug}`}
            className="group relative overflow-hidden rounded-lg bg-surface-container-lowest p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(11,28,48,0.06)]"
          >
            {/* subtle emerald corner accent */}
            <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-secondary/10 transition-transform group-hover:scale-125" />

            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
              <Icon name={d.icon} className="h-5 w-5" />
            </span>

            <h2 className="mt-5 text-lg font-semibold text-on-surface">
              {d.name}
            </h2>
            <p className="mt-1.5 line-clamp-3 text-sm text-on-surface-variant">
              {d.description}
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Browse articles
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
