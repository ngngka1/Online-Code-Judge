import { useState, useContext } from "react";
import CodeEditor from "../components/CodeEditor";
import TerminalPanel from "../components/TerminalPanel";
import { BackendContext } from "../contexts/BackendContext";

const IDEPage = () => {
  const [output, setOutput] = useState("");
  const [submittedTerminalInput, setSubmittedTerminalInput] = useState("");
  const { serverBaseUrl, APISuffix } = useContext(BackendContext);
  return (
    <div className="d-flex flex-column gap-2 p-5">
      <CodeEditor
        fileName="main"
        setOutput={setOutput}
        codeExecutionEndPoint={serverBaseUrl + APISuffix.ide.postRunCode}
      />
      {/* <!-- Output --> */}
      <TerminalPanel
        output={output}
        setSubmittedTerminalInput={setSubmittedTerminalInput}
      ></TerminalPanel> 
    </div>
  );
};

export default IDEPage;
