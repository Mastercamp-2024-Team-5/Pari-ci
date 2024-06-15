import { Box, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import LeftSearch from "./../LeftSearch";
import React, { useState } from "react";
import MapScreen from "../MapScreen";

const HomeMobile = ({
  departure,
  setDeparture,
  destination,
  setDestination,
  startAt,
  setStartAt,
  endAt,
  setEndAt,
  setItininerairePage
}: {
  departure: string;
  setDeparture: React.Dispatch<React.SetStateAction<string>>;
  destination: string;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  startAt: string;
  setStartAt: React.Dispatch<React.SetStateAction<string>>;
  endAt: string;
  setEndAt: React.Dispatch<React.SetStateAction<string>>;
  setItininerairePage: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
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
            <IconButton
              icon={<ArrowBackIcon />}
              aria-label="Open drawer"
            />
          </Box>

          {/* Full Drawer Content */}
          <Drawer placement="bottom" onClose={handleDrawerClose} isOpen={isDrawerOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody>
                <LeftSearch
                  departure={departure}
                  setDeparture={setDeparture}
                  destination={destination}
                  setDestination={setDestination}
                  startAt={startAt}
                  setStartAt={setStartAt}
                  endAt={endAt}
                  setEndAt={setEndAt}
                  setItininerairePage={setItininerairePage}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      </Box>
    </>
  );
};

export default HomeMobile;
