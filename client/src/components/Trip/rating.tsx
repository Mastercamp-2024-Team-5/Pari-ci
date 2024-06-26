import React, { useState } from 'react';
import {Flex, Text, Icon, Textarea, Button} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';
import {useHomeContext} from "../Home/HomeContext.tsx";

const Rating = ({ totalStars = 5, initialRating = 0 }) => {

    const { setRated, setShowRating} = useHomeContext();
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);
    const toast = useToast();

    const handleMouseEnter = (index: React.SetStateAction<number>) => {
        setHover(index);
    };

    const handleMouseLeave = () => {
        setHover(0);
    };

    const handleClick = (index: React.SetStateAction<number>) => {
        setRating(index);
    };

    return (
        <>
            <Flex>

                <Text
                    marginLeft="6%"
                    fontSize="lg"
                    fontWeight="500"
                    mr={2}
                >
                    Note :
                </Text>

                {Array.from({length: totalStars}, (_, index) => (
                    <Icon
                        as={StarIcon}
                        key={index}
                        color={index < (hover || rating) ? 'yellow.400' : 'gray.300'}
                        cursor="pointer"
                        onMouseEnter={() => handleMouseEnter(index + 1)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(index + 1)}
                        boxSize="24px"/>
                ))}
            </Flex>
            <Textarea
                focusBorderColor="#5eaf91"
                fontFamily="Karla"
                rounded="md"
                placeholder="Commentaire"
                fontSize="lg"
                bg="white"
                borderRadius="15"
                resize="none"
                marginLeft="5%"
                marginRight="5%"
                width="90%"
                sx={{
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none',  // IE and Edge
                    'scrollbar-width': 'none',  // Firefox
                }}
            />
            <Button
                bg="#C78484"
                color="white"
                padding={7}
                fontSize={"2xl"}
                whiteSpace="wrap"
                width={"45%"}
                alignSelf="center"
                borderRadius="15px"
                margin={0}
                marginTop={"2%"}
                onClick={() => {
                    setShowRating(false);
                    setRated(true);
                    toast({
                        title: `Envoyé avec succès !`,
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    });
                }}
            >
                Envoyer
            </Button>
        </>
    );
};

export default Rating;
