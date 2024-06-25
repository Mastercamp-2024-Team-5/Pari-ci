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
import React, { useEffect, useState } from 'react';
import useScreenWidth from '../Shared/useScreenWidth';
import { useHomeContext } from './HomeContext';
import MapScreen from "../Map/MapScreen";
import { ArrowBackIcon } from "@chakra-ui/icons";
import LeftSearch from "../Search/LeftSearch";
import { ActiveLeftPage, ActiveRightPage } from "../Shared/enum.tsx";
import { ActiveSearchInput, Data, TripData } from "../Shared/types";
import { AutocompleteResults } from "../Search/AutocompleteResults.tsx";
import { useLoaderData } from "react-router-dom";
import LeftTrip from "../Trip/LeftTrip.tsx";
import MoreDetails from "../Trip/MoreDetails.tsx";
import DetailsScreen from "../Trip/DetailsScreen.tsx";

const Home: React.FC = () => {
  const screenWidth = useScreenWidth();
  const [meilisearchResults, setMeilisearchResults] = useState<Data | null>(null);
  const { activeRightPage, setActiveRightPage, activeLeftPage, setActiveLeftPage, setDataPath } = useHomeContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedSearch, setSelectedSearch] = useState<ActiveSearchInput>(ActiveSearchInput.Departure);
  const shared = useLoaderData();

  async function fetchMeilisearchResults(textQuery: string) {
    const query = {
      q: textQuery,
    };

    const response = await fetch("http://localhost:7700/indexes/stops/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_REACT_MEILISEARCH_TOKEN}`,
      },
      body: JSON.stringify(query),
    });
    const data: Data = await response.json();
    setMeilisearchResults(data);
  }

  useEffect(() => {
    setMeilisearchResults(null);
  }, [selectedSearch]);

  useEffect(() => {
    if (shared) {
      setActiveRightPage(ActiveRightPage.Trip);
      setDataPath(shared as TripData)
    }
  }, [shared, setActiveRightPage, setDataPath]);

  useEffect(() => {
    if (activeRightPage === ActiveRightPage.Trip || activeRightPage === ActiveRightPage.TripDetails) {
      setActiveLeftPage(ActiveLeftPage.Trip);
    } else {
      setActiveLeftPage(ActiveLeftPage.Search);
    }
  }, [activeRightPage, setActiveLeftPage]);

  return (
    <>
      {
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
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <span>Search Options</span>
                  <IconButton icon={<ArrowBackIcon />} aria-label="Open drawer" />
                </Box>

                {/* Full Drawer Content */}
                <Drawer
                  placement="bottom"
                  onClose={() => setIsDrawerOpen(false)}
                  isOpen={isDrawerOpen}
                >
                  <DrawerOverlay />
                  <DrawerContent maxH={"90vh"}>
                    <DrawerCloseButton />
                    <DrawerBody>
                      <LeftSearch
                        fetchMeilisearchResults={fetchMeilisearchResults}
                        setSelectedSearch={setSelectedSearch}
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
              {
                activeLeftPage === ActiveLeftPage.Search &&
                < LeftSearch
                  fetchMeilisearchResults={fetchMeilisearchResults}
                  setSelectedSearch={setSelectedSearch}
                />
              }
              {
                activeLeftPage === ActiveLeftPage.Trip && <LeftTrip />
              }
            </Box>
            <Box flexBasis="67%" flexShrink={1} h="100%" display="flex">
              <div style={{
                display: activeRightPage === ActiveRightPage.Map || activeRightPage === ActiveRightPage.Trip ? "block" : "none",
                flex: 1,
                width: "100%",
                height: "100%",
              }}>
                <MapScreen />
              </div>
              {
                activeRightPage === ActiveRightPage.MeilisearchResults && (
                  <AutocompleteResults
                    results={meilisearchResults}
                    selected={selectedSearch}
                  />
                )
              }
              {
                activeRightPage === ActiveRightPage.TripDetails && (
                  <DetailsScreen />
                )
              }
            </Box>
          </Flex>
        )
      }
    </>
  );
};

export default Home;
