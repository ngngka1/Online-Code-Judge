import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { ProblemDataInterface } from "./ProblemDataManager";
import { MutableRefObject } from "react";

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

// *Note: this interface's properties names should match the json body backend server expects
export interface CodejudgeRunCodeRequestBody {
  inputScript: string,
  fileName: string,
  fileExtension: string,
  problemTitle: string,
}

export interface IdeRunCodeRequestBody {
  inputScript: string,
  fileName: string,
  fileExtension: string,
  terminalInput: string,
}

const convertCamelCase = (s: string) => {
  if (s.length <= 1 || s.indexOf(" ") === -1) return s;
  s = s.toLowerCase();
  do {
    let spaceIndex = s.indexOf(" ");
    if (spaceIndex === s.length) return s.slice(0, s.length - 1);
    let partAfter =
      s.charAt(spaceIndex + 1).toUpperCase() +
      s.slice(spaceIndex + 2, s.length);
    s = s.slice(0, spaceIndex) + partAfter;
  } while (s.indexOf(" ") !== -1);
  return s;
};
// Note: each property in availableLanguages points to the language's actual name
export const availableLanguages = {
  python: "python",
  cpp: "c++",
};

export const declareFunctionString = (functionName: string) => {
  // testing
  return "def " + convertCamelCase(functionName) + "():\n  ";
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

export const fetchCodeOutput = async (
  codeExecutionEndPoint: string,
  requestBody: CodejudgeRunCodeRequestBody | IdeRunCodeRequestBody,
  setStateCallback: (output: string) => void,
) => {
  const response = await fetch(codeExecutionEndPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: JSON.stringify(requestBody),
  });
  let data = await response.json();
  console.table(data);
  console.log(response?.status);
  if (data && data?.output) {
    setStateCallback(data?.output);
    return response.status;
  } else setStateCallback("No output from end point"); // error handling WIP
};
