import { ChakraProvider, Container } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./components/Home/Home";
import { getCookie } from "./manageCookies";
import { useEffect, useState } from "react";
import { HomeProvider } from "./components/Home/HomeContext";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,

    },
    {
      path: "/path/:id?",
      element: <Home />,
      loader: () => null
    }
  ]
)



function App() {

  const [accessibleScreen, setAccessibleScreen] = useState<boolean>(true);

  useEffect(() => {
    const cookie = getCookie("AccessibleStationOnly");
    if (cookie === null) {
      setAccessibleScreen(true);
    } else {
      setAccessibleScreen(false);
    }
  }, []);

  if (accessibleScreen) {
    return (
      <ChakraProvider>
        <Container
          margin={0}
          padding={0}
          display="flex"
          justifyContent="center"
          maxW="100vw"
          maxH="100vh"
          height="100vh"
          bg="gray.100"
        >
          {/* <AccessibleScreen setAccessibleScreen={setAccessibleScreen} /> */}
        </Container>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Container
        margin={0}
        padding={0}
        display="flex"
        justifyContent="center"
        maxW="100vw"
        maxH="100vh"
        height="100vh"
        bg="gray.100"
      >
        <HomeProvider>
          <RouterProvider router={router} />
        </HomeProvider>
      </Container>
    </ChakraProvider >
  );
}

export default App;
