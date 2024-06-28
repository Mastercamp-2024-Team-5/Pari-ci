// HomeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ActiveLeftPage, ActiveRightPage } from "../Shared/enum.tsx";
import { InputStop, TripData, TripInfo } from "../Shared/types";

interface HomeContextType {
  departure: InputStop | null;
  setDeparture: React.Dispatch<React.SetStateAction<InputStop | null>>;
  destination: InputStop | null;
  setDestination: React.Dispatch<React.SetStateAction<InputStop | null>>;
  startAt: string;
  setStartAt: React.Dispatch<React.SetStateAction<string>>;
  endAt: string;
  setEndAt: React.Dispatch<React.SetStateAction<string>>;
  dataPath: TripData | null;
  setDataPath: React.Dispatch<React.SetStateAction<TripData | null>>;
  activeRightPage: ActiveRightPage;
  setActiveRightPage: React.Dispatch<React.SetStateAction<ActiveRightPage>>;
  activeLeftPage: ActiveLeftPage;
  setActiveLeftPage: React.Dispatch<React.SetStateAction<ActiveLeftPage>>;
  dataTrip: TripInfo | null;
  setDataTrip: React.Dispatch<React.SetStateAction<TripInfo | null>>;
}

const defaultContext: HomeContextType = {
  departure: null,
  setDeparture: () => { },
  destination: null,
  setDestination: () => { },
  startAt: "",
  setStartAt: () => { },
  endAt: "",
  setEndAt: () => { },
  dataPath: null,
  setDataPath: () => { },
  activeRightPage: ActiveRightPage.Map,
  setActiveRightPage: () => { },
  activeLeftPage: ActiveLeftPage.Search,
  setActiveLeftPage: () => { },
  dataTrip: null,
  setDataTrip: () => { },
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

  const [departure, setDeparture] = useState<InputStop | null>(null);
  const [destination, setDestination] = useState<InputStop | null>(null);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [dataPath, setDataPath] = useState<TripData | null>(null);
  const [activeRightPage, setActiveRightPage] = useState(ActiveRightPage.Map);
  const [activeLeftPage, setActiveLeftPage] = useState(ActiveLeftPage.Search);
  const [dataTrip, setDataTrip] = useState<TripInfo | null>(null);

  const value: HomeContextType = {
    departure,
    setDeparture,
    destination,
    setDestination,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    dataPath,
    setDataPath,
    activeRightPage,
    setActiveRightPage,
    activeLeftPage,
    setActiveLeftPage,
    dataTrip,
    setDataTrip,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
