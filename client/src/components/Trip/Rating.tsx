import React, { useState } from 'react';
import { Flex, Text, Icon, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';
import { RatingStatus } from '../Shared/enum';
import { useHomeContext } from '../Home/HomeContext';
import { TripData } from '../Shared/types';
import { BASE_API_LINK } from '../Shared/links';

interface RatingProps {
    isOpen: boolean;
    setRatingStatus: (ratingStatus: RatingStatus) => void;
}

interface RatingRequest {
    trip_content: TripData;
    rating: number;
}

const NB_STARS = 5;

const Rating: React.FC<RatingProps> = ({ isOpen, setRatingStatus }) => {
    const [rating, setRating] = useState<number | null>(null);
    const { dataPath } = useHomeContext();
    const [hover, setHover] = useState(0);
    const toast = useToast();

    async function sumbitRating() {
        if (rating === null) {
            toast({
                title: `Veuillez sélectionner une note`,
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        // Send the rating to the backend
        const response = await fetch(`${BASE_API_LINK}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trip_content: dataPath,
                rating: rating,
            } as RatingRequest),
        });

        if (!response.ok) {
            toast({
                title: `Erreur lors de l'envoi du rating`,
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
            setRatingStatus(RatingStatus.Closed);
        } else {
            toast({
                title: `Envoyé avec succès !`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            setRatingStatus(RatingStatus.Rated);
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => setRatingStatus(RatingStatus.Closed)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Donnez votre avis</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex>
                            <Text marginLeft="6%" fontSize="lg" fontWeight="500" mr={2}>
                                Note :
                            </Text>
                            {Array.from({ length: NB_STARS }, (_, index) => (
                                <Icon
                                    as={StarIcon}
                                    key={index}
                                    color={index < (hover || rating || 0) ? 'yellow.400' : 'gray.300'}
                                    cursor="pointer"
                                    onMouseEnter={() => setHover(index + 1)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(index + 1)}
                                    boxSize="24px"
                                />
                            ))}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={sumbitRating} isActive={rating === null}>
                            Envoyer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Rating;
