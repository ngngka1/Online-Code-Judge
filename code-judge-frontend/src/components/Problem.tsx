import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { BackendContext } from "../contexts/BackendContext";
import CodeEditor from "./CodeEditor";
import TerminalPanel from "./TerminalPanel";
import {
  exampleTestcase,
  fetchProblemDataByTitle,
  problemDataInitialState,
} from "../utils/ProblemDataManager";
import { ProblemDataInterface } from "../utils/ProblemDataManager";

interface ProblemProps {
  chosenProblemTitle: string;
}

const Problem = ({ chosenProblemTitle }: ProblemProps) => {
  const [inputCode, setInputCode] = useState("");
  const [output, setOutput] = useState("");
  const { serverBaseUrl, APISuffix } = useContext(BackendContext);
  const [landscapeMode, setLandscapeMode] = useState(false);
  const [problemData, setProblemData] = useState<ProblemDataInterface>(
    problemDataInitialState
  );

  // useEffect(() => {
  //   // storing input name
  //   localStorage.setItem("inputCode", inputCode);
  // }, [inputCode]);
  useEffect(() => {
    if (chosenProblemTitle) {
      fetchProblemDataByTitle(chosenProblemTitle, setProblemData);
    }
  }, []);

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
          <div className="border rounded p-2">Problem: {problemData.title}</div>
          <div className="border rounded p-2">{problemData.description}</div>
          <div className="border rounded p-2">
            Expected type of output: {problemData.expectedOutputType}
          </div>
          <div className="border rounded p-2">
            <div className="d-flex flex-column">
              {problemData
                ? problemData.exampleTestcases.map(
                    (exampleTestcase: exampleTestcase, index: number) => (
                      <>
                        <p>Example {index + 1}:</p>
                        <div className="d-flex flex-row gap-3">
                          <div className="flex-grow-1 text-bg-secondary rounded p-3">
                            <p>Input:</p>"{exampleTestcase.testcase}"
                          </div>
                          <div className="flex-grow-1 text-bg-secondary rounded p-3">
                            <p>Output:</p>"{exampleTestcase.output}"
                          </div>
                        </div>
                      </>
                    )
                  )
                : "Loading..."}
            </div>
          </div>
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
