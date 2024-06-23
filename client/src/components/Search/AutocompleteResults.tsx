import { Data, Hit } from "../Shared/types";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { useHomeContext } from "../Home/HomeContext";
import Icon from "../Shared/Icon";

type Props = {
  results: Data | null;
  isDepartureFocus: boolean;
  setIsDepartureFocus: (value: boolean) => void;
  setIsDestinationFocus: (value: boolean) => void;
};

export function AutocompleteResults({
  results,
  isDepartureFocus,
  setIsDepartureFocus,
  setIsDestinationFocus,
}: Props) {
  const { setDeparture, setDestination } = useHomeContext();

  if (!results || results.hits.length === 0) {
    return null;
  }

  const handleSelect = (hit: Hit) => {
    if (isDepartureFocus) {
      setDeparture(hit.stop_name);
      setIsDepartureFocus(false);
    } else {
      setDestination(hit.stop_name);
      setIsDestinationFocus(false);
    }
  };

  return (
      <Box px={12} py={10} height="100vh" width="100%" overflowY="scroll">
        <Heading as="h2" size="lg" color="gray.800" fontWeight="bold">
          Résultats :
        </Heading>
        <Text fontSize="md" fontWeight="medium" color="gray.500">
          {isDepartureFocus ? "Départ" : "Arrivée"}
        </Text>
        <VStack spacing={2} py={8} align="stretch">
          {results.hits.map((hit) => (
              <Button
                  key={hit.id}
                  width="full"
                  border="1px"
                  borderColor="gray.300"
                  py={1.5}
                  px={2}
                  borderRadius="md"
                  textAlign="left"
                  justifyContent="flex-start"
                  display="flex"
                  alignItems="center"
                  variant="outline"
                  onClick={() => handleSelect(hit)}
              >
                {hit.route_short_names.split(',').map((route, index) => (
                    <Icon key={route.trim()} item={route.trim()} size="24px" style={{ marginRight: index !== hit.route_short_names.split(',').length - 1 ? '-4px' : '8px' }} />
                ))}
                {hit.stop_name}
              </Button>
          ))}
        </VStack>
      </Box>
  );
}
