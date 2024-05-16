import React, { useReducer, ChangeEvent, useEffect, useContext } from "react";
import {
  ProblemDataInterface,
  problemDataInitialState,
  createProblem,
  updateProblemByTitle,
  exampleTestcase,
  exampleTestcaseInitialState,
} from "../utils/ProblemDataManager";
import { orientationContext } from "../contexts/OrientationContext";

interface SubmitProblemFormProps {
  chosenProblemData: ProblemDataInterface;
}

interface dispatchActionObject {
  formElement?: string;
  value?: string;
  type?: string;
  index?: number;
  payload?: ProblemDataInterface;
}

// const recursiveModify = (
//   object: object | any,
//   targetPropertyName: string,
//   targetValue: any
// ): any => {
//   if (targetPropertyName.includes("[")) {
//     let end = targetPropertyName.indexOf("]");
//     let index = parseInt(
//       targetPropertyName.slice(targetPropertyName.indexOf("[") + 1, end)
//     );
//     if (targetPropertyName.length - 1 === end) {
//       object[index] = targetValue;
//       return object;
//     }
//     targetPropertyName = targetPropertyName.slice(end + 2);
//     object[index] = recursiveModify(
//       object[index],
//       targetPropertyName,
//       targetValue
//     );
//   }

//   if (targetPropertyName.includes(".")) {
//     let nextProperty = targetPropertyName.slice(
//       0,
//       targetPropertyName.indexOf(".")
//     );
//     targetPropertyName = targetPropertyName.slice(
//       targetPropertyName.indexOf(".") + 1
//     );
//     return {
//       ...object,
//       [nextProperty]: recursiveModify(
//         object[nextProperty as keyof object],
//         targetPropertyName,
//         targetValue
//       ),
//     };
//   }
//   if (targetPropertyName in object) {
//     return { ...object, [targetPropertyName]: targetValue };
//   } else {
//     console.log("target property not found error");
//     return object;
//   }
// };
const reducerActions = {
  initialize: "initialize",
  addTestcase: "addTestcase",
  deleteTestcase: "deleteTestcase",
  modifyField: "modifyField",
};

const reducer = (
  formState: ProblemDataInterface,
  action: dispatchActionObject
) => {
  switch (action.type) {
    case "initialize": {
      return action?.payload ? action.payload : problemDataInitialState;
    }
    case "addTestcase": {
      return {
        ...formState,
        exampleTestcases: formState.exampleTestcases
          .map((value: exampleTestcase) => value)
          .concat(exampleTestcaseInitialState),
      };
    }
    case "modifyField": {
      if (action.formElement) {
        if (action.formElement in formState) {
          return { ...formState, [action.formElement]: action.value };
        }
        if (action.formElement.startsWith("exampleTestcases")) {
          // very bad approach but i cant come up with a better one for now
          const index = parseInt(
            action.formElement.slice(
              action.formElement.indexOf("[") + 1,
              action.formElement.indexOf("]")
            )
          );
          const property = action.formElement.slice(
            action.formElement.indexOf(".") + 1
          );
          return {
            ...formState,
            exampleTestcases: formState.exampleTestcases.map(
              (value: exampleTestcase, i: number) => {
                return i !== index
                  ? value
                  : { ...value, [property]: action.value };
              }
            ),
          };
        }
      }
      return formState;
    }
    case "deleteTestcase": {
      return {
        ...formState,
        exampleTestcases: formState.exampleTestcases.filter(
          (value: exampleTestcase, i: number) => i !== action.index
        ),
      };
    }
  }
  return formState;
};

const SubmitProblemForm = ({ chosenProblemData }: SubmitProblemFormProps) => {
  const [formData, setFormData] = useReducer(reducer, problemDataInitialState);
  const { localOrientation } = useContext(orientationContext);
  console.log("orientation.landscape: " + localOrientation.landscape);

  useEffect(() => {
    if (chosenProblemData)
      setFormData({
        type: reducerActions.initialize,
        payload: chosenProblemData,
      });
  }, [chosenProblemData]);
  const handleChanges = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({
      formElement: name,
      value: value,
      type: reducerActions.modifyField,
    });
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
    window.location.reload();
  };
  const addTestcase = () => {
    setFormData({ type: reducerActions.addTestcase });
  };
  const deleteTestcase = (testcaseIndex: number) => {
    setFormData({
      type: reducerActions.deleteTestcase,
      index: testcaseIndex,
    });
  };

  const discardChanges = () => {
    // setFormData({ formElement: "", value: "", type: "initialize" });
    window.location.reload();
  };

  return (
    <form className="d-flex flex-column gap-3" onSubmit={submitProblem}>
      {chosenProblemData.title ? (
        <div className="d-flex justify-content-between">
          <div>Modifying problem: {chosenProblemData.title}</div>
          <button
            type="button"
            className="btn btn-danger"
            onClick={discardChanges}
          >
            ✗ Discard changes
          </button>
        </div>
      ) : (
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-danger"
            onClick={discardChanges}
          >
            ✗ Discard
          </button>
        </div>
      )}
      <label>Title: </label>
      <input
        type="text"
        className="border rounded"
        name="title"
        value={formData.title}
        onChange={(e: any) => {
          handleChanges(e);
          console.log(formData.title);
        }}
      />
      <label>Description: </label>
      <textarea
        className="border rounded wrap text-area-resize"
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
            <div
              key={"Testcase" + index}
              className="d-flex flex-row border rounded p-2 gap-2 flex-wrap"
            >
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteTestcase(index)}
              >
                ✗
              </button>
              <div
                className={
                  "d-inline-flex" + localOrientation.landscape
                    ? "flex-row"
                    : "flex-column"
                }
              >
                <div>
                  <label>Example Input: </label>
                  <textarea
                    className="border rounded w-100"
                    name={"exampleTestcases[" + index + "].input"}
                    value={formData.exampleTestcases[index].input}
                    onChange={handleChanges}
                  />
                </div>
                <div>
                  <label>Expected output: </label>
                  <textarea
                    className="border rounded w-100"
                    name={"exampleTestcases[" + index + "].output"}
                    value={formData.exampleTestcases[index].output}
                    onChange={handleChanges}
                  />
                </div>
              </div>
            </div>
          )
        )}
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-success"
            onClick={addTestcase}
          >
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
