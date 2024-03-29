import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";

interface dispatchActionObject {
  language: string;
  extensions?: string;
}

interface EditorProperties {
  language?: string;
  extensions?: { name: string; languageSupport: () => any };
  // Correct declaration should be: languageSupport: () => LanguageSupport;
  // However, I could not seem to access the type "LanguageSupport" so I just put "any" here
}

// Note: each property in availableLanguages points to the language's actual name
export const availableLanguages = {
  python: "python",
  cpp: "c++",
};

export const EditorManager = (
  editorPropertiesState: EditorProperties,
  action: dispatchActionObject
) => {
  switch (action.language) {
    case availableLanguages.python:
      return {
        language: availableLanguages.python,
        extensions: { name: ".py", languageSupport: python },
      };
    case availableLanguages.cpp:
      return {
        language: availableLanguages.cpp,
        extensions: { name: ".cpp", languageSupport: cpp },
      };
    default:
      return editorPropertiesState;
  }
};
