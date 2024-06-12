import {
    Center,
    Stack,
    Heading,
    VStack,
    FormControl,
    Input,
    InputGroup,
    Button,
    Container,
    Image
  } from "@chakra-ui/react";
  import Icon from "./Icon";
  
  
  const AccessibleScreen = () => {
    return (
      <>
        <Container flex="1" bg="F6FBF9" maxW="40vw" height="100vh"> 
          <Center height="100%"> 
            <Stack spacing={8} w="100%" align="center">
              <VStack spacing={15} w="90%" justifyContent="center" align="center"> 
                <Heading fontFamily="Karla" fontSize="5xl" textAlign="center" marginBottom={"15%"}>
                  Proposer seulement les stations accessibles ?
                </Heading>
              </VStack>
              <Button
                fontFamily="Karla"
                bg="#84C7AE"
                color="white"
                _hover={{
                  bg: "#5eaf91",
                }}
                rounded="md"
                fontSize="lg"
                width="70%"
                alignSelf="center"
                borderRadius="10"
                p={6} // Added padding
              >
                Oui
              </Button>
              <Button
                fontFamily="Karla"
                bg="#84C7AE"
                color="white"
                _hover={{
                  bg: "#5eaf91",
                }}
                rounded="md"
                fontSize="lg"
                width="70%"
                alignSelf="center"
                borderRadius="10"
                p={6} 
                marginBottom={"15%"}
              >
                Non
              </Button>
            </Stack>
          </Center>
        </Container>
        <Container 
            flex="1" 
            maxW="60vw" 
            margin={0} 
            padding={0} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
        >
            <Stack spacing={6}>
            <Image 
                src="https://media.giphy.com/media/WU0J9RYTNjKa6XrqB3/giphy.gif" 
                alt="Accessibility GIF"
                boxSize="480px" 
                objectFit="cover"
            />
            <Button
                fontFamily="Karla"
                bg="#84C7AE"
                color="white"
                _hover={{
                bg: "#5eaf91",
                }}
                rounded="md"
                fontSize="lg"
                width="80%"
                alignSelf="flex-end"
                borderRadius="10"
                p={6} 
            >
                Suivant
            </Button>
            </Stack>
        </Container>
      </>
    );
  };
  
  export default AccessibleScreen;
  