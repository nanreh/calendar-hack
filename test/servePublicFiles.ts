import { existsSync, readFileSync } from "fs";

// Replace fetch() with one that answers from the files in public/, the way the web server would.
export function servePublicFiles() {
  const fetchMock = jest.fn(async (url: RequestInfo | URL) => {
    const path = "public/" + String(url).replace("/hacks/calendarhack/", "");
    if (!existsSync(path)) {
      return { ok: false, status: 404 } as Response;
    }
    const body = readFileSync(path, "utf8");
    return {
      ok: true,
      status: 200,
      text: async () => body,
      json: async () => JSON.parse(body),
    } as Response;
  });
  globalThis.fetch = fetchMock;
  return fetchMock;
}
