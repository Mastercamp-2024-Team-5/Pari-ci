import { Data } from "../Shared/types";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

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
    <Box px={12} py={10}>
      <Heading as="h2" size="lg" color="gray.800" fontWeight="bold">Resultats:</Heading>
      <Text fontSize="lg" fontWeight="medium" color="gray.500">
        {isDepartureFocus ? "Départ" : "Arrivée"}
      </Text>
      <VStack spacing={2} py={8} align="stretch">
        {results.hits.map((hit) => (
          <Button
            key={hit.id}
            width="full"
            border="1px"
            borderColor="gray.200"
            py={1.5}
            px={2}
            borderRadius="md"
            textAlign="left"
            display="flex"
            gap={2}
            variant="outline"
          >
            <span>{hit.route_short_names}</span>
            {hit.stop_name}
          </Button>
        ))}
      </VStack>
    </Box>
  );
}
