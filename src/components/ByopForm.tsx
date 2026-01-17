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
            {loading ? "Loading..." : "Upload Plan File"}
          </button>
        </>
      )}
      {error && <div className="byop-error">{error}</div>}
    </div>
  );
};

export default ByopForm;
