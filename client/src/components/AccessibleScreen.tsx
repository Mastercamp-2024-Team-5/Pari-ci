import React from "react";
import {
  Center,
  Stack,
  Heading,
  Button,
  Container,
  Image,
  Text,
  Box,
  Flex
} from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useScreenWidth from "./useScreenWidth";

// Import images
import accessibility1 from './../assets/accessibility1.jpg';
import accessibility2 from './../assets/accessibility2.jpg';
import accessibility3 from './../assets/accessibility3.jpg';

type AccessibleScreenProps = {
  setAccessibleScreen: (value: boolean) => void;
  setStationAccessibleOnly: (value: boolean) => void;
  stationAccessibleOnly: boolean;
};

const AccessibleScreen = ({ setAccessibleScreen, setStationAccessibleOnly, stationAccessibleOnly }: AccessibleScreenProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const screenWidth = useScreenWidth();

  // Set width and height for the images
  const width_picture = "100%";
  const height_picture = screenWidth<600?"60vw":"30vw"; // Set a fixed height for the images


  return (
    <Flex 
      margin={0}  
      padding={0} 
      flex="1" 
      maxH="100vh" 
      maxW="100vw" 
      bg="F6FBF9" 
      direction={screenWidth<600?"column":"row"}
    >
      <Container flex="1" maxW={screenWidth<600?"100vw":"40vw"} height={screenWidth<600?"60vh":"100vh"}>
        <Center>
          <Stack spacing={8} w="100%">
            <Stack align="center">
              <Heading textAlign={'center'} fontFamily="Karla" marginTop="15%" fontSize="4xl" marginBottom={"5%"}>
                Citymapper
              </Heading>
              <Text  textAlign={'center'} fontFamily="Karla" fontSize="xl" color="32403B" mb={4} marginBottom={screenWidth<600?"15%":"25%"}>
                Proposer seulement les stations accessibles ?
              </Text>
            </Stack>
            <Button
              fontFamily="Karla"
              color="white"
              bg="#84C7AE"
              _hover={{
                bg: "#5eaf91",
              }}
              rounded="md"
              fontSize="lg"
              width="70%"
              alignSelf="center"
              borderRadius="10"
              marginBottom={"5%"}
              p={6}
              onClick={() => (
                setStationAccessibleOnly(true),
                setAccessibleScreen(true)
              )}
            >
              Oui
            </Button>
            <Button
              fontFamily="Karla"
              color="white"
              bg="#84C7AE"
              _hover={{
                bg: "#5eaf91",
              }}
              rounded="md"
              fontSize="lg"
              width="70%"
              alignSelf="center"
              borderRadius="10"
              p={6}
              onClick={() => (
                setStationAccessibleOnly(false),
                setAccessibleScreen(true)
              )}
            >
              Non
            </Button>
          </Stack>
        </Center>
      </Container>
      <Container
        flex="1"
        maxW={screenWidth<600?"100vw":"60vw"}
        margin="0"
        padding={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={screenWidth<600?"40vh":"100vh"}
      >
      <Box height={screenWidth<600?"40vh":"60vh"} width="100%" display="flex" alignItems="center" justifyContent="center"  margin={0} padding={0}>
        <Slider {...settings} style={{ width: "70%", height: "100%"}}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%" margin={0} padding={0}>
            <Image 
              src={accessibility1} 
              alt="Image 1" 
              style={{ 
                width: width_picture, 
                height: height_picture, 
                objectFit: "contain",  // Ensure the image fits within the container without being cut
                objectPosition: "center" // Center the image
              }} 
            />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Image 
              src={accessibility2} 
              alt="Image 2" 
              style={{ 
                width: width_picture, 
                height: height_picture, 
                objectFit: "contain",  // Ensure the image fits within the container without being cut
                objectPosition: "center" // Center the image
              }} 
            />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Image 
              src={accessibility3} 
              alt="Image 3" 
              style={{ 
                width: width_picture, 
                height: height_picture, 
                objectFit: "contain",  // Ensure the image fits within the container without being cut
                objectPosition: "center" // Center the image
              }} 
            />
          </Box>
          </Slider>
        </Box>
      </Container>
    </Flex>
  );
};

export default AccessibleScreen;
