import { Box, Flex, Text } from "@chakra-ui/react";

const StopDetail = ({ stop, line, color, textColor, depart, arrivé, direction }: { stop: string; line: string; textColor: string; color: string, depart: string, arrivé: string, direction: string }) => {

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
                display={"flex"} // Use flex display to center the content
                alignItems={"center"} // Center the content vertically
                justifyContent={"center"} // Center the content horizontally
                bgColor={color} 
                borderRadius={"50%"} 
                height={"50px"} 
                width={"50px"}
                alignSelf={"center"}
                overflow={"hidden"}
            >
                <Text 
                    fontFamily={"Karla"} 
                    fontSize={"3xl"} // Font size
                    fontWeight={"bold"} // Font weight
                    textColor={textColor} 
                    textAlign={"center"}
                    lineHeight={"50px"} // Ensure the text is centered vertically
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
                flex={1} // Make sure the flex container takes the remaining space
            >
                <Flex 
                    marginLeft={"5%"} 
                    maxW={"100%"} 
                    textColor={textColor} 
                    borderRadius={"50%"}
                    fontSize={"xl"} // Font size
                    fontWeight={"500"} // Font weight
                    direction={"column"}
                >
                    <Text 
                        margin={"0"} 
                        textColor={textColor} 
                        fontSize={"md"} // Font size
                        fontWeight={"700"} // Font weight
                    >
                        {stop}
                    </Text>
                    <Text 
                        margin={"0"} 
                        textColor={textColor} 
                        fontSize={"md"} // Font size
                        fontWeight={"500"} // Font weight
                        whiteSpace={"nowrap"} // Prevents the text from wrapping
                    >
                        Vers {direction}
                    </Text>
                </Flex>
                <Text
                    margin={"0"} 
                    marginLeft={"5%"}
                    textColor={textColor} 
                    borderRadius={"50%"}
                    fontSize={"md"} // Font size
                    fontWeight={"500"} // Font weight
                    whiteSpace={"nowrap"} // Prevents the text from wrapping
                >
                    Départ à {depart}
                </Text>
            </Flex>
        </Flex>
    );

}

export default StopDetail;
