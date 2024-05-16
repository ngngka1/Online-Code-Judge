import { useEffect, useState } from "react";
import { fetchProblemsListData } from "../utils/ProblemDataManager";

interface ProblemsListProps {
  problemCategories: string[];
  setChosenProblemTitle: (title: string) => void;
  callback: () => void;
}

const ProblemsList = ({
  problemCategories,
  setChosenProblemTitle,
  callback,
}: ProblemsListProps) => {
  const selectProblem = (title: string) => {
    setChosenProblemTitle(title);
    callback();
  };
  const [problemsList, setProblemsList] = useState(new Array<string>());

  useEffect(() => {
    const problemsListString = localStorage.getItem("problemsList");
    if (!problemsListString && problemsListString !== null) {
      setProblemsList(JSON.parse(problemsListString));
    } else {
      fetchProblemsListData(setProblemsList);
      localStorage.setItem("problemsList", JSON.stringify(problemsList));
    }
  }, []);

  return (
    <div className="d-flex flex-column gap-2">
      {/* Categories list */}
      <div className="border rounded p-2">
        <p>Category:</p>
        <div className="d-inline-flex flex-wrap gap-1">
          {problemCategories.map((category: string) => (
            <button
              key={category}
              className="btn btn-light border rounded-pill p-2"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Problems list */}
      <div className="border rounded p-2">
        <p>Available Problems:</p>
        <div className="d-flex flex-column gap-2">
          {problemsList
            ? problemsList.map((problemTitle: string, index: number) => (
                <div key={index} className="d-inline-flex flex-row gap-2">
                  <button
                    className="btn btn-light d-inline-block border rounded-pill p-2"
                    onClick={() => selectProblem(problemTitle)}
                  >
                    {index + 1}. {problemTitle}
                  </button>
                </div>
              ))
            : "Loading"}
        </div>
      </div>
    </div>
  );
};

export default ProblemsList;
