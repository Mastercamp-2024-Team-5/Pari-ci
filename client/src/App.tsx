import { ChakraProvider, Box, Container, Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import AccessibleScreen from "./components/AccessibleScreen";
import useScreenWidth from "./components/useScreenWidth";
import HomeMobile from "./components/Home/HomeMobile";
import HomeWeb from "./components/Home/HomeWeb";

function App() {
  const [accessibleScreen, setAccessibleScreen] = useState<boolean>(false);
  const [stationAccessibleOnly, setStationAccessibleOnly] = useState<boolean>(false);

  const screenWidth = useScreenWidth();

  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');


  return (
    <ChakraProvider>
      <Container margin={0} padding={0} display="flex" justifyContent="center" maxW="100vw" maxH="100vh" height="100vh" bg="gray.100">
        {accessibleScreen ? (
          screenWidth < 600 ? (
            <Flex flexDirection="column" w="100%" h="100%" overflow="hidden">
              <HomeMobile 
                departure={departure}
                setDeparture={setDeparture}
                destination={destination}
                setDestination={setDestination}
                startAt={startAt}
                setStartAt={setStartAt}
                endAt={endAt}
                setEndAt={setEndAt}
              />
          </Flex>
          ) : (
            <Flex flexDirection="row" w="100%" h="100%" overflow="hidden">
              <HomeWeb
                departure={departure}
                setDeparture={setDeparture}
                destination={destination}
                setDestination={setDestination}
                startAt={startAt}
                setStartAt={setStartAt}
                endAt={endAt}
                setEndAt={setEndAt}
              />
            </Flex>
          )
        ) : (
          <AccessibleScreen
            setAccessibleScreen={setAccessibleScreen}
            setStationAccessibleOnly={setStationAccessibleOnly}
            stationAccessibleOnly={stationAccessibleOnly}
          />
        )}
      </Container>
    </ChakraProvider>
  );
}

export default App;
