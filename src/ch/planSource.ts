// Where a shared plan lives. Plans can be loaded from the services listed here, which let a web page
// read a file directly (they send an Access-Control-Allow-Origin header).
//
// Only GitHub Gist qualifies today. Pastebin was tried and sends that header only for pastes made by
// paid accounts.

export type PlanSource = { service: "gist"; user: string; id: string };

const GIST_ID = /^[0-9a-f]{5,40}$/;
const GITHUB_USER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

function gist(
  user: string | undefined,
  id: string | undefined,
): PlanSource | undefined {
  return user && id && GITHUB_USER.test(user) && GIST_ID.test(id)
    ? { service: "gist", user, id }
    : undefined;
}

// Understand a link the way a person would copy it: from the address bar or from the "raw" view,
// with or without the https:// in front.
export function parsePlanLink(link: string): PlanSource | undefined {
  const trimmed = link.trim();
  if (trimmed === "") return undefined;

  let url: URL;
  try {
    url = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
    );
  } catch {
    return undefined;
  }

  const host = url.hostname.toLowerCase();
  const path = url.pathname.split("/").filter((part) => part !== "");

  if (host === "gist.github.com" || host === "gist.githubusercontent.com") {
    // gist.github.com/<user>/<id>, optionally followed by a revision or /raw/...
    return gist(path[0], path[1]);
  }

  return undefined;
}

// The short form used in this app's own URLs: "gist:<user>/<id>".
export function toPlanRef(source: PlanSource): string {
  return `gist:${source.user}/${source.id}`;
}

export function parsePlanRef(ref: string): PlanSource | undefined {
  const separator = ref.indexOf(":");
  if (separator < 0) return undefined;
  const service = ref.slice(0, separator);
  const rest = ref.slice(separator + 1);

  if (service === "gist") {
    const parts = rest.split("/");
    return parts.length === 2 ? gist(parts[0], parts[1]) : undefined;
  }
  return undefined;
}

// The address the plan's text is fetched from: the latest revision of the gist's first file.
export function planFetchUrl(source: PlanSource): string {
  return `https://gist.githubusercontent.com/${source.user}/${source.id}/raw`;
}

// The page a person can visit to see the plan where it is hosted.
export function planPageUrl(source: PlanSource): string {
  return `https://gist.github.com/${source.user}/${source.id}`;
}

// A short human-readable name for the source, e.g. "gist.github.com/someuser/0fdd…".
export function planSourceLabel(source: PlanSource): string {
  return planPageUrl(source).replace("https://", "");
}
