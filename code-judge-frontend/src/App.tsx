import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { BackendContextProvider } from "./contexts/BackendContext";
import { OrientationProvider } from "./contexts/OrientationContext";
import React from "react";
const LazyIdePage = React.lazy(() => import("./pages/IDEPage"))
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ManageProblemsPage from "./pages/ManageProblemsPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import NoPage from "./pages/NoPage";


function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <BackendContextProvider>
          <OrientationProvider>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="/ide" element={<React.Suspense fallback="Loading..."><LazyIdePage /></React.Suspense>} />
              <Route path="/create-problems" element={<ManageProblemsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/problems/*" element={<ProblemsPage />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </OrientationProvider>
        </BackendContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
