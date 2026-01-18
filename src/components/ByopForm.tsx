import { useRef } from "react";

interface Props {
  onFileLoad: (content: string) => void;
  error: string | null;
  loading: boolean;
  planLoaded: boolean;
}

const ByopForm = ({ onFileLoad, error, loading, planLoaded }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            <p>Plans are defined as YAML files. You can look at the <a href="/hacks/calendarhack/plans/yaml/">plans currently hosted here</a> to see what the format looks like (it's simple!). Make your own plan from scratch or modify an existing plan as you see fit.</p>
            <br />
            <p>Load your custom plan and you can view it in the calendar view before exporting it as an iCal or CSV file.</p>
            <br />
            <p>This works locally, your plan never leaves your browser. You can bookmark the result and come back to it later.</p>
          </div>
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
            {loading ? "Loading..." : "Load Plan File"}
          </button>
        </>
      )}
      {error && <div className="byop-error">{error}</div>}
    </div>
  );
};

export default ByopForm;
