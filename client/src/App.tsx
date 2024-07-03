import { ChakraProvider, Container } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./components/Home/Home";
import { getCookie } from "./manageCookies";
import { useEffect, useState } from "react";
import { HomeProvider } from "./components/Home/HomeContext";
import AccessibleScreen from "./components/Pages/WheelchairConvenientPage";
import { BASE_API_LINK } from "./components/Shared/links";

const router = createBrowserRouter(
  [
    {
      index: true,
      element: <Home />,
      ErrorBoundary: () => <div>
        <center>
          <h1>404</h1>
          <p>Page not found</p>
        </center>
      </div>
    },
    {
      path: "/path/:id?",
      element: <Home />,
      loader: async ({ params }) => {
        return fetch(BASE_API_LINK + "/share/" + params.id).then((response) => {
          if (!response.ok) {
            return null;
          }
          return response.json();
        });
      }
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
          <AccessibleScreen setAccessibleScreen={setAccessibleScreen} />
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
