// HomeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HomeContextType {
  departure: string;
  setDeparture: React.Dispatch<React.SetStateAction<string>>;
  destination: string;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  startAt: string;
  setStartAt: React.Dispatch<React.SetStateAction<string>>;
  endAt: string;
  setEndAt: React.Dispatch<React.SetStateAction<string>>;
  ItininerairePage: boolean;
  setItininerairePage: React.Dispatch<React.SetStateAction<boolean>>;
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
  ItininerairePage: false,
  setItininerairePage: () => {},
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
  const [ItininerairePage, setItininerairePage] = useState(false);

  const value: HomeContextType = {
    departure,
    setDeparture,
    destination,
    setDestination,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    ItininerairePage,
    setItininerairePage,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
