// Home.tsx
import {
  Flex,
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import React, {useEffect, useState} from 'react';
import useScreenWidth from '../Shared/useScreenWidth';
import Itineraire from './../Itineraire/Itineraire';
import { HomeProvider, useHomeContext } from './HomeContext';
import MapScreen from "../Map/MapScreen";
import { ArrowBackIcon } from "@chakra-ui/icons";
import LeftSearch from "../Search/LeftSearch";
import { ActivePage } from "../Shared/enum.tsx";
import { Data } from "../Shared/types";
import {AutocompleteResults} from "../Search/AutocompleteResults.tsx";

const HomeContent: React.FC = () => {
  const { ItininerairePage } = useHomeContext();
  const screenWidth = useScreenWidth();
  const [isDepartureFocus, setIsDepartureFocus] = useState<boolean>(false);
  const [isDestinationFocus, setIsDestinationFocus] = useState<boolean>(false);
  const [departureResults, setDepartureResults] = useState<Data | null>(null);
  const [destinationResults, setDestinationResults] = useState<Data | null>(null);
  const { activePage, setActivePage } = useHomeContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    if (isDepartureFocus || isDestinationFocus) {
      setActivePage(ActivePage.MeilisearchResults);
    } else {
      setActivePage(ActivePage.Map);
    }
  }, [isDepartureFocus, isDestinationFocus, setActivePage]);

  async function fetchDepartureResults(textQuery: string) {
    const response = await fetchStops(textQuery);
    const data: Data = await response.json();
    setDepartureResults(data);
  }

  async function fetchDestinationResults(textQuery: string) {
    const response = await fetchStops(textQuery);
    const data: Data = await response.json();
    setDestinationResults(data);
  }

  async function fetchStops(textQuery: string) {
    const query = {
      q: textQuery,
    };

    return await fetch("http://localhost:7700/indexes/stops/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_REACT_MEILISEARCH_TOKEN}`,
      },
      body: JSON.stringify(query),
    });
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };


  return (
    <>
      {!ItininerairePage && (
        screenWidth < 700 ? (
          <Flex flexDirection="column" w="100%" h="100%" overflow="hidden">
            <Box position="relative" minHeight="100vh">
              <MapScreen />

              {/* Drawer Handle */}
              <Box
                position="fixed"
                bottom="0"
                left="0"
                right="0"
                bg="white"
                boxShadow="0px -4px 12px rgba(0, 0, 0, 0.1)"
                zIndex="999"
              >
                <Box
                  bg="white"
                  p={4}
                  borderBottom="1px solid #E2E8F0"
                  cursor="pointer"
                  display={isDrawerOpen ? "none" : "flex"}
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={handleDrawerOpen}
                >
                  <span>Search Options</span>
                  <IconButton icon={<ArrowBackIcon />} aria-label="Open drawer" />
                </Box>

                {/* Full Drawer Content */}
                <Drawer
                  placement="bottom"
                  onClose={handleDrawerClose}
                  isOpen={isDrawerOpen}
                >
                  <DrawerOverlay />
                  <DrawerContent maxH={"90vh"}>
                    <DrawerCloseButton />
                    <DrawerBody>
                      <LeftSearch
                        fetchDepartureResults={fetchDepartureResults}
                        fetchDestinationResults={fetchDestinationResults}
                        setIsDepartureFocus={setIsDepartureFocus}
                        setIsDestinationFocus={setIsDestinationFocus}
                      />
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </Box>
            </Box>
          </Flex>
        ) : (
          <Flex flexDirection="row" w="100%" h="100%" overflow="hidden">
            <Box bg="#F6FBF9" minWidth="350px" flexBasis="33%" flexShrink={0} h="100%" p={4}>
              <LeftSearch
                  fetchDepartureResults={fetchDepartureResults}
                  fetchDestinationResults={fetchDestinationResults}
                  setIsDepartureFocus={setIsDepartureFocus}
                  setIsDestinationFocus={setIsDestinationFocus}
              />
            </Box>
            <Box flexBasis="67%" flexShrink={1} h="100%" display="flex">
              {
                activePage === ActivePage.Map ? (
                    <MapScreen />
                    ) : (
                        <AutocompleteResults results={isDepartureFocus ? departureResults : destinationResults} isDepartureFocus={isDepartureFocus} />
                    )
              }
            </Box>
          </Flex>
        )
      )}
      {ItininerairePage && <Itineraire />}
    </>
  );
};

const Home: React.FC = () => (
  <HomeProvider>
    <HomeContent />
  </HomeProvider>
);

export default Home;
