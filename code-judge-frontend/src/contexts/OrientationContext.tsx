import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

interface orientationInterface {
  localOrientation: { landscape: boolean; portrait: boolean };
  changeOrientation: () => void;
}

interface OrientationInterface {
  landscape: boolean;
  portrait: boolean;
}

const defaultOrientation = {
  landscape: true,
  portrait: false,
};

export const orientationContext = createContext<orientationInterface>({
  localOrientation: defaultOrientation,
  changeOrientation: () => {},
});

export const OrientationProvider = ({ children }: { children: ReactNode }) => {
  const [localOrientation, setLocalOrientation] =
    useState<OrientationInterface>(defaultOrientation);

  const changeOrientation = useCallback(() => {
    setLocalOrientation((prevState) => ({
      landscape: !prevState.landscape,
      portrait: !prevState.portrait,
    }));
    // localStorage.setItem("localOrientation", JSON.stringify(localOrientation));
    // localStorage.setItem("localOrientation", "");
  }, []);

  return (
    <orientationContext.Provider
      value={{ localOrientation, changeOrientation }}
    >
      {children}
    </orientationContext.Provider>
  );
};
