import { ChakraProvider,  Container} from "@chakra-ui/react";
import React, { useState } from "react";
import AccessibleScreen from "./components/AccessibleScreen";
import Home from "./components/Home/Home";

function App() {
  const [accessibleScreen, setAccessibleScreen] = useState<boolean>(false);
  const [stationAccessibleOnly, setStationAccessibleOnly] = useState<boolean>(false);

  return (
    <ChakraProvider>
      <Container margin={0} padding={0} display="flex" justifyContent="center" maxW="100vw" maxH="100vh" height="100vh" bg="gray.100">
        {accessibleScreen ? (
          <Home/>
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
