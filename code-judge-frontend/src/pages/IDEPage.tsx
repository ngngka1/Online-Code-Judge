import { useState, useContext, useRef, useCallback } from "react";
import CodeEditor from "../components/CodeEditor";
import TerminalPanel from "../components/TerminalPanel";
import { BackendContext } from "../contexts/BackendContext";
import { orientationContext } from "../contexts/OrientationContext";
import OrientationChangeButton from "../components/OrientationChangeButton";

const IDEPage = () => {
  const [output, setOutput] = useState("");
  // const [submittedTerminalInput, setSubmittedTerminalInput] = useState("");
  const [submittedTerminalInput, setSubmittedTerminalInput] = useState("")
  const { localOrientation } = useContext(orientationContext);
  const { serverBaseUrl, APISuffix } = useContext(BackendContext);

  const pushSubmittedTerminalInput = (input: string) => {
    setSubmittedTerminalInput(submittedTerminalInput + input);
  }
  return (
    <div className="p-5">
      <div className="d-flex flex-row-reverse">
        <OrientationChangeButton />
      </div>
      <div
        className={
          "d-flex gap-2 p-3 align-items-stretch " +
          (localOrientation.landscape ? "flex-column" : "flex-row")
        }
      >
        <div className="flex-grow-1">
          <CodeEditor
            fileName="main"
            setOutput={setOutput}
            codeExecutionEndPoint={serverBaseUrl + APISuffix.ide.postRunCode}
            submittedTerminalInput={submittedTerminalInput}
            setSubmittedTerminalInput={setSubmittedTerminalInput}
          />
        </div>
        {/* <!-- Output --> */}
        <div className="flex-grow-1 border rounded-5">
          <TerminalPanel
            output={output}
            pushSubmittedTerminalInput={pushSubmittedTerminalInput}
          />
        </div>
      </div>
    </div>
  );
};

export default IDEPage;
