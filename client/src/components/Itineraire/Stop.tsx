import { Box, Flex, Text } from "@chakra-ui/react";

const Stop = ({ stop, line, color, textColor }: { stop: string; line: string; textColor: string; color: string }) => {

    return (
        <Flex 
            flex={1} 
            maxW={"100%"} 
            direction={"row"} 
            marginX={"5%"} 
            border={"2px solid"}
            borderColor={"#273DFF"}
            borderRadius={"10px"}
            paddingX={6}
            paddingY={3}
            bg={"white"}
        >
            <Box 
                display={"flex"} // Use flex display to center the content
                alignItems={"center"} // Center the content vertically
                justifyContent={"center"} // Center the content horizontally
                bgColor={color} 
                borderRadius={"50%"} 
                height={"40px"} 
                width={"40px"}
                alignSelf={"center"}
                overflow={"hidden"}
            >
                <Text 
                    fontFamily={"Karla"} 
                    fontSize={"2xl"} // Font size
                    fontWeight={"bold"} // Font weight
                    textColor={textColor} 
                    textAlign={"center"}
                    lineHeight={"50px"} // Ensure the text is centered vertically
                >
                    {line}
                </Text>
            </Box>
            <Text 
                marginLeft={"5%"} 
                width={"85%"} 
                alignContent={"center"} 
                justifyContent={"center"} 
                textColor={textColor} 
                borderRadius={"50%"}
                fontSize={"xl"} // Increased font size
                fontWeight={"500"} // Added font weight
            >
                {stop}
            </Text>
        </Flex>
    );

}

export default Stop;
