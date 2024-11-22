export function Header({
  handleImport,
  handleExport,
}: {
  handleImport: () => void;
  handleExport: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <button style={{ marginRight: "32px" }} onClick={handleImport}>
        Import .xcstrings Files
      </button>
      <button onClick={handleExport}>Export .xcstrings File</button>
    </div>
  );
}
