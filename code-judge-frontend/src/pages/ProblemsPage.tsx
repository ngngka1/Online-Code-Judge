import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProblemsList from "../components/ProblemsList";
import Problem from "../components/Problem";
import NoPage from "./NoPage";

const ProblemsPage = () => {
  const problemCategories = [
    "Array",
    "Stack",
    "Queue",
    "String",
    "Linked list",
    "Heap",
    "Tree",
    "Database",
  ];

  const [chosenProblemTitle, setChosenProblemTitle] = useState("");

  const navigate = useNavigate();
  return (
    <div className="p-5">
      <header className="text-center">Problems</header>
      <div className="border rounded p-5">
        <Routes>
          <Route
            path="problem"
            element={<Problem chosenProblemTitle={chosenProblemTitle} />}
          />
          <Route
            path=""
            element={
              <ProblemsList
                problemCategories={problemCategories}
                setChosenProblemTitle={setChosenProblemTitle}
                callback={() => navigate("problem/")}
              />
            }
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProblemsPage;
