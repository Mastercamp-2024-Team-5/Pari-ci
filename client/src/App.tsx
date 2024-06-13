import { Container } from "@chakra-ui/react";
import LeftSearch from "./components/LeftSearch";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import MapScreen from "./components/MapScreen";
import React, { useState } from "react";
import AccessibleScreen from "./components/AccessibleScreen";
import useScreenWidth from "./components/useScreenWidth";

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
      <Container margin={0} padding={0} display="flex" justifyContent="space-between" maxW="100vw" maxH="100vh" h={screenWidth<600?"120vh":"100vh"} bg="gray.100">
        {
          accessibleScreen ? (
            <Flex margin={0} padding={0} flex={1}  h="100vh"  direction={screenWidth<600?"column":'row'}>
              {
                screenWidth<600 && (
                  <Container flex="1" bg="red.400" maxH="25vh" margin={0} padding={0}>
                    <MapScreen />
                  </Container>
                )
              }
              <Container flex="1" bg="F6FBF9" maxW={screenWidth<600?"100vw":"33vw"} maxH={screenWidth<600?"65vh":"100vh"}>
                <LeftSearch departure={departure} setDeparture={setDeparture} destination={destination} setDestination={setDestination} startAt={startAt} setStartAt={setStartAt} endAt={endAt} setEndAt={setEndAt}/>
              </Container>
              {
                screenWidth>=600 && (
                  <Container flex="1" bg="red.400" maxW={screenWidth<600?"100vw":"67vw"} maxH={screenWidth<600?"55vh":"100vh"} margin={0} padding={0}>
                    <MapScreen />
                </Container>
                )
              }
            </Flex>
          ):(
            <AccessibleScreen setAccessibleScreen={setAccessibleScreen} setStationAccessibleOnly={setStationAccessibleOnly} stationAccessibleOnly={stationAccessibleOnly}/>  
          )

        }
      </Container>
    </ChakraProvider>
  );
}

export default App;
