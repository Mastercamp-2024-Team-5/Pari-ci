import { ArrowLongLeft } from "../icons/ArrowLongLeft";
import { Data } from "../Shared/types";
import { Box, Heading, Text, Button, VStack, Flex, Spacer } from "@chakra-ui/react";

type Props = {
    results: Data | null;
    isDepartureFocus: boolean;
};

export function AutocompleteResults({ results, isDepartureFocus }: Props) {
    console.log(results);
    if (!results || results.hits.length === 0) {
        return null;
    }

    return (
        <Box px="12" py="10">
            <Heading as="h2" size="xl" color="gray.800" fontWeight="bold">
                Resultats:
            </Heading>
            <Text fontSize="lg" fontWeight="medium" color="gray.500">
                {isDepartureFocus ? "Départ" : "Arrivée"}
            </Text>
            <VStack py="8" spacing="2" align="stretch">
                {results.hits.map((hit) => (
                    <Button
                        key={hit.id}
                        width="full"
                        borderWidth="1px"
                        py="1.5"
                        px="2"
                        rounded="md"
                        textAlign="left"
                        display="flex"
                        gap="2"
                        alignItems="center"
                    >
                        <Text>{hit.route_short_names}</Text>
                        <Text>{hit.stop_name}</Text>
                        <Spacer />
                        <Box ml="auto">
                            <ArrowLongLeft />
                        </Box>
                    </Button>
                ))}
            </VStack>
        </Box>
    );
}
