import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { monokai } from "@uiw/codemirror-theme-monokai";
import { EditorManager, availableLanguages } from "../utils/EditorManager";
import Dropdowns from "./Dropdowns";
import Cookies from "universal-cookie";
const cookies = new Cookies();

interface CodeEditorProps {
  fileName: string;
  setOutput: (output: string) => void;
  codeExecutionEndPoint: string;
  terminalInput?: string;
}

const CodeEditor = ({
  fileName,
  setOutput,
  codeExecutionEndPoint,
  terminalInput,
}: CodeEditorProps) => {
  var runRequestAllowed = true;
  const [inputScript, setInputScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const onChange = useCallback((value: string) => {
    setInputScript(value);
  }, []);
  const [editorProperties, setEditorProperties] = useReducer(EditorManager, {});
  const changeEditorLanguage = useCallback((targetLanguage: string) => {
    setEditorProperties({ language: targetLanguage });
  }, []);
  // initilalize editor properties
  useEffect(() => {
    changeEditorLanguage(availableLanguages.python);
  }, []);
  // options are for dropdown language selection list.
  // e.g. When button "python" is clicked, the code editor changes language to python
  const options = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(availableLanguages).map(([, languageNameString]) => [
          languageNameString,
          () => changeEditorLanguage(languageNameString),
        ])
      ),
    []
  );

  const runCode = (event: any) => {
    event.preventDefault();
    if (inputScript) {
      if (runRequestAllowed) {
        runRequestAllowed = false;
        setTimeout(() => {
          runRequestAllowed = true;
        }, 5000);
        fetchCodeOutput(inputScript, terminalInput);
      } else {
        alert(
          "You are running codes too quickly! Wait a second before running the second time."
        );
      }
    }
  };
  const fetchCodeOutput = async (
    submittedScript: string,
    terminalInput?: string
  ) => {
    setIsLoading(true);
    const response = await fetch(codeExecutionEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      body: JSON.stringify({
        inputScript: submittedScript,
        fileName: fileName,
        fileExtension: editorProperties.extensions?.name,
        terminalInput: terminalInput,
      }),
    });
    let data = await response.json();
    if (data && data.output) {
      setOutput(data.output);
    } else setOutput(""); // error handling WIP
    setIsLoading(false);
  };
  return (
    <div className="d-flex flex-column gap-2">
      {/* <!-- Code editor header --> */}
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="btn btn-secondary rounded-pill">
          {fileName + editorProperties?.extensions?.name}
        </div>
        <div>{editorProperties?.language}</div>
        <div>
          <Dropdowns header={"Language"} options={options} />
        </div>
      </div>

      {/* <!-- Code editor --> */}
      <div className="border rounded-5 p-4">
        <form onSubmit={runCode}>
          <CodeMirror
            value={inputScript}
            onChange={onChange}
            theme={monokai}
            extensions={[editorProperties.extensions?.languageSupport()]}
          />
          <div className="d-flex flex-row-reverse">
            {/* <!-- submit button can be placed here --> */}
            <button className="btn btn-success mt-3" type="submit">
              {isLoading ? "Loading.." : "Run"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CodeEditor.defaultProps = {
  terminalInput: "",
};

export default CodeEditor;
