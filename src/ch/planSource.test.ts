import {
  parsePlanLink,
  parsePlanRef,
  planFetchUrl,
  planPageUrl,
  planSourceHost,
  planSourceLabel,
  planSourceShortLabel,
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
      "https://dpaste.com/5SZ6H9EHL",
      "https://dpaste.com/5SZ6H9EHL.txt",
      "dpaste.com/5SZ6H9EHL",
      "https://dpaste.com/5SZ6H9EHL/",
      "https://www.dpaste.com/5SZ6H9EHL",
    ])("should understand the dpaste link %s", function (link) {
      expect(parsePlanLink(link)).toEqual({
        service: "dpaste",
        id: "5SZ6H9EHL",
      });
    });

    it.each([
      "https://www.dropbox.com/scl/fi/u4mi1qn2w5i2el2p7uru3/plan.yaml?rlkey=6sos6735olvkgxq1yplucgjhu&st=8dhhnp8y&dl=0",
      "https://www.dropbox.com/scl/fi/u4mi1qn2w5i2el2p7uru3/plan.yaml?rlkey=6sos6735olvkgxq1yplucgjhu&dl=1",
      "dropbox.com/scl/fi/u4mi1qn2w5i2el2p7uru3/plan.yaml?rlkey=6sos6735olvkgxq1yplucgjhu",
      "https://dl.dropboxusercontent.com/scl/fi/u4mi1qn2w5i2el2p7uru3/plan.yaml?rlkey=6sos6735olvkgxq1yplucgjhu",
    ])("should understand the Dropbox link %s", function (link) {
      expect(parsePlanLink(link)).toEqual({
        service: "dropbox",
        id: "u4mi1qn2w5i2el2p7uru3",
        file: "plan.yaml",
        key: "6sos6735olvkgxq1yplucgjhu",
      });
    });

    it("should keep a Dropbox file name with spaces in its encoded form", function () {
      expect(
        parsePlanLink(
          "https://www.dropbox.com/scl/fi/u4mi1qn2w5i2el2p7uru3/My%20Spring%20Plan.yaml?rlkey=6sos6735olvkgxq1yplucgjhu&dl=0",
        ),
      ).toEqual({
        service: "dropbox",
        id: "u4mi1qn2w5i2el2p7uru3",
        file: "My%20Spring%20Plan.yaml",
        key: "6sos6735olvkgxq1yplucgjhu",
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
      ["the dpaste home page", "https://dpaste.com/"],
      ["a dpaste page that is not a paste", "https://dpaste.com/api/v2/"],
      ["a dpaste.org link", "https://dpaste.org/5SZ6H9EHL"],
      [
        "a Dropbox link without its key",
        "https://www.dropbox.com/scl/fi/u4mi1qn2w5i2el2p7uru3/plan.yaml?dl=0",
      ],
      [
        "a Dropbox folder link",
        "https://www.dropbox.com/scl/fo/u4mi1qn2w5i2el2p7uru3/AAAAAAAA?rlkey=6sos6735olvkgxq1yplucgjhu&dl=0",
      ],
      [
        "an old-style Dropbox link",
        "https://www.dropbox.com/s/u4mi1qn2w5i2el2/plan.yaml?dl=0",
      ],
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

    it("should write and read a dpaste ref", function () {
      const source = parsePlanLink("https://dpaste.com/5SZ6H9EHL")!;
      expect(toPlanRef(source)).toBe("dpaste:5SZ6H9EHL");
      expect(parsePlanRef("dpaste:5SZ6H9EHL")).toEqual(source);
    });

    it("should write and read a Dropbox ref", function () {
      const source = parsePlanLink(
        "https://www.dropbox.com/scl/fi/u4mi1qn2w5i2el2p7uru3/My%20Plan.yaml?rlkey=6sos6735olvkgxq1yplucgjhu&dl=0",
      )!;
      const ref =
        "dropbox:u4mi1qn2w5i2el2p7uru3/6sos6735olvkgxq1yplucgjhu/My%20Plan.yaml";
      expect(toPlanRef(source)).toBe(ref);
      expect(parsePlanRef(ref)).toEqual(source);
    });

    it.each([
      "",
      GIST_ID,
      "gist:",
      `gist:${GIST_ID}`,
      `gist:someuser/${GIST_ID}/extra`,
      "gist:someuser/https://example.com/x",
      "pastebin:AbCd1234",
      "dpaste:",
      "dpaste:5SZ6H9EHL/extra",
      "dropbox:u4mi1qn2w5i2el2p7uru3/6sos6735olvkgxq1yplucgjhu",
      "dropbox:u4mi1qn2w5i2el2p7uru3/6sos6735olvkgxq1yplucgjhu/a/b.yaml",
      "dropbox:u4mi1qn2w5i2el2p7uru3/bad key/plan.yaml",
      `https://gist.github.com/someuser/${GIST_ID}`,
    ])("should reject the ref %p", function (ref) {
      expect(parsePlanRef(ref)).toBeUndefined();
    });
  });

  describe("addresses", function () {
    const gist = parsePlanRef(`gist:someuser/${GIST_ID}`)!;
    const paste = parsePlanRef("dpaste:5SZ6H9EHL")!;
    const dropboxFile = parsePlanRef(
      "dropbox:u4mi1qn2w5i2el2p7uru3/6sos6735olvkgxq1yplucgjhu/My%20Plan.yaml",
    )!;

    it("should fetch the latest version of a gist's first file", function () {
      expect(planFetchUrl(gist)).toBe(
        `https://gist.githubusercontent.com/someuser/${GIST_ID}/raw`,
      );
    });

    it("should fetch a dpaste paste as text", function () {
      expect(planFetchUrl(paste)).toBe("https://dpaste.com/5SZ6H9EHL.txt");
    });

    it("should fetch a Dropbox file from the host other sites can read", function () {
      expect(planFetchUrl(dropboxFile)).toBe(
        "https://dl.dropboxusercontent.com/scl/fi/u4mi1qn2w5i2el2p7uru3/My%20Plan.yaml?rlkey=6sos6735olvkgxq1yplucgjhu",
      );
    });

    it("should link to the page where the plan is hosted", function () {
      expect(planPageUrl(gist)).toBe(
        `https://gist.github.com/someuser/${GIST_ID}`,
      );
      expect(planPageUrl(paste)).toBe("https://dpaste.com/5SZ6H9EHL");
      expect(planPageUrl(dropboxFile)).toBe(
        "https://www.dropbox.com/scl/fi/u4mi1qn2w5i2el2p7uru3/My%20Plan.yaml?rlkey=6sos6735olvkgxq1yplucgjhu&dl=0",
      );
    });

    it("should name the source in full and briefly", function () {
      expect(planSourceLabel(gist)).toBe(`gist.github.com/someuser/${GIST_ID}`);
      expect(planSourceShortLabel(gist)).toBe(
        "gist.github.com/someuser/a47c4688…",
      );
      expect(planSourceLabel(paste)).toBe("dpaste.com/5SZ6H9EHL");
      expect(planSourceShortLabel(paste)).toBe("dpaste.com/5SZ6H9EHL");
      expect(planSourceLabel(dropboxFile)).toBe("dropbox.com (My Plan.yaml)");
      expect(planSourceShortLabel(dropboxFile)).toBe("Dropbox (My Plan.yaml)");
    });

    it("should name the site a source is hosted on", function () {
      expect(planSourceHost(gist)).toBe("gist.github.com");
      expect(planSourceHost(paste)).toBe("dpaste.com");
      expect(planSourceHost(dropboxFile)).toBe("dropbox.com");
    });
  });
});
