import type { Event } from "@/db/schema";

export interface Recipient {
  ip: string;
  firstSeen: Date;
  lastSeen: Date;
  opens: number;
  isOriginal: boolean;
}

// Groups events by IP and identifies likely forwards.
// The "original recipient" is whichever IP was seen first. Every subsequent
// distinct IP is treated as a forward, ordered by first-seen time.
export function detectForwards(events: Event[]): Recipient[] {
  if (events.length === 0) return [];

  // Ignore events with no IP (can't attribute)
  const withIp = events.filter((e): e is Event & { ip: string } => !!e.ip);

  const byIp = new Map<string, { events: Event[]; firstSeen: Date }>();
  for (const event of withIp) {
    const existing = byIp.get(event.ip);
    if (existing) {
      existing.events.push(event);
      if (event.createdAt < existing.firstSeen) {
        existing.firstSeen = event.createdAt;
      }
    } else {
      byIp.set(event.ip, {
        events: [event],
        firstSeen: event.createdAt,
      });
    }
  }

  // Sort IPs by first-seen ascending — the earliest is the original recipient
  const sorted = Array.from(byIp.entries()).sort(
    (a, b) => a[1].firstSeen.getTime() - b[1].firstSeen.getTime(),
  );

  return sorted.map(([ip, data], index) => {
    const times = data.events
      .map((e) => e.createdAt.getTime())
      .sort((a, b) => a - b);
    return {
      ip,
      firstSeen: new Date(times[0]),
      lastSeen: new Date(times[times.length - 1]),
      opens: data.events.length,
      isOriginal: index === 0,
    };
  });
}

export function countForwards(recipients: Recipient[]): number {
  return recipients.filter((r) => !r.isOriginal).length;
}
