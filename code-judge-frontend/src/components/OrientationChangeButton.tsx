import { useContext } from "react";
import { orientationContext } from "../contexts/OrientationContext";

const OrientationChangeButton = () => {
  const { localOrientation, changeOrientation } = useContext(orientationContext);
  // console.log("child received orientation " + JSON.stringify(localOrientation));
  // console.log("localOrientation: " + localStorage.getItem("localOrientation"));
  return (
    <button className="btn btn-success mb-3" onClick={changeOrientation}>
      Change display mode to: {localOrientation.landscape ? "portrait" : "landscape"}
    </button>
  );
};

export default OrientationChangeButton;
