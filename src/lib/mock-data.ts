import type { Article, Author, Discipline, Topic } from "./types";

/*
  Mock dataset standing in for the separate backend service. The API client in
  `api.ts` returns this when no NEXT_PUBLIC_API_URL is configured, so the UI is
  fully functional offline. Swap the env var to point at the real service later.
*/

export const disciplines: Discipline[] = [
  {
    slug: "robotics",
    name: "Robotics",
    description:
      "Design, construction, operation, and use of robots and computer systems for control and sensory feedback.",
    icon: "bot",
  },
  {
    slug: "sustainability",
    name: "Sustainability",
    description:
      "Developing solutions that preserve natural resources and reduce the environmental footprint of engineering.",
    icon: "leaf",
  },
  {
    slug: "materials-science",
    name: "Materials Science",
    description:
      "Discovery and design of new solid materials for advanced and demanding applications.",
    icon: "atom",
  },
  {
    slug: "software",
    name: "Software",
    description:
      "Systematic application of engineering approaches to the development of resilient software systems.",
    icon: "code",
  },
  {
    slug: "hardware",
    name: "Hardware",
    description:
      "Physical components of technology systems and the boards, chips, and circuits that power them.",
    icon: "cpu",
  },
  {
    slug: "civil-systems",
    name: "Civil Systems",
    description:
      "Design and construction of infrastructure, bridges, and the systems that keep cities moving.",
    icon: "building-2",
  },
  {
    slug: "mechanical",
    name: "Mechanical",
    description:
      "Analysis, design, manufacturing, and maintenance of mechanical systems and machinery.",
    icon: "cog",
  },
  {
    slug: "electrical",
    name: "Electrical",
    description:
      "Study and application of electricity, electronics, and electromagnetism in modern systems.",
    icon: "zap",
  },
];

const bySlug = (slug: string) =>
  disciplines.find((d) => d.slug === slug) as Discipline;

export const authors: Record<string, Author> = {
  aris_thorne: {
    handle: "aris_thorne",
    name: "Dr. Aris Thorne",
    title: "Staff Distributed Systems Engineer",
    bio: "Specializing in high-throughput message queues and Byzantine fault tolerance. Ex-Cloudflare, current architecture lead at DataStream. Author of “Concurrency in Practice: Modern Patterns.”",
    avatarUrl: "https://i.pravatar.cc/160?img=12",
    avatarColor: "bg-indigo-600",
    github: "github.com/aristhorne",
    stats: { engagements: 14200, followers: 3100, following: 143 },
  },
  sarah_jenkins: {
    handle: "sarah_jenkins",
    name: "Sarah Jenkins",
    title: "Principal Engineer, Data Infrastructure",
    bio: "Building reliable streaming platforms at scale. Kafka contributor and event-driven architecture advocate.",
    avatarUrl: "https://i.pravatar.cc/160?img=5",
    avatarColor: "bg-emerald-600",
    github: "github.com/sjenkins",
    stats: { engagements: 9800, followers: 2400, following: 210 },
  },
  david_chen: {
    handle: "david_chen",
    name: "David Chen",
    title: "Staff Software Engineer",
    bio: "Systems programmer focused on compiler performance and developer tooling. Rust enthusiast.",
    avatarUrl: "https://i.pravatar.cc/160?img=13",
    avatarColor: "bg-cyan-700",
    github: "github.com/dchen",
    stats: { engagements: 7600, followers: 1800, following: 96 },
  },
  elena_rodriguez: {
    handle: "elena_rodriguez",
    name: "Elena Rodriguez",
    title: "Principal Engineer, Data Infrastructure",
    bio: "Distributed databases, consensus protocols, and the occasional foray into formal verification.",
    avatarUrl: "https://i.pravatar.cc/160?img=9",
    avatarColor: "bg-violet-600",
    stats: { engagements: 11300, followers: 2900, following: 120 },
  },
  marcus_johnson: {
    handle: "marcus_johnson",
    name: "Marcus Johnson",
    title: "Staff Software Engineer",
    bio: "Backend reliability, observability, and the art of the postmortem.",
    // No avatarUrl — demonstrates the generated initials fallback.
    avatarColor: "bg-slate-700",
    stats: { engagements: 6400, followers: 1500, following: 88 },
  },
};

