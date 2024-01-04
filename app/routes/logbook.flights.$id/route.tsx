import ErrorDisplay from "@/ui/error-display";
import { client } from "@/util/api";
import { Center, Container, List, Loader, Stack, Text } from "@mantine/core";
import { useParams } from "@remix-run/react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

export default function Flight() {
  const params = useParams();

  const flight = useQuery({
    queryKey: [params.id],
    queryFn: async () =>
      await client.get(`/flights/${params.id}`).then((res) => res.data),
  });

  return (
    <Container>
      <Stack h="calc(100vh - 95px)">
        {flight.isError ? (
          <ErrorDisplay error="Error Fetching Flight" />
        ) : flight.isPending ? (
          <Center h="100%">
            <Loader />
          </Center>
        ) : (
          <List>
            {Object.entries(flight.data).map(([key, value]) =>
              value && value.length !== 0 ? (
                <List.Item key={key}>
                  <Text span>
                    <Text span fw={700}>
                      {key}
                    </Text>
                    : <Text span>{value}</Text>
                  </Text>
                </List.Item>
              ) : null
            )}
          </List>
        )}
      </Stack>
    </Container>
  );
}
