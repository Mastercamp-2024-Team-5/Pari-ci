import React from 'react';
import { Flex, Text } from "@chakra-ui/react";

interface StationSearchProps {
  stationName: string;
  lines: string[];
}

const StationSearch: React.FC<StationSearchProps> = ({stationName, lines}) => {
  return (
    <Flex maxW={"80%"}>
      <Text>{stationName}</Text>
      {lines.map((line, index) => (
        <Text key={index}>{line}</Text>
      ))}
    </Flex>
  );
}

export default StationSearch;
