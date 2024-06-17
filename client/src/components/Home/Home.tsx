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
import React, {useState} from 'react';
import useScreenWidth from '../Shared/useScreenWidth';
import Itineraire from './../Itineraire/Itineraire';
import { HomeProvider, useHomeContext } from './HomeContext';
import MapScreen from "../Map/MapScreen";
import { ArrowBackIcon } from "@chakra-ui/icons";
import LeftSearch from "../Search/LeftSearch";

const HomeContent: React.FC = () => {
  const { ItininerairePage } = useHomeContext();
  const screenWidth = useScreenWidth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

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
                      <LeftSearch/>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </Box>
            </Box>
          </Flex>
        ) : (
          <Flex flexDirection="row" w="100%" h="100%" overflow="hidden">
            <Box bg="#F6FBF9" minWidth="350px" flexBasis="33%" flexShrink={0} h="100%" p={4}>
              <LeftSearch />
            </Box>
            <Box flexBasis="67%" flexShrink={1} h="100%" display="flex">
              <MapScreen />
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
