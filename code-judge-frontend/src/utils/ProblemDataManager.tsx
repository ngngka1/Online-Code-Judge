import { useContext } from "react";
import { backendContextData } from "../contexts/BackendContext";

export interface exampleTestcase {
  testcase: string;
  output: string;
}

export const exampleTestcaseInitialState: exampleTestcase = {
  testcase: "",
  output: "",
}

export interface ProblemDataInterface {
  title: string;
  description: string;
  expectedOutputType: "integer" | "string" | "list";
  exampleTestcases: exampleTestcase[];
}

export const problemDataInitialState: ProblemDataInterface = {
  title: "",
  description: "",
  expectedOutputType: "integer",
  exampleTestcases: [{
    testcase: "",
    output: "",
  }]
}



const { serverBaseUrl, APISuffix } = backendContextData;

export const fetchProblemDataByTitle = async (
  problemTitle: string,
  setStateCallback: React.Dispatch<React.SetStateAction<ProblemDataInterface>>
) => {
  const response = await fetch(
    serverBaseUrl + APISuffix.codejudge.getProblemByTitle + problemTitle
  );
  const jsonData = await response.json();
  // if (jsonData)
  setStateCallback(jsonData);
};

export const fetchProblemsListData = async (
  setStateCallback: React.Dispatch<React.SetStateAction<Array<string>>>
) => {
  const response = await fetch(
    serverBaseUrl + APISuffix.codejudge.getProblemsList
  );
  const jsonData = await response.json();
  // if (jsonData)
  setStateCallback(jsonData);
};

export const updateProblemByTitle = async (
  problemData: ProblemDataInterface,
  problemTitle: string
) => {
  const APIendpoint =
    serverBaseUrl + APISuffix.codejudge.updateProblemByTitle + problemTitle;

  const response = await fetch(APIendpoint, {
    method: "UPDATE",
    headers: {
      "Content-Type": "application/json",
      // "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: JSON.stringify(problemData),
  });
  console.log(response.status);
};

export const createProblem = async (problemData: ProblemDataInterface) => {
  const APIendpoint = serverBaseUrl + APISuffix.codejudge.createProblem;

  const response = await fetch(APIendpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: JSON.stringify(problemData),
  });
  console.log(response.status);
};
