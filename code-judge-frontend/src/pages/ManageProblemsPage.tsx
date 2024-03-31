import { useCallback, useEffect, useState } from "react";
import ProblemsList from "../components/ProblemsList";
import SubmitProblemForm from "../components/SubmitProblemForm";
import {
  ProblemDataInterface,
  fetchProblemDataByTitle,
  problemDataInitialState,
} from "../utils/ProblemDataManager";

const ManageProblemsPage = () => {
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
  const [chosenProblemData, setChosenProblemData] =
    useState<ProblemDataInterface>(problemDataInitialState);
  var allowFetchRequest = true;

  const createNewProblem = useCallback(() => {
    setChosenProblemTitle("");
    //zzzz
  }, []);

  useEffect(() => {
    if (chosenProblemTitle) {
      if (allowFetchRequest) {
        allowFetchRequest = false;
        setTimeout(() => {
          allowFetchRequest = true;
        }, 5000);
        fetchProblemDataByTitle(chosenProblemTitle, setChosenProblemData);
      } else {
        alert(
          "You are making requests too quickly! Wait a second before making more requests."
        );
      }
    }
  }, [chosenProblemTitle]);

  return (
    <div className="p-5">
      <header className="text-center">Problems</header>
      <div className="d-flex border rounded p-5 gap-3">
        <div className="flex-grow-1 width-0">
          <p className="border rounded p-2">Current Problems:</p>
          <ProblemsList
            problemCategories={problemCategories}
            setChosenProblemTitle={setChosenProblemTitle}
            callback={() => {}}
          ></ProblemsList>
        </div>
        <div className="flex-grow-1 border rounded p-2 width-0">
          <SubmitProblemForm
            chosenProblemData={chosenProblemData}
          ></SubmitProblemForm>
        </div>
      </div>
    </div>
  );
};

export default ManageProblemsPage;
