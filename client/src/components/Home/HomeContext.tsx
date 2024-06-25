// HomeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ActivePage } from "../Shared/enum.tsx";
import { InputStop, TripData } from "../Shared/types";

interface HomeContextType {
  departure: InputStop;
  setDeparture: React.Dispatch<React.SetStateAction<InputStop>>;
  destination: InputStop;
  setDestination: React.Dispatch<React.SetStateAction<InputStop>>;
  startAt: string;
  setStartAt: React.Dispatch<React.SetStateAction<string>>;
  endAt: string;
  setEndAt: React.Dispatch<React.SetStateAction<string>>;
  dataPath: TripData;
  setDataPath: React.Dispatch<React.SetStateAction<TripData>>;
  activePage: ActivePage;
  setActivePage: React.Dispatch<React.SetStateAction<ActivePage>>;
}

const defaultContext: HomeContextType = {
  departure: { id: "", name: "" },
  setDeparture: () => { },
  destination: { id: "", name: "" },
  setDestination: () => { },
  startAt: "",
  setStartAt: () => { },
  endAt: "",
  setEndAt: () => { },
  dataPath: ["", []],
  setDataPath: () => { },
  activePage: ActivePage.Map,
  setActivePage: () => { },
};

const HomeContext = createContext<HomeContextType>(defaultContext);

// eslint-disable-next-line react-refresh/only-export-components
export const useHomeContext = () => {
  return useContext(HomeContext);
};

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {

  const [departure, setDeparture] = useState<InputStop>({ id: "", name: "" });
  const [destination, setDestination] = useState<InputStop>({ id: "", name: "" });
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [DataPath, setDataPath] = useState<TripData>(["", []]);
  const [activePage, setActivePage] = useState(ActivePage.Map);

  const value: HomeContextType = {
    departure,
    setDeparture,
    destination,
    setDestination,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    dataPath: DataPath,
    setDataPath,
    activePage,
    setActivePage,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
