// HomeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {ActivePage} from "../Shared/enum.tsx";

interface HomeContextType {
  departure: string;
  setDeparture: React.Dispatch<React.SetStateAction<string>>;
  destination: string;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  startAt: string;
  setStartAt: React.Dispatch<React.SetStateAction<string>>;
  endAt: string;
  setEndAt: React.Dispatch<React.SetStateAction<string>>;
  ItinerairePage: boolean;
  setItinerairePage: React.Dispatch<React.SetStateAction<boolean>>;
  DataPath: any;
  setDataPath: React.Dispatch<React.SetStateAction<any>>;
  activePage: ActivePage;
  setActivePage: React.Dispatch<React.SetStateAction<ActivePage>>;
}

const defaultContext: HomeContextType = {
  departure: '',
  setDeparture: () => {},
  destination: '',
  setDestination: () => {},
  startAt: '',
  setStartAt: () => {},
  endAt: '',
  setEndAt: () => {},
  ItinerairePage: false,
  setItinerairePage: () => {},
  DataPath: {},
  setDataPath: () => {},
  activePage: ActivePage.Map,
  setActivePage: () => {},
};

const HomeContext = createContext<HomeContextType>(defaultContext);

export const useHomeContext = () => {
  return useContext(HomeContext);
};

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [ItinerairePage, setItinerairePage] = useState(false);
  const [DataPath, setDataPath] = useState({});
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
    ItinerairePage: ItinerairePage,
    setItinerairePage: setItinerairePage,
    DataPath,
    setDataPath,
    activePage,
    setActivePage,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