export const articles: Article[] = [
  {
    slug: "architecting-for-resilience",
    title: "Architecting for Resilience: A Deep Dive into Distributed Systems",
    excerpt:
      "Building scalable systems is rarely about chasing the latest technology. It is about navigating a series of complex trade-offs in latency, consistency, and the inevitability of partial failure.",
    contentHtml: `
      <p>Building scalable systems is rarely about chasing the latest technology. It is about navigating a series of complex trade-offs. When we talk about resilience, we are really asking a single question: <em>what happens when a part of the system fails?</em></p>
      <h2>The Fallacy of the Perfect Network</h2>
      <p>One of the classic distributed computing fallacies is assuming that the network is reliable. When services communicate over a network, failure is not a possibility, it is a statistical certainty. Whether it is a transient packet drop, a misconfigured router, or a sudden traffic spike, your services <em>will</em> experience timeouts.</p>
      <p>Consider a simple synchronous checkout flow. The order service must communicate with the payment gateway, inventory service, and notification service. If the payment gateway experiences a 4-second latency spike, simple synchronous calls will propagate that latency back to the user, potentially leading to timeouts and a degraded user experience.</p>
      <pre><code>async function processOrder(order) {
  // A naive synchronous chain couples every dependency's
  // latency and availability to the user-facing request.
  const payment = await paymentGateway.charge(order);
  if (!payment.ok) {
    return { status: "failed", reason: payment.error };
  }
  await inventory.reserve(order.items);
  await notifications.send(order.userId, "confirmed");
  return { status: "confirmed", id: order.id };
}</code></pre>
      <h2>Implementing the Circuit Breaker Pattern</h2>
      <p>The circuit breaker pattern, popularized by Michael Nygard, presents an aspiration from repeatedly trying to execute an operation that's likely to fail. It wraps a fragile function call in an object that monitors for failures. Once the failures reach a certain threshold, the circuit breaker trips, and all further calls to the circuit breaker return with an error immediately, without the wrapped function being called at all.</p>
      <blockquote>This provides a crucial "fail fast" mechanism, allowing the struggling downstream service to recover rather than overwhelming it with retry storms.</blockquote>
      <p>The result is a system that degrades gracefully under load instead of collapsing entirely the moment one dependency wavers.</p>
    `,
    discipline: bySlug("software"),
    category: "Software Architecture",
    author: authors.aris_thorne,
    publishedAt: "2024-10-24",
    readingMinutes: 12,
    likes: 1200,
    tags: ["distributed-systems", "resilience", "system-design"],
    coverImageUrl: "https://picsum.photos/seed/resilience/640/420",
    cover: { icon: "server", tone: "dark" },
  },
  {
    slug: "event-driven-microservices",
    title: "Event-Driven Microservices: Managing Eventual Consistency at Scale",
    excerpt:
      "When migrating to an event-driven architecture, eventual consistency becomes the default state. We explore practical patterns using Kafka and transactional outboxes to ensure data integrity across bounded contexts.",
    contentHtml: `
      <p>When migrating to an event-driven architecture, eventual consistency becomes the default state rather than the exception. This shift demands new patterns for reasoning about correctness.</p>
      <h2>The Transactional Outbox</h2>
      <p>A common pitfall is the dual-write problem: writing to your database and publishing an event as two separate operations. The transactional outbox pattern solves this by writing the event to an outbox table within the same database transaction.</p>
      <pre><code>BEGIN;
  INSERT INTO orders (id, status) VALUES ($1, 'created');
  INSERT INTO outbox (topic, payload) VALUES ('orders', $2);
COMMIT;</code></pre>
      <p>A separate relay process then reads the outbox and publishes to Kafka, guaranteeing at-least-once delivery without distributed transactions.</p>
    `,
    discipline: bySlug("software"),
    category: "Software Architecture",
    author: authors.sarah_jenkins,
    publishedAt: "2024-10-24",
    readingMinutes: 12,
    likes: 980,
    tags: ["kafka", "microservices", "event-sourcing"],
    coverImageUrl: "https://picsum.photos/seed/eventdriven/640/420",
    cover: { icon: "network", tone: "dark" },
  },
  {
    slug: "optimizing-rust-compiler-performance",
    title: "Optimizing Rust Compiler Performance in Large Workspaces",
    excerpt:
      "Long compile times in massive Rust projects can severely impact developer velocity. This article details a systematic approach to profiling build times, utilizing cargo-llvm-lines and restructuring crates.",
    contentHtml: `
      <p>Long compile times in massive Rust projects can severely impact developer velocity. This article details a systematic approach to profiling build times.</p>
      <h2>Measure First</h2>
      <p>Before restructuring anything, capture a timing baseline with <code>cargo build --timings</code>. The generated report reveals which crates dominate the critical path.</p>
      <pre><code>$ cargo build --timings
$ cargo llvm-lines --bin app | head -20</code></pre>
      <p>Generic-heavy crates often generate enormous amounts of monomorphized code. Splitting them along trait boundaries can dramatically reduce codegen time.</p>
    `,
    discipline: bySlug("software"),
    category: "Systems Engineering",
    author: authors.david_chen,
    publishedAt: "2024-10-22",
    readingMinutes: 8,
    likes: 760,
    tags: ["rust", "compilers", "performance"],
    coverImageUrl: "https://picsum.photos/seed/rustcompiler/640/420",
    cover: { icon: "terminal", tone: "dark" },
  },
  {
    slug: "raft-log-replication",
    title: "Optimizing Raft Log Replication for High-Latency Networks",
    excerpt:
      "A deep dive into reducing tail latency in geographically distributed clusters. We explore pipelining techniques and optimistic append operations.",
    contentHtml: `
      <p>A deep dive into reducing tail latency in geographically distributed clusters. We explore pipelining techniques and optimistic append operations, analyzing their impact on consistency guarantees and overall throughput under partition scenarios.</p>
      <h2>Pipelining AppendEntries</h2>
      <p>Vanilla Raft waits for each AppendEntries round-trip before sending the next. Over a 150ms link, that serialization destroys throughput. Pipelining lets the leader keep multiple in-flight batches per follower.</p>
    `,
    discipline: bySlug("software"),
    category: "Distributed Systems",
    author: authors.aris_thorne,
    publishedAt: "2024-10-12",
    readingMinutes: 18,
    likes: 1200,
    tags: ["raft", "consensus", "distributed-systems"],
    coverImageUrl: "https://picsum.photos/seed/raftlog/640/420",
    cover: { icon: "git-branch", tone: "indigo" },
  },
  {
    slug: "go-122-garbage-collector",
    title: "Anatomy of the Go 1.22 Garbage Collector",
    excerpt:
      "Breaking down the recent pacer improvements and memory arena changes. The article relies heavily on trace analysis to demonstrate how the new heuristics affect large-heap microservices.",
    contentHtml: `
      <p>Breaking down the recent pacer improvements and memory arena changes. The article relies heavily on trace analysis to demonstrate how the new heuristics affect large-heap applications typical in modern microservice architectures.</p>
      <h2>The Pacer's New Heuristics</h2>
      <p>The GC pacer decides when to start a collection cycle. Go 1.22 refines its model to reduce overshoot on rapidly growing heaps.</p>
    `,
    discipline: bySlug("software"),
    category: "Runtime Internals",
    author: authors.aris_thorne,
    publishedAt: "2024-09-18",
    readingMinutes: 14,
    likes: 800,
    tags: ["go", "garbage-collection", "performance"],
    coverImageUrl: "https://picsum.photos/seed/gogc/640/420",
    cover: { icon: "recycle", tone: "emerald" },
  },
  {
    slug: "robust-event-sourcing",
    title: "Beyond CRUD: Implementing Robust Event Sourcing in Financial Systems",
    excerpt:
      "Transitioning from state-based to event-based persistence requires a fundamental shift in how we model business domains. In this comprehensive guide, we examine the practical challenges of implementing CQRS and Event Sourcing using Apache Kafka.",
    contentHtml: `
      <p>Transitioning from state-based to event-based persistence requires a fundamental shift in how we model business domains. In this comprehensive guide, we examine the practical challenges of implementing CQRS and Event Sourcing using Apache Kafka, specifically addressing idempotency, schema evolution, and replay strategies for auditing purposes in heavily regulated environments.</p>
      <h2>Modeling Events</h2>
      <pre><code>type Event struct {
    ID        UUID
    Type      string
    Payload   []byte
    Timestamp time.Time
}</code></pre>
      <p>Events are immutable facts. The current state is a left-fold over the event stream, which makes auditing and time-travel debugging first-class capabilities.</p>
    `,
    discipline: bySlug("software"),
    category: "Data Engineering",
    author: authors.aris_thorne,
    publishedAt: "2024-08-05",
    readingMinutes: 12,
    likes: 1100,
    tags: ["event-sourcing", "cqrs", "kafka"],
    cover: { icon: "database", tone: "dark" },
  },
];

export const trendingTopics: Topic[] = [
  { tag: "distributed-systems", count: 142 },
  { tag: "kubernetes", count: 118 },
  { tag: "machine-learning", count: 97 },
  { tag: "go", count: 86 },
  { tag: "system-design", count: 73 },
];

export const topContributors: Author[] = [
  authors.elena_rodriguez,
  authors.marcus_johnson,
  authors.aris_thorne,
];
