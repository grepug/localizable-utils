export interface LocalizableObject {
  sourceLanguage: string;
  strings: Record<string, Item>;
}

type Locale = "en" | "zh-Hans" | "zh-Hant" | "ja";

export function localeAllCases(): Locale[] {
  return ["en", "zh-Hans", "zh-Hant", "ja"];
}

interface StringUnit {
  state: string;
  value: string;
}

interface LocaleObject {
  stringUnit: StringUnit;
}

interface Item {
  localizations: Record<Locale, LocaleObject>;
}

export class MergingItems {
  object: LocalizableObject = {
    sourceLanguage: "en",
    strings: {},
  };

  duplicatedKeys: string[] = [];

  constructor(object: LocalizableObject) {
    this.object = object;
  }

  mergeItem(object: LocalizableObject) {
    const dup = "_#_";

    Object.keys(object.strings).forEach((key) => {
      if (this.object.strings[key]) {
        let num = 1;
        let newKey = `${key}${dup}${num}`;
        while (this.object.strings[newKey]) {
          num++;
          newKey = `${key}${dup}${num}`;
        }
        this.object.strings[newKey] = object.strings[key];
        this.duplicatedKeys.push(key);
      } else {
        this.object.strings[key] = object.strings[key];
      }
    });

    return this;
  }
}
