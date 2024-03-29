import { useState } from "react";

interface TerminalPanelProps {
  output: string;
  setSubmittedTerminalInput: (terminalInput: string) => void;
}

const TerminalPanel = ({
  output,
  setSubmittedTerminalInput,
}: TerminalPanelProps) => {
  const [input, setInput] = useState("");
  return (
    <div className="d-flex flex-column border rounded-5 gap-2 p-4">
      <div>Terminal:</div>
      <div className="border rounded p-2 bg-black text-light cursor-text">
        <pre>
          {output}
          {output && (
            <form onSubmit={() => setSubmittedTerminalInput(input)}>
              <input
                key="input"
                type="text"
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                className="d-inline-block bg-black bg-transparent transparent-input"
              />
            </form>
          )}
        </pre>
      </div>
    </div>
  );
};

export default TerminalPanel;
