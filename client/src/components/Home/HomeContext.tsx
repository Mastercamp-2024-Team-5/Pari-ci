// HomeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ActivePage } from "../Shared/enum.tsx";
import { TripData } from "../Shared/types";
import { getCookie, setCookie } from "../../manageCookies.tsx";

interface HomeContextType {
  departure: string;
  setDeparture: React.Dispatch<React.SetStateAction<string>>;
  destination: string;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  startAt: string;
  setStartAt: React.Dispatch<React.SetStateAction<string>>;
  endAt: string;
  setEndAt: React.Dispatch<React.SetStateAction<string>>;
  DataPath: TripData;
  setDataPath: React.Dispatch<React.SetStateAction<TripData>>;
  activePage: ActivePage;
  setActivePage: React.Dispatch<React.SetStateAction<ActivePage>>;
  errorWhileFetching: boolean;
  setErrorWhileFetching: React.Dispatch<React.SetStateAction<boolean>>;
  accessibleScreen: boolean;
  setAccessibleScreen: React.Dispatch<React.SetStateAction<boolean>>;
  stationAccessibleOnly: boolean;
  setStationAccessibleOnly: React.Dispatch<React.SetStateAction<boolean>>;
  parentId: string;
  setParentId: React.Dispatch<React.SetStateAction<string>>;
}

const defaultContext: HomeContextType = {
  departure: "",
  setDeparture: () => {},
  destination: "",
  setDestination: () => {},
  startAt: "",
  setStartAt: () => {},
  endAt: "",
  setEndAt: () => {},
  DataPath: ["", []],
  setDataPath: () => {},
  activePage: ActivePage.Map,
  setActivePage: () => {},
  errorWhileFetching: false,
  setErrorWhileFetching: () => {},
  accessibleScreen: false,
  setAccessibleScreen: () => {},
  stationAccessibleOnly: false,
  setStationAccessibleOnly: () => {},
  parentId: "",
  setParentId: () => {},
};

const HomeContext = createContext<HomeContextType>(defaultContext);

export const useHomeContext = () => {
  return useContext(HomeContext);
};

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  if (getCookie("stationAccessibleOnly") === null) {
    setCookie("stationAccessibleOnly", false);
  }
  if (getCookie("accessibleScreen") === null) {
    setCookie("accessibleScreen", true);
  }

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [DataPath, setDataPath] = useState<TripData>(["", []]);
  const [activePage, setActivePage] = useState(ActivePage.Map);
  const [errorWhileFetching, setErrorWhileFetching] = useState(false);
  const [accessibleScreen, setAccessibleScreenState] = useState(
    getCookie("accessibleScreen")
  );
  const [stationAccessibleOnly, setStationAccessibleOnlyState] = useState(
    getCookie("stationAccessibleOnly")
  );
  const [parentId, setParentId] = useState("");

  const setStationAccessibleOnly: React.Dispatch<
    React.SetStateAction<boolean>
  > = (value) => {
    setCookie("stationAccessibleOnly", value);
    setStationAccessibleOnlyState(value);
  };

  const setAccessibleScreen: React.Dispatch<React.SetStateAction<boolean>> = (
    value
  ) => {
    setCookie("accessibleScreen", value);
    setAccessibleScreenState(value);
  };

  const value: HomeContextType = {
    departure,
    setDeparture,
    destination,
    setDestination,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    DataPath,
    setDataPath,
    activePage,
    setActivePage,
    errorWhileFetching,
    setErrorWhileFetching,
    accessibleScreen,
    setAccessibleScreen,
    stationAccessibleOnly,
    setStationAccessibleOnly,
    parentId,
    setParentId,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
