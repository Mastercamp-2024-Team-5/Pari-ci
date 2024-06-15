import { Box, Flex, Text } from "@chakra-ui/react";

const StopDetail = ({ stop, line, color, textColor, depart, direction }: { stop: string; line: string; textColor: string; color: string, depart: string, direction: string }) => {

    return (
        <Flex 
            flex={1} 
            maxW={"100%"} 
            direction={"row"} 
            borderRadius={"10px"}
            paddingX={2}
            paddingY={0}
            bg={"white"}
            margin={0}
        >
            <Box 
                display={"flex"} 
                alignItems={"center"} 
                justifyContent={"center"} 
                bgColor={color} 
                borderRadius={"50%"} 
                height={"50px"} 
                width={"50px"}
                alignSelf={"center"}
                overflow={"hidden"}
            >
                <Text 
                    fontFamily={"Karla"} 
                    fontSize={"3xl"} 
                    fontWeight={"bold"} 
                    textColor={textColor} 
                    textAlign={"center"}
                    lineHeight={"50px"} 
                >
                    {line}
                </Text>
            </Box>
            <Flex
                direction={"row"}
                paddingX={2}
                paddingY={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                flex={1} 
            >
                <Flex 
                    marginLeft={"5%"} 
                    maxW={"100%"} 
                    textColor={textColor} 
                    borderRadius={"50%"}
                    fontSize={"xl"}
                    fontWeight={"500"}
                    direction={"column"}
                >
                    <Text 
                        margin={"0"} 
                        textColor={textColor} 
                        fontSize={"md"} 
                        fontWeight={"700"}
                    >
                        {stop}
                    </Text>
                    <Text 
                        margin={"0"} 
                        textColor={textColor} 
                        fontSize={"md"}
                        fontWeight={"500"}
                        whiteSpace={"nowrap"}
                    >
                        Vers {direction}
                    </Text>
                </Flex>
                <Text
                    margin={"0"} 
                    marginLeft={"5%"}
                    textColor={textColor} 
                    borderRadius={"50%"}
                    fontSize={"md"} 
                    fontWeight={"500"}
                    whiteSpace={"nowrap"}
                >
                    Départ à {depart}
                </Text>
            </Flex>
        </Flex>
    );

}

export default StopDetail;
