import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import CodeMirror from "@uiw/react-codemirror";
import { monokai } from "@uiw/codemirror-theme-monokai";
import {
  EditorManager,
  availableLanguages,
  declareFunctionString,
  fetchCodeOutput,
  CodejudgeRunCodeRequestBody,
  IdeRunCodeRequestBody,
} from "../utils/EditorManager";
import Dropdowns from "./Dropdowns";
import {
  codejudgeRunCodeEndPoint,
  ideRunCodeEndPoint,
} from "../contexts/BackendContext";

type CodeExecutionEndPoint =
  | typeof ideRunCodeEndPoint
  | typeof codejudgeRunCodeEndPoint;

interface CodeEditorProps {
  fileName: string;
  setOutput: (output: string) => void;
  codeExecutionEndPoint: CodeExecutionEndPoint;
  setSubmittedTerminalInput?: (input: string) => void;
  submittedTerminalInput?: string;
  problemTitle?: string;
}

const CodeEditor = ({
  fileName,
  setOutput,
  codeExecutionEndPoint,
  submittedTerminalInput,
  setSubmittedTerminalInput,
  problemTitle,
}: CodeEditorProps) => {
  const runRequestAllowedRef = useRef(true);
  const isPartialResponseRef = useRef(false); // if true, it means that the backend server is expecting more information from the end user to obtain the full response
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

  // This side effect sends fetch code output request again in case there is new input
  useEffect(() => {
    if (submittedTerminalInput && isPartialResponseRef.current) {
      runRequestAllowedRef.current = true;
      runCode(null);
    }
  }, [submittedTerminalInput]);
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

  const runCode = (event: React.FormEvent<HTMLFormElement> | null) => {
    // 'event' has two type because this function may be called somewhere other than submitting form
    if (event) {
      // event is not null only when the "RUN" button is clicked
      event.preventDefault();
      if (submittedTerminalInput && setSubmittedTerminalInput) {
        console.log("cleared terminal input after the following render");
        setSubmittedTerminalInput("");
      }
    }
    console.log(`terminal input: ${submittedTerminalInput}`);
    if (inputScript) {
      if (runRequestAllowedRef.current) {
        // programTerminatedWithoutError.current = false;
        runRequestAllowedRef.current = false;
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          runRequestAllowedRef.current = true;
        }, 5000);
        let requestBody: CodejudgeRunCodeRequestBody | IdeRunCodeRequestBody;
        let tempRequestBody = {
          inputScript: inputScript,
          fileName: fileName,
          fileExtension: editorProperties.extensions?.name
            ? editorProperties.extensions.name
            : "Unknown file extension",
        };
        if (codeExecutionEndPoint === codejudgeRunCodeEndPoint) {
          requestBody = {
            ...tempRequestBody,
            problemTitle: problemTitle ? problemTitle : "Missing Problem Title",
          };
        } else if (codeExecutionEndPoint === ideRunCodeEndPoint) {
          requestBody = {
            ...tempRequestBody,
            terminalInput:
              submittedTerminalInput && !event // ** if event isn't null, this is a fresh run, and NO terminal input should exist yet.
                ? submittedTerminalInput
                : "",
          };
        } else {
          console.log("Invalid code Execution End Point for code editor");
          return;
        }
        let responseStatus = fetchCodeOutput(
          codeExecutionEndPoint,
          requestBody,
          setOutput
        ); // based on different endpoint, the
        // action done on the submitted script will be different. e.g. if the script is passed to ide, the output
        // is the actual output of the program; if the script is passed to codejudge, the output is True/False
        // depending on whether the submitted script passes the testcases
        responseStatus.then((value) => {
          setIsLoading(false);
          isPartialResponseRef.current = value == 206;
          console.log(isPartialResponseRef.current);
        });
      } else {
        alert(
          "You are running codes too quickly! Wait a second before running the second time."
        );
      }
    }
  };

  useEffect(() => {
    if (problemTitle) setInputScript(declareFunctionString(problemTitle));
  }, [problemTitle]);
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
        <button
          type="button"
          className="btn btn-secondary border rounded-pill"
          data-bs-container="body"
          data-bs-toggle="popover"
          data-bs-placement="left"
          data-bs-content="left popover"
        >
          ?
        </button>
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

// CodeEditor.defaultProps = {
//   terminalInput: "",
//   problemTitle: "",
//   setSubmittedTerminalInput: (_: string) => {},
// };

export default CodeEditor;

// Note for myself:
// The useRef hook can be a trap for your custom hook,
// if you combine it with a useEffect that skips rendering.
// Your first instinct will be to add ref.current to the second argument of useEffect,
// so it will update once the ref changes. But the ref isn’t updated till after your component has rendered
// — meaning, any useEffect that skips rendering, won’t see any changes to the ref before the next render pass.
