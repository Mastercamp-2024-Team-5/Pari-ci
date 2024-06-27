import React, { useState } from 'react';
import { Flex, Text, Icon, Textarea, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,ModalBody, ModalFooter, } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';

interface RatingProps {
    totalStars?: number;
    initialRating?: number;
    isOpen: boolean;
    onClose: () => void;
}

const Rating: React.FC<RatingProps>  = ({ totalStars = 5, initialRating = 0, isOpen , onClose  }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);
    const toast = useToast();

    const handleMouseEnter = (index: number) => {
        setHover(index);
    };

    const handleMouseLeave = () => {
        setHover(0);
    };

    const handleClick = (index: number) => {
        setRating(index);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Donnez votre avis</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex>
                            <Text marginLeft="6%" fontSize="lg" fontWeight="500" mr={2}>
                                Note :
                            </Text>
                            {Array.from({ length: totalStars }, (_, index) => (
                                <Icon
                                    as={StarIcon}
                                    key={index}
                                    color={index < (hover || rating) ? 'yellow.400' : 'gray.300'}
                                    cursor="pointer"
                                    onMouseEnter={() => handleMouseEnter(index + 1)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => handleClick(index + 1)}
                                    boxSize="24px"
                                />
                            ))}
                        </Flex>
                        <Textarea
                            focusBorderColor="#5eaf91"
                            fontFamily="Karla"
                            rounded="md"
                            placeholder="Commentaire (optionnel)"
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
                                '-ms-overflow-style': 'none',
                                'scrollbar-width': 'none',
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => {
                            toast({
                                title: `Envoyé avec succès !`,
                                status: 'success',
                                duration: 2000,
                                isClosable: true,
                            });
                            onClose();
                        }}>
                            Envoyer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Rating;
