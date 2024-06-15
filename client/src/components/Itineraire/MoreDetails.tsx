import {
  Center,
  Stack,
  Heading,
  Button,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import useScreenWidth from "../Shared/useScreenWidth";
import MapScreen from "../Map/MapScreen";
import StopDetail from "./StopDetail";
import { useState } from "react";
import Icon from "../Shared/Icon";

const MoreDetails = (
    { ligne, arret1, arret2, depart, arrive, direction, nbrArrets, color, textColor, correspondance}:
    { 
        ligne: string;
        arret1: string;
        arret2: string;
        depart: string;
        arrive: string;
        direction: string;
        nbrArrets: number;
        color: string;
        textColor: string;
        correspondance: boolean;
    }

) => {
  return (
    <Box>
      <Text fontSize="xl" fontWeight="550" textAlign="start" marginTop="4" marginLeft={"4%"}>
        {correspondance?"Correspondance":"Prenez la ligne"} {ligne} à {arret1}
      </Text>
      <Flex 
        flex={1} 
        direction={"column"} 
        w="100%" 
        h="100%" 
        bg={"white"} 
        padding={"2%"} 
        marginTop={5} 
        border={"2px solid"}
        borderColor={"black"}
        borderRadius={"10px"}
        >
        <StopDetail 
          stop={arret1} 
          line={ligne} 
          color={color} 
          textColor={textColor} 
          depart={depart} 
          direction={direction}
          arrive={false}
        />
        <Box w="100%" display="flex" alignItems="center" justifyContent="flex-start">
          <Icon item="barre" size="30px" color={color} />
          <Text marginLeft="6%" fontSize="md" fontWeight="500">
            {nbrArrets} arrêts
          </Text>
        </Box>
        <StopDetail 
          stop={arret2}
          line={ligne}
          color={color}
          textColor={textColor}
          depart={arrive}
          direction={direction}
          arrive={true}
        />
    </Flex>
    </Box>
  );
};

export default MoreDetails;