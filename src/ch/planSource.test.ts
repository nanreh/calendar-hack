import {
  parsePlanLink,
  parsePlanRef,
  planFetchUrl,
  planPageUrl,
  planSourceLabel,
  toPlanRef,
} from "./planSource";

const GIST_ID = "a47c4688520b1cf0e4e6a1f0f5f5c3d2";

describe("Plan source", function () {
  describe("parsePlanLink", function () {
    it.each([
      `https://gist.github.com/someuser/${GIST_ID}`,
      `gist.github.com/someuser/${GIST_ID}`,
      `https://gist.github.com/someuser/${GIST_ID}/`,
      `https://gist.github.com/someuser/${GIST_ID}#file-plan-yaml`,
      `https://gist.github.com/someuser/${GIST_ID}/0123456789abcdef0123456789abcdef01234567`,
      `  https://gist.github.com/someuser/${GIST_ID}  `,
      `HTTPS://GIST.GITHUB.COM/someuser/${GIST_ID}`,
      `https://gist.github.com/someuser/${GIST_ID}?permalink_comment_id=1`,
      `https://gist.githubusercontent.com/someuser/${GIST_ID}/raw`,
      `https://gist.githubusercontent.com/someuser/${GIST_ID}/raw/0123456789abcdef0123456789abcdef01234567/plan.yaml`,
    ])("should understand the Gist link %s", function (link) {
      expect(parsePlanLink(link)).toEqual({
        service: "gist",
        user: "someuser",
        id: GIST_ID,
      });
    });

    it.each([
      ["an empty string", ""],
      ["text that is not a link", "my marathon plan"],
      ["another site", `https://example.com/someuser/${GIST_ID}`],
      [
        "a site that only looks like Gist",
        `https://gist.github.com.evil.example/someuser/${GIST_ID}`,
      ],
      ["a Pastebin link", "https://pastebin.com/AbCd1234"],
      ["the Gist home page", "https://gist.github.com/"],
      ["a Gist link with no id", "https://gist.github.com/someuser"],
      [
        "a Gist link with a malformed id",
        "https://gist.github.com/someuser/not-a-gist-id",
      ],
      ["a Gist link with no user", `https://gist.github.com/${GIST_ID}`],
      ["a GitHub repository", `https://github.com/someuser/${GIST_ID}`],
    ])("should reject %s", function (_name, link) {
      expect(parsePlanLink(link)).toBeUndefined();
    });
  });

  describe("plan refs", function () {
    it("should write and read a Gist ref", function () {
      const source = parsePlanLink(
        `https://gist.github.com/someuser/${GIST_ID}`,
      )!;
      expect(toPlanRef(source)).toBe(`gist:someuser/${GIST_ID}`);
      expect(parsePlanRef(`gist:someuser/${GIST_ID}`)).toEqual(source);
    });

    it.each([
      "",
      GIST_ID,
      "gist:",
      `gist:${GIST_ID}`,
      `gist:someuser/${GIST_ID}/extra`,
      "gist:someuser/https://example.com/x",
      "pastebin:AbCd1234",
      `https://gist.github.com/someuser/${GIST_ID}`,
    ])("should reject the ref %p", function (ref) {
      expect(parsePlanRef(ref)).toBeUndefined();
    });
  });

  describe("addresses", function () {
    const gist = parsePlanRef(`gist:someuser/${GIST_ID}`)!;

    it("should fetch the latest version of a gist's first file", function () {
      expect(planFetchUrl(gist)).toBe(
        `https://gist.githubusercontent.com/someuser/${GIST_ID}/raw`,
      );
    });

    it("should link to the page where the plan is hosted", function () {
      expect(planPageUrl(gist)).toBe(
        `https://gist.github.com/someuser/${GIST_ID}`,
      );
    });

    it("should describe the source briefly", function () {
      expect(planSourceLabel(gist)).toBe(`gist.github.com/someuser/${GIST_ID}`);
    });
  });
});
