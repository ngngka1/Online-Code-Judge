import { backendContextData } from "../contexts/BackendContext";

export interface exampleTestcase {
  input: string;
  output: string;
}

export const exampleTestcaseInitialState: exampleTestcase = {
  input: "",
  output: "",
};

export interface ProblemDataInterface {
  title: string;
  description: string;
  expectedOutputType: string;
  exampleTestcases: exampleTestcase[];
}

export const problemDataInitialState: ProblemDataInterface = {
  title: "",
  description: "",
  expectedOutputType: "",
  exampleTestcases: [
    {
      input: "",
      output: "",
    },
  ],
};

const { serverBaseUrl, APISuffix } = backendContextData;

export const fetchProblemDataByTitle = async (
  problemTitle: string,
  setStateCallback: React.Dispatch<React.SetStateAction<ProblemDataInterface>>
) => {
  const response = await fetch(
    serverBaseUrl + APISuffix.codejudge.getProblemByTitle + problemTitle
  );
  const jsonData = await response.json();
  // console.table(jsonData);
  setStateCallback(jsonData);
};

// this function fetch the list of titles of problems from api endpoint
export const fetchProblemsListData = async (
  setStateCallback: React.Dispatch<React.SetStateAction<Array<string>>>
) => {
  const response = await fetch(
    serverBaseUrl + APISuffix.codejudge.getProblemsList
  );
  const jsonData = await response.json();
  // if (jsonData)
  setStateCallback(jsonData?.problemTitles);
  console.log(response.statusText);
  // console.table(jsonData)
};

// this function updates the problem's data according to the title given
export const updateProblemByTitle = async (
  problemData: ProblemDataInterface,
  problemTitle: string
) => {
  const APIendpoint =
    serverBaseUrl + APISuffix.codejudge.updateProblemByTitle + problemTitle;

  const response = await fetch(APIendpoint, {
    method: "PUT",
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
  console.log(response.statusText);
};
