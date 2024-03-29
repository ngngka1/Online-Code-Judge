import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { BackendContext } from "../contexts/BackendContext";
import CodeEditor from "./CodeEditor";
import TerminalPanel from "./TerminalPanel";

interface ProblemProps {
  chosenProblemTitle: string;
}

const Problem = ({ chosenProblemTitle }: ProblemProps) => {
  const [inputCode, setInputCode] = useState("");
  const [output, setOutput] = useState("");
  const { serverBaseUrl, APISuffix } = useContext(BackendContext);
  const [landscapeMode, setLandscapeMode] = useState(false);

  // useEffect(() => {
  //   // storing input name
  //   localStorage.setItem("inputCode", inputCode);
  // }, [inputCode]);

  return !chosenProblemTitle ? (
    <Navigate to="/problems" />
  ) : (
    <>
      <div className="d-flex flex-row-reverse">
        <button
          className="btn btn-success mb-3"
          onClick={() => setLandscapeMode(!landscapeMode)}
        >
          Change display mode to: {landscapeMode ? "portrait" : "landscape"}
        </button>
      </div>
      <div
        className={
          "d-flex gap-5" + (landscapeMode ? " flex-row" : " flex-column")
        }
      >
        <div className="flex-grow-1 d-flex flex-column border rounded p-5 gap-2">
          <div className="border rounded">Problem: {chosenProblemTitle}</div>
          <div className="border rounded">Description</div>
          <div className="border rounded">Expected Output</div>
        </div>
        <div className="flex-grow-1 d-flex flex-column border rounded gap-2 p-5">
          <CodeEditor
            fileName="Solution"
            setOutput={setOutput}
            codeExecutionEndPoint={
              serverBaseUrl + APISuffix.codejudge.postRunCode
            }
          ></CodeEditor>
          <TerminalPanel
            output={output}
            setSubmittedTerminalInput={() => {}}
          ></TerminalPanel>
        </div>
      </div>
    </>
  );
};

export default Problem;
