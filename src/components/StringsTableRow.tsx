import { localeAllCases, LocalizableObject } from "../lib/LocalizableObject";

export function StringsTableRow({
  itemKey,
  item,
  isDuplicate,
  deletedKeys,
  object,
  setObject,
  setDeletedKeys,
}: {
  itemKey: string;
  item: LocalizableObject["strings"][string];
  isDuplicate: boolean;
  deletedKeys: string[];
  object: LocalizableObject;
  setObject: React.Dispatch<
    React.SetStateAction<LocalizableObject | undefined>
  >;
  setDeletedKeys: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <tr
      style={{
        color: isDuplicate ? "red" : "black",
        border: "1px solid black",
        textDecoration: deletedKeys.includes(itemKey) ? "line-through" : "none",
      }}
    >
      <td
        style={{
          border: "1px solid black",
          padding: "8px",
          cursor: "pointer",
        }}
      >
        <span
          onClick={() => {
            let newKey = prompt("key", itemKey);

            if (newKey) {
              const newObject = { ...object };
              if (!newObject.strings[newKey]) {
                newObject.strings[newKey] = newObject.strings[itemKey];
                delete newObject.strings[itemKey];
                setObject(newObject);
              } else {
                alert("Duplicate key detected. Please choose a different key.");
              }
            }
          }}
        >
          {itemKey}
        </span>
        <button
          style={{ marginLeft: "8px" }}
          onClick={() => {
            if (deletedKeys.includes(itemKey)) {
              setDeletedKeys((prev) => prev.filter((item) => item !== itemKey));
            } else {
              setDeletedKeys((prev) => [...prev, itemKey]);
            }
          }}
        >
          {deletedKeys.includes(itemKey) ? "Undo" : "Delete"}
        </button>
      </td>
      {localeAllCases().map((locale) => (
        <td
          key={locale}
          style={{
            border: "1px solid black",
            padding: "8px",
          }}
        >
          {item.localizations[locale].stringUnit.value}
        </td>
      ))}
    </tr>
  );
}
