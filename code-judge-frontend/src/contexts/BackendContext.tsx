import { ReactNode, createContext } from "react";

const serverBaseUrl = "http://127.0.0.1:8000/";

export interface BackendContextType {
  serverBaseUrl: string;
  APISuffix: {
    ide: {
      postRunCode: string,
    },
    codejudge: {
      postRunCode: string,
      postSubmittedCode: string,
      createProblem: string,
      updateProblemByTitle: string,
      getProblemByTitle: string,
      getProblemsList: string,
    }
  };
}

export const backendContextData = {
  serverBaseUrl: serverBaseUrl,
  APISuffix: {
    ide: {
      postRunCode: "ide/run-code/",
    },
    codejudge: {
      postRunCode: "codejudge/run-code/",
      postSubmittedCode: "codejudge/submit-code/",
      createProblem: "codejudge/create-problem/",
      updateProblemByTitle: "codejudge/update-problem/",
      getProblemByTitle: "codejudge/get-problem/",
      getProblemsList: "codejudge/get-problems-list/",
    }
  },
};

export const BackendContext =
  createContext<BackendContextType>(backendContextData);

export const BackendContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <BackendContext.Provider value={backendContextData}>
      {children}
    </BackendContext.Provider>
  );
};
