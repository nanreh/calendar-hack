import { useRef, useState } from "react";
import type { PlanSource } from "../ch/planSource";
import { planPageUrl, planSourceShortLabel } from "../ch/planSource";
import { Config, SAMPLE_PLAN_LINKS } from "../ch/config";

interface Props {
  onFileLoad: (content: string) => void;
  onLinkLoad: (link: string) => void;
  onChangePlan: () => void;
  error: string | null;
  loading: boolean;
  planLoaded: boolean;
  // details of the loaded plan
  planName: string | undefined;
  // where the loaded plan came from, null for a plan loaded from a file
  source: PlanSource | null;
}

const ByopForm = ({
  onFileLoad,
  onLinkLoad,
  onChangePlan,
  error,
  loading,
  planLoaded,
  planName,
  source,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  // shown for copying by hand when the browser will not let the page write to the clipboard
  const [linkToCopy, setLinkToCopy] = useState<string | null>(null);

  const handleLinkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (link.trim() !== "") {
      onLinkLoad(link);
    }
  };

  // A sample only fills in the field. Loading it is left to the Load button.
  const handleSampleClick = (sampleLink: string) => {
    setLink(sampleLink);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onFileLoad(text);
      };
      reader.onerror = () => {
        console.error("Error reading file");
      };
      reader.readAsText(file);
    }
    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // The address bar's query already describes the plan and how it is laid out. The path is written
  // out in full so the link works however this page was reached.
  const handleShare = async () => {
    const url =
      window.location.origin + Config.basePath + window.location.search;
    try {
      await navigator.clipboard.writeText(url);
      setLinkToCopy(null);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setLinkToCopy(url);
    }
  };

  const handleChangePlan = () => {
    setLink("");
    setCopied(false);
    setLinkToCopy(null);
    onChangePlan();
  };

  return (
    <div className="byop-form">
      {planLoaded ? (
        <div className="byop-loaded">
          <h2 className="byop-plan-name">{planName || "Your plan"}</h2>
          <p className="byop-source">
            {source ? (
              <>
                Loaded from{" "}
                <a href={planPageUrl(source)} target="_blank" rel="noreferrer">
                  {planSourceShortLabel(source)}
                </a>
              </>
            ) : (
              "Loaded from a file on this device"
            )}
          </p>
          <div className="byop-actions">
            <button
              type="button"
              className="app-button"
              onClick={handleShare}
              disabled={!source}
            >
              {copied ? "Link copied" : "Share"}
            </button>
            <button
              type="button"
              className="app-button"
              onClick={handleChangePlan}
            >
              Load a different plan
            </button>
          </div>
          {!source && (
            <p className="byop-hint">
              To share this plan, put it on GitHub Gist, dpaste.com or Dropbox
              and load it from its link.
            </p>
          )}
          {linkToCopy && (
            <div className="byop-copy">
              <label htmlFor="byop-share-link">Copy this link to share:</label>
              <input
                id="byop-share-link"
                className="text-input"
                type="text"
                readOnly
                value={linkToCopy}
                onFocus={(e) => e.target.select()}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="byop-load">
            <h1>Bring Your Own Plan</h1>
            <form className="byop-load-option" onSubmit={handleLinkSubmit}>
              <label htmlFor="byop-link">From a link</label>
              <div className="byop-link-row">
                <input
                  id="byop-link"
                  className="text-input"
                  type="text"
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="Paste a link to your plan"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="app-button"
                  disabled={loading || link.trim() === ""}
                >
                  {loading ? "Loading..." : "Load"}
                </button>
              </div>
              <p className="byop-hint">
                Works with links from GitHub Gist, dpaste.com and Dropbox.
              </p>
              <p className="byop-hint byop-samples">
                Fill in a sample link from:
                {SAMPLE_PLAN_LINKS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    className="link-button"
                    onClick={() => handleSampleClick(sample.link)}
                    disabled={loading}
                  >
                    {sample.label}
                  </button>
                ))}
              </p>
            </form>
            <div className="byop-load-option">
              <span className="byop-load-label">
                From a file on this device
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".yaml,.yml"
                onChange={handleFileChange}
                style={{ display: "none" }}
                aria-label="Plan file"
              />
              <button
                type="button"
                className="app-button"
                onClick={handleUploadClick}
                disabled={loading}
              >
                Load Plan File
              </button>
            </div>
          </div>
          {error && <div className="byop-error">{error}</div>}
          <div className="byop-description">
            <h3>How it works</h3>
            <ol>
              <li>
                Write your own plan file from scratch, or adapt an existing
                plan.
              </li>
              <li>Load it here from a link or from a file.</li>
              <li>
                Fit it on the calendar as you like, then export it as an iCal or
                CSV file.
              </li>
            </ol>
            <h3>Sharing a plan</h3>
            <p>
              Put your plan file somewhere this page can read it, load it here
              from its link, then press Share to copy a link that opens the plan
              for anyone. Three places work:
            </p>
            <ul>
              <li>
                <a href="https://dpaste.com/" target="_blank" rel="noreferrer">
                  dpaste.com
                </a>
                : no account needed. Pastes expire, after a year at most.
              </li>
              <li>
                <a
                  href="https://gist.github.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub Gist
                </a>
                : needs a free GitHub account. You can edit the plan later and
                the link stays the same.
              </li>
              <li>
                <a
                  href="https://www.dropbox.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dropbox
                </a>
                : use "Copy link" on the file, with access set to anyone with
                the link.
              </li>
            </ul>
            <h3>Privacy</h3>
            <p>
              A file you load stays on your device. A plan loaded from a link is
              fetched by your browser directly from the site that hosts it.
            </p>
            <h3>Plan file format</h3>
            <p>
              Plans are defined as{" "}
              <a href="https://en.wikipedia.org/wiki/YAML">YAML</a> files. See
              the{" "}
              <a
                href="https://github.com/nanreh/calendar-hack/tree/main/public/plans/yaml"
                target="_blank"
                rel="noreferrer"
              >
                plans currently hosted here
              </a>{" "}
              to understand what the format looks like (hint: it's pretty
              simple!). Download the{" "}
              <a href="/hacks/calendarhack/sampleplan.yaml">sample plan</a> and
              check out the comments in it. Load it here to see how this works.
              There's a{" "}
              <a href="/hacks/calendarhack/schema/plan-schema-v1.json">
                JSON schema
              </a>{" "}
              describing the format in detail.
            </p>
          </div>
        </>
      )}
      {planLoaded && error && <div className="byop-error">{error}</div>}
    </div>
  );
};

export default ByopForm;
