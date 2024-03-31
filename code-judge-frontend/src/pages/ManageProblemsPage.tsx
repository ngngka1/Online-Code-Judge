import { useCallback, useContext, useEffect, useState } from "react";
import ProblemsList from "../components/ProblemsList";
import SubmitProblemForm from "../components/SubmitProblemForm";
import {
  ProblemDataInterface,
  fetchProblemDataByTitle,
  problemDataInitialState,
} from "../utils/ProblemDataManager";
import OrientationChangeButton from "../components/OrientationChangeButton";
import { orientationContext } from "../contexts/OrientationContext";

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
  const { localOrientation } = useContext(orientationContext);
  const [chosenProblemTitle, setChosenProblemTitle] = useState("");
  const [chosenProblemData, setChosenProblemData] =
    useState<ProblemDataInterface>(problemDataInitialState);
  var allowFetchRequest = true;

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
      <div className="border rounded p-5">
        <div className="d-flex flex-row-reverse">
          <OrientationChangeButton />
        </div>
        <div
          className={
            "d-flex gap-3 " +
            (localOrientation.landscape ? "flex-row" : "flex-column")
          }
        >
          <div className="flex-grow-1">
            <p className="border rounded p-2">Current Problems:</p>
            <ProblemsList
              problemCategories={problemCategories}
              setChosenProblemTitle={setChosenProblemTitle}
              callback={() => {}}
            ></ProblemsList>
          </div>
          <div className="flex-grow-1 border rounded p-2">
            <SubmitProblemForm
              chosenProblemData={chosenProblemData}
            ></SubmitProblemForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProblemsPage;
