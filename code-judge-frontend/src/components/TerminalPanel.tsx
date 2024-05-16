import { useState } from "react";

interface TerminalPanelProps {
  output: string;
  pushSubmittedTerminalInput: (terminalInput: string) => void;
}

const TerminalPanel = ({
  output,
  pushSubmittedTerminalInput,
}: TerminalPanelProps) => {
  const [input, setInput] = useState("");
  const submitTerminalInput = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    pushSubmittedTerminalInput(input + '\n');
    setInput("");
  }
  
  return (
    <div className="d-flex flex-column gap-2 p-4">
      <div>Terminal:</div>
      <div className="border rounded p-2 bg-black text-light cursor-text">
        <pre>
          {output}
          {output && (
            <form onSubmit={submitTerminalInput} className="d-inline-block">
              <input
                key="input"
                type="text"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                className="bg-black transparent-input"
              />
            </form>
          )}
        </pre>
      </div>
    </div>
  );
 }

export default TerminalPanel;
