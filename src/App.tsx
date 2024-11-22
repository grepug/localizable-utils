import React from "react";
import "./App.css";
import { LocalizableObject, MergingItems } from "./lib/LocalizableObject";
import { Header } from "./components/Header";
import { StringsTable } from "./components/StringsTable";

function App() {
  const [object, setObject] = React.useState<LocalizableObject>();
  const [duplicatedKeys, setDuplicatedKeys] = React.useState<string[]>([]);
  const [deletedKeys, setDeletedKeys] = React.useState<string[]>([]);

  function isDuplicate(key: string) {
    return duplicatedKeys.includes(key);
  }

  const handleImport = () => {
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

        for (const file of Array.from(files)) {
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
  };

  const handleExport = () => {
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
  };

  return (
    <div className="App">
      <Header handleImport={handleImport} handleExport={handleExport} />
      <div>
        <p>keys: {object && Object.keys(object.strings).length}</p>
      </div>
      <StringsTable
        object={object}
        isDuplicate={isDuplicate}
        deletedKeys={deletedKeys}
        setObject={setObject}
        setDeletedKeys={setDeletedKeys}
      />
    </div>
  );
}

export default App;
