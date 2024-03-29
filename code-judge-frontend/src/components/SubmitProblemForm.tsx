import React, { useReducer, ChangeEvent } from "react";
import {
  ProblemDataInterface,
  problemDataInitialState,
  createProblem,
  updateProblemByTitle,
  exampleTestcase,
  exampleTestcaseInitialState,
} from "../utils/ProblemDataManager";

interface SubmitProblemFormProps {
  chosenProblemData: ProblemDataInterface;
}

interface dispatchActionObject {
  formElement: string;
  value: string;
}

const recursiveModify = (
  object: object | any,
  targetPropertyName: string,
  targetValue: any
): any => {
  if (targetPropertyName.includes("[")) {
    let end = targetPropertyName.indexOf("]");
    let index = parseInt(targetPropertyName.slice(targetPropertyName.indexOf("[") + 1, end));
    if (targetPropertyName.length - 1 === end) {
      object[index] = targetValue;
      return object;
    }
    targetPropertyName = targetPropertyName.slice(end + 2);
    object[index] = recursiveModify(object[index], targetPropertyName, targetValue);
  }

  if (targetPropertyName.includes(".")) {
    let nextProperty = targetPropertyName.slice(
      0,
      targetPropertyName.indexOf(".")
    );
    targetPropertyName = targetPropertyName.slice(
      targetPropertyName.indexOf(".") + 1
    );
    return {
      ...object,
      [nextProperty]: recursiveModify(
        object[nextProperty as keyof object],
        targetPropertyName,
        targetValue
      ),
    };
  }
  if (targetPropertyName in object) {
    return { ...object, [targetPropertyName]: targetValue };
  } else {
    console.log("target property not found error");
    return object;
  }
};

const reducer = (
  formState: ProblemDataInterface,
  action: dispatchActionObject
) => {
  if (action.formElement in formState) {
    if (action.formElement.includes(".")) {
      return recursiveModify(formState, action.formElement, action.value);
    } else return { ...formState, [action.formElement]: action.value };
  } else {
    console.log("no change");
    return formState;
  }
};

const SubmitProblemForm = ({ chosenProblemData }: SubmitProblemFormProps) => {
  const [formData, setFormData] = useReducer(reducer, problemDataInitialState);

  const handleChanges = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ formElement: name, value: value });
  };

  const submitProblem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problemData = formData;
    if (chosenProblemData.title) {
      // update
      updateProblemByTitle(problemData, chosenProblemData.title);
    } else {
      createProblem(problemData);
    }
  };
  const addTestcase = () => {
    formData.exampleTestcases.push(exampleTestcaseInitialState);
  };

  const discardChanges = () => {
    // wip
  };

  return (
    <form className="d-flex flex-column gap-3" onSubmit={submitProblem}>
      {chosenProblemData.title && (
        <div className="d-flex justify-content-between">
          <div>Modifying problem: {chosenProblemData.title}</div>
          <button className="btn btn-dangerous" onClick={discardChanges}>
            ✗ Discard changes
          </button>
        </div>
      )}
      <label>Title: </label>
      <input
        type="text"
        className="border rounded"
        name="title"
        value={formData.title}
        onChange={handleChanges}
      />
      <label>Description: </label>
      <input
        type="text"
        className="border rounded"
        name="description"
        value={formData.description}
        onChange={handleChanges}
      />
      <label>Expected output type: </label>
      <input
        type="text"
        className="border rounded"
        name="expectedOutputType"
        value={formData.expectedOutputType}
        onChange={handleChanges}
      />
      {/* test cases */}
      <label>Example Testcases:</label>
      <div className="d-flex flex-column border rounded p-2 gap-2">
        {/* list of testcases */}
        {formData.exampleTestcases.map(
          (exampleTestcase: exampleTestcase, index: number) => (
            <div className="d-flex flex-row border rounded p-2">
              <label>Example testcases: </label>
              <input
                type="text"
                className="border rounded width-0 flex-grow-1"
                name={"exampleTestcases[" + index + "].testcase"}
                value={formData.exampleTestcases[index].testcase}
                onChange={handleChanges}
              />
              <label>Expected output: </label>
              <input
                type="text"
                className="border rounded width-0 flex-grow-1"
                name={"exampleTestcases[" + index + "].output"}
                value={formData.exampleTestcases[index].output}
                onChange={handleChanges}
              />
            </div>
          )
        )}
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={addTestcase}>
            Add testcases
          </button>
        </div>
      </div>
      <div className="d-flex flex-row-reverse">
        <button type="submit" className="btn btn-success mt-3">
          {chosenProblemData.title ? "✔ Save Changes" : "+ Create new problem"}
        </button>
      </div>
    </form>
  );
};

export default SubmitProblemForm;
