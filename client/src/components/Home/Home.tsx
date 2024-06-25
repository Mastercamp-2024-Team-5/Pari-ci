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
import { ActivePage } from "../Shared/enum.tsx";
import { ActiveSearchInput, Data } from "../Shared/types";
import { AutocompleteResults } from "../Search/AutocompleteResults.tsx";

const Home: React.FC = () => {
  const screenWidth = useScreenWidth();
  const [meilisearchResults, setMeilisearchResults] = useState<Data | null>(null);
  const { activePage } = useHomeContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedSearch, setSelectedSearch] = useState<ActiveSearchInput>(ActiveSearchInput.Departure);

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
              <LeftSearch
                fetchMeilisearchResults={fetchMeilisearchResults}
                setSelectedSearch={setSelectedSearch}
              />
            </Box>
            <Box flexBasis="67%" flexShrink={1} h="100%" display="flex">
              {
                activePage === ActivePage.Map ? (
                  <MapScreen />
                ) : (
                  <AutocompleteResults
                    results={meilisearchResults}
                    selected={selectedSearch}
                  />
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
