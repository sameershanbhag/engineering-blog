import {
  Atom,
  Bot,
  Building2,
  Code,
  Cog,
  Cpu,
  Database,
  GitBranch,
  Leaf,
  Network,
  Recycle,
  Server,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Maps the string icon keys stored in data to Lucide components. */
const ICONS: Record<string, LucideIcon> = {
  atom: Atom,
  bot: Bot,
  "building-2": Building2,
  code: Code,
  cog: Cog,
  cpu: Cpu,
  database: Database,
  "git-branch": GitBranch,
  leaf: Leaf,
  network: Network,
  recycle: Recycle,
  server: Server,
  terminal: Terminal,
  zap: Zap,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Code;
  return <Cmp className={className} aria-hidden />;
}
