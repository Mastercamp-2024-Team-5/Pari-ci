import {
    Center,
    Stack,
    Heading,
    Button,
    Flex,
    Text,
    Box
} from "@chakra-ui/react";
import Stop from "./Stop";
import useScreenWidth from "./../useScreenWidth";  
import MapScreen from "../MapScreen";
import StopDetail from "./StopDetail";
import { useState } from "react";

const Itineraire = ({
    departure,
    destination,
    startAt,
    endAt,
    setItininerairePage
}: {
    departure: string,
    destination: string,
    startAt: string,
    endAt: string,
    setItininerairePage: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const screenWidth = useScreenWidth();

    const [moreDetails, setMoreDetails] = useState(false);

    return (
        <Flex flex={1} direction="row" w="100%" h="100%" overflow="hidden">
            <Box
                bg="F6FBF9"
                w="33%"
                h="100%"
                p={4}
            >
                <Center>
                    <Stack spacing={0} w="100%">
                        <Stack align="center" margin={0} padding={0}>
                            <Heading fontFamily="Karla" fontWeight="600" marginTop="15%" fontSize={screenWidth < 600 ? "5xl" : "4xl"} marginBottom={"5%"}>
                                CITYMAPPER
                            </Heading>
                        </Stack>
                        <Stack spacing={5}> {/* Use Stack with spacing set to 0 */}
                            <Stack marginX={"0%"} maxW={"100%"}>
                                <Stop stop={departure} line={"7"} color={"pink.200"} textColor={"black"} />
                                <Stop stop={destination} line={"7"} color={"pink.200"} textColor={"black"} />
                            </Stack>
                            <Heading textDecoration="underline" textAlign="start" fontFamily="Karla" fontWeight="600" fontSize={screenWidth < 600 ? "4xl" : "3xl"} marginY="0" marginLeft="5%">
                                Itinéraire :
                            </Heading>
                            <Flex marginY={0}maxW={"100%"} border={"2px solid"} borderColor={"273DFF"} marginX={"5%"} bg={'white'} borderRadius={"10"} direction={"column"} padding={5} paddingY={4}>
                                <Heading fontFamily="Karla" fontWeight="550" fontSize="3xl" marginBottom="2%">
                                    Arrivé à xx:xx                            
                                </Heading>
                                <Stack spacing={0}> {/* Use Stack with spacing set to 0 */}
                                    <StopDetail stop={"Gare de Lyon"} line={"7"} color={"pink.200"} textColor={"black"} depart={"12:00"} direction={"Mairie d'Ivry"} />
                                    <StopDetail stop={"Mairie d'Ivry"} line={"7"} color={"pink.200"} textColor={"black"} depart={"12:30"} direction={"La Courneuve"} />
                                </Stack>
                                <Text onClick={(prev)=>setMoreDetails(!prev)} fontSize={"md"} color={"#273DFF"} textDecoration={"underline"} alignSelf={"end"} _hover={{ cursor: "pointer" }}>
                                    Plus de détails
                                </Text>
                            </Flex>
                            
                        </Stack>
                        <Button
                            bg="#C78484" // Set the background color
                            color="white" // Set the text color
                            onClick={() => setItininerairePage(false)}
                            padding={7}
                            fontSize={screenWidth < 600 ? '3xl' : '2xl'}
                            whiteSpace="wrap"
                            width={"45%"}
                            alignSelf="center"
                            borderRadius="15"
                            margin={0}
                            marginTop={"5%"}
                        >
                            Annuler
                        </Button>
                        
                    </Stack>
                </Center>
            </Box>
            <Box
                w="67%"
                h="100%"
                display="flex"
            >
                <MapScreen />
            </Box>
        </Flex>
    );
}

export default Itineraire;
