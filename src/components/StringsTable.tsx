import { LocalizableObject } from "../lib/LocalizableObject";
import { StringsTableRow } from "./StringsTableRow";

export function StringsTable({
  object,
  isDuplicate,
  deletedKeys,
  setObject,
  setDeletedKeys,
}: {
  object: LocalizableObject | undefined;
  isDuplicate: (key: string) => boolean;
  deletedKeys: string[];
  setObject: React.Dispatch<
    React.SetStateAction<LocalizableObject | undefined>
  >;
  setDeletedKeys: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div
      style={{
        padding: "16px",
      }}
    >
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>key</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>en</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              zh-hans
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              zh-hant
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>ja</th>
          </tr>
        </thead>
        <tbody>
          {object &&
            Object.keys(object.strings)
              .sort((a, b) => a.localeCompare(b))
              .map((key) => (
                <StringsTableRow
                  key={key}
                  itemKey={key}
                  item={object.strings[key]}
                  isDuplicate={isDuplicate(key)}
                  deletedKeys={deletedKeys}
                  object={object}
                  setObject={setObject}
                  setDeletedKeys={setDeletedKeys}
                />
              ))}
        </tbody>
      </table>
    </div>
  );
}
