import React, { useRef } from "react";
import "./App.css";
import {
  localeAllCases,
  LocalizableObject,
  MergingItems,
} from "./lib/LocalizableObject";

function App() {
  const [object, setObject] = React.useState<LocalizableObject>();
  const [duplicatedKeys, setDuplicatedKeys] = React.useState<string[]>([]);
  const [deletedKeys, setDeletedKeys] = React.useState<string[]>([]);

  function isDuplicate(key: string) {
    return duplicatedKeys.includes(key);
  }

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <button
          style={{ marginRight: "32px" }}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".xcstrings";
            input.multiple = true;
            input.onchange = async (event) => {
              const files = (event.target as HTMLInputElement)?.files;

              const merging = new MergingItems(
                object ?? { sourceLanguage: "en", strings: {} }
              );

              if (files) {
                let mergedObject = object;
                let allDuplicatedKeys: string[] = [];

                for (const file of files) {
                  const text = await file.text();
                  const parsedObject: LocalizableObject = JSON.parse(text);

                  merging.mergeItem(parsedObject);

                  if (mergedObject) {
                    mergedObject = merging.object;
                    allDuplicatedKeys = [
                      ...allDuplicatedKeys,
                      ...merging.duplicatedKeys,
                    ];
                  } else {
                    mergedObject = parsedObject;
                  }
                }

                setObject(mergedObject);
                setDuplicatedKeys(allDuplicatedKeys);
              }
            };
            input.click();
          }}
        >
          Import .xcstrings Files
        </button>
        <button
          onClick={() => {
            if (!object) {
              return;
            }

            const a = document.createElement("a");
            const filteredObject = {
              ...object,
              version: "1",
              strings: Object.keys(object?.strings || {}).reduce((acc, key) => {
                if (!deletedKeys.includes(key)) {
                  acc[key] = object.strings[key];
                }
                return acc;
              }, {} as LocalizableObject["strings"]),
            };
            const file = new Blob([JSON.stringify(filteredObject)], {
              type: "application/json",
            });
            a.href = URL.createObjectURL(file);
            a.download = "new_localizable.xcstrings";
            a.click();
          }}
        >
          Export .xcstrings File
        </button>
      </div>
      <div>
        <p>keys: {object && Object.keys(object.strings).length}</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          textAlign: "left",
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
                .map((key) => {
                  const item = object.strings[key];
                  return (
                    <tr
                      key={key}
                      style={{
                        color: isDuplicate(key) ? "red" : "black",
                        border: "1px solid black",
                        textDecoration: deletedKeys.includes(key)
                          ? "line-through"
                          : "none",
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
                            let newKey = prompt("key", key);

                            if (newKey) {
                              const newObject = { ...object };
                              if (!newObject.strings[newKey]) {
                                newObject.strings[newKey] =
                                  newObject.strings[key];
                                delete newObject.strings[key];
                                setObject(newObject);
                              } else {
                                alert(
                                  "Duplicate key detected. Please choose a different key."
                                );
                              }
                            }
                          }}
                        >
                          {key}
                        </span>
                        <button
                          style={{ marginLeft: "8px" }}
                          onClick={() => {
                            const newObject = { ...object };
                            if (deletedKeys.includes(key)) {
                              setDeletedKeys((prev) =>
                                prev.filter((item) => item !== key)
                              );
                            } else {
                              setDeletedKeys((prev) => [...prev, key]);
                            }
                            setObject(newObject);
                          }}
                        >
                          {deletedKeys.includes(key) ? "Undo" : "Delete"}
                        </button>
                      </td>
                      {localeAllCases().map((locale) => {
                        return (
                          <td
                            key={locale}
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                            // onClick={() => {
                            //   const newValue = prompt(
                            //     `Enter ${locale} value`,
                            //     item.localizations[locale].stringUnit.value
                            //   );

                            //   if (newValue) {
                            //     const newObject = { ...object };
                            //     newObject.strings[key].localizations[
                            //       locale
                            //     ].stringUnit.value = newValue;
                            //     setObject(newObject);
                            //   }
                            // }}
                          >
                            {item.localizations[locale].stringUnit.value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
