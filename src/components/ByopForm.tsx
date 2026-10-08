import { useRef, useState } from "react";

interface Props {
  onFileLoad: (content: string) => void;
  onLinkLoad: (link: string) => void;
  error: string | null;
  loading: boolean;
  planLoaded: boolean;
}

const ByopForm = ({
  onFileLoad,
  onLinkLoad,
  error,
  loading,
  planLoaded,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");

  const handleLinkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (link.trim() !== "") {
      onLinkLoad(link);
    }
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

  return (
    <div className="byop-form">
      {!planLoaded && (
        <>
          <div className="byop-description">
            <h1>Bring Your Own Plan</h1>
            <ol>
              <li>
                Make your own plan file from scratch or modify an existing plan.
              </li>
              <li>Load it here.</li>
              <li>
                Fit it on the calendar as you like and then export it as an iCal
                or CSV file.
              </li>
            </ol>
            <p>
              This works locally, your plan never leaves your browser. You can
              bookmark the result and come back to it later.
            </p>
            <h3>Plan File Format</h3>
            <p>
              Plans are defined as{" "}
              <a href="https://en.wikipedia.org/wiki/YAML">YAML</a> files. See
              the{" "}
              <a href="/hacks/calendarhack/plans/yaml/">
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
          <div className="byop-load">
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
                  placeholder="https://gist.github.com/you/…"
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
              <p className="byop-hint">Works with GitHub Gist links.</p>
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
        </>
      )}
      {error && <div className="byop-error">{error}</div>}
    </div>
  );
};

export default ByopForm;
