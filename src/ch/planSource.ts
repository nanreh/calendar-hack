// Where a shared plan lives. Plans can be loaded from the services listed here, which let a web page
// read a file directly (they send an Access-Control-Allow-Origin header).
//
// Pastebin was tried and is not here: it sends that header only for pastes made by paid accounts.

export type PlanSource =
  | { service: "gist"; user: string; id: string }
  | { service: "dpaste"; id: string }
  // file is the file's name as it appears in the link, still URL-encoded; key is the link's rlkey
  | { service: "dropbox"; id: string; file: string; key: string };

const GIST_ID = /^[0-9a-f]{5,40}$/;
const GITHUB_USER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const DPASTE_ID = /^[A-Za-z0-9]{6,12}$/;
const DROPBOX_ID = /^[A-Za-z0-9]{8,40}$/;
const DROPBOX_KEY = /^[A-Za-z0-9]{8,40}$/;
// one path segment, as found in a URL: no slashes, no query or fragment, no spaces
const DROPBOX_FILE = /^[^/?#\s]{1,200}$/;

function gist(
  user: string | undefined,
  id: string | undefined,
): PlanSource | undefined {
  return user && id && GITHUB_USER.test(user) && GIST_ID.test(id)
    ? { service: "gist", user, id }
    : undefined;
}

function dpaste(id: string | undefined): PlanSource | undefined {
  return id && DPASTE_ID.test(id) ? { service: "dpaste", id } : undefined;
}

function dropbox(
  id: string | undefined,
  file: string | undefined,
  key: string | null | undefined,
): PlanSource | undefined {
  return id &&
    file &&
    key &&
    DROPBOX_ID.test(id) &&
    DROPBOX_FILE.test(file) &&
    DROPBOX_KEY.test(key)
    ? { service: "dropbox", id, file, key }
    : undefined;
}

// Understand a link the way a person would copy it: from the address bar, a "copy link" button or
// the "raw" view, with or without the https:// in front.
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

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const path = url.pathname.split("/").filter((part) => part !== "");

  if (host === "gist.github.com" || host === "gist.githubusercontent.com") {
    // gist.github.com/<user>/<id>, optionally followed by a revision or /raw/...
    return gist(path[0], path[1]);
  }

  if (host === "dpaste.com") {
    // dpaste.com/<id> or dpaste.com/<id>.txt
    return path.length === 1
      ? dpaste(path[0].replace(/\.txt$/, ""))
      : undefined;
  }

  if (host === "dropbox.com" || host === "dl.dropboxusercontent.com") {
    // dropbox.com/scl/fi/<id>/<file name>?rlkey=<key>. Folder links (scl/fo) are not files.
    return path.length === 4 && path[0] === "scl" && path[1] === "fi"
      ? dropbox(path[2], path[3], url.searchParams.get("rlkey"))
      : undefined;
  }

  return undefined;
}

// The short form used in this app's own URLs:
//   gist:<user>/<id>    dpaste:<id>    dropbox:<id>/<key>/<file name>
export function toPlanRef(source: PlanSource): string {
  switch (source.service) {
    case "gist":
      return `gist:${source.user}/${source.id}`;
    case "dpaste":
      return `dpaste:${source.id}`;
    case "dropbox":
      return `dropbox:${source.id}/${source.key}/${source.file}`;
  }
}

export function parsePlanRef(ref: string): PlanSource | undefined {
  const separator = ref.indexOf(":");
  if (separator < 0) return undefined;
  const service = ref.slice(0, separator);
  const parts = ref.slice(separator + 1).split("/");

  if (service === "gist") {
    return parts.length === 2 ? gist(parts[0], parts[1]) : undefined;
  }
  if (service === "dpaste") {
    return parts.length === 1 ? dpaste(parts[0]) : undefined;
  }
  if (service === "dropbox") {
    return parts.length === 3
      ? dropbox(parts[0], parts[2], parts[1])
      : undefined;
  }
  return undefined;
}

// The address the plan's text is fetched from.
export function planFetchUrl(source: PlanSource): string {
  switch (source.service) {
    case "gist":
      // the latest revision of the gist's first file
      return `https://gist.githubusercontent.com/${source.user}/${source.id}/raw`;
    case "dpaste":
      return `https://dpaste.com/${source.id}.txt`;
    case "dropbox":
      // Dropbox's share page and its dl=1 redirect cannot be read by another site; this host can.
      return `https://dl.dropboxusercontent.com/scl/fi/${source.id}/${source.file}?rlkey=${source.key}`;
  }
}

// The page a person can visit to see the plan where it is hosted.
export function planPageUrl(source: PlanSource): string {
  switch (source.service) {
    case "gist":
      return `https://gist.github.com/${source.user}/${source.id}`;
    case "dpaste":
      return `https://dpaste.com/${source.id}`;
    case "dropbox":
      return `https://www.dropbox.com/scl/fi/${source.id}/${source.file}?rlkey=${source.key}&dl=0`;
  }
}

function dropboxFileName(file: string): string {
  try {
    return decodeURIComponent(file);
  } catch {
    return file;
  }
}

// The source in full, for messages, e.g. "gist.github.com/someuser/0fddae86708d…".
export function planSourceLabel(source: PlanSource): string {
  switch (source.service) {
    case "gist":
      return `gist.github.com/${source.user}/${source.id}`;
    case "dpaste":
      return `dpaste.com/${source.id}`;
    case "dropbox":
      return `dropbox.com (${dropboxFileName(source.file)})`;
  }
}

// The source briefly, for showing next to a plan. A gist id is 32 characters, too long to show.
export function planSourceShortLabel(source: PlanSource): string {
  switch (source.service) {
    case "gist":
      return `gist.github.com/${source.user}/${source.id.slice(0, 8)}…`;
    case "dpaste":
      return `dpaste.com/${source.id}`;
    case "dropbox":
      return `Dropbox (${dropboxFileName(source.file)})`;
  }
}

// The site a source is hosted on, e.g. "dpaste.com".
export function planSourceHost(source: PlanSource): string {
  switch (source.service) {
    case "gist":
      return "gist.github.com";
    case "dpaste":
      return "dpaste.com";
    case "dropbox":
      return "dropbox.com";
  }
}
