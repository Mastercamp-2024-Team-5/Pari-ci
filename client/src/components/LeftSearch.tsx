import React from 'react';
import { Center, Stack, Heading, Text, VStack, FormControl, Input, InputGroup, Button } from '@chakra-ui/react';

const LeftSearch = () => {
    return (
        <Center>
            <Stack spacing={8} w="100%">
                <Stack align="center">
                    <Heading fontFamily="Karla" marginTop="15%" fontSize="4xl">
                        Citymapper
                    </Heading>
                    <Text fontFamily="Karla" fontSize="lg" color="32403B" mb={4} marginBottom="15%">
                        Subtitle
                    </Text>
                </Stack>
                <VStack spacing={15} w="90%" alignSelf="center">
                    <FormControl>
                        <Input
                            focusBorderColor="#5eaf91"
                            fontFamily="Karla"
                            variant="outline"
                            border="2px"
                            borderColor="gray.200"
                            rounded="md"
                            type="text"
                            placeholder="Départ"
                            fontSize="lg"
                            p={8}
                            bg="white"
                        />
                    </FormControl>
                    <FormControl>
                        <InputGroup size="md">
                            <Input
                                focusBorderColor="#5eaf91"
                                fontFamily="Karla"
                                variant="outline"
                                border="2px"
                                borderColor="gray.200"
                                rounded="md"
                                type="text"
                                placeholder="Destination"
                                fontSize="lg"
                                p={8}
                                bg="white"
                            />
                        </InputGroup>
                    </FormControl>
                </VStack>
                <Button
                    fontFamily="Karla"
                    bg="#84C7AE"
                    color="white"
                    _hover={{
                        bg: '#5eaf91',
                    }}
                    rounded="md"
                    fontSize="xl"
                    width="60%"
                    alignSelf="center"
                    borderRadius="15"
                    p={8} // Added padding
                >
                    Trouver l’itinéraire
                </Button>
            </Stack>
        </Center>
    );
};

export default LeftSearch;