import { client } from "@/util/api";
import { List, Stack, Text } from "@mantine/core";
import { useParams } from "@remix-run/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Flight() {
  const params = useParams();

  const queryClient = useQueryClient();
  const flight = useQuery({
    queryKey: [params.id],
    queryFn: async () =>
      await client.get(`/flights/${params.id}`).then((res) => res.data),
  });

  return (
    <Stack h="calc(100vh - 95px)" m="0" p="0">
      {flight.isError ? (
        <Text c="red">Error fetching flight</Text>
      ) : flight.isPending ? (
        <Text>Loading...</Text>
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
  );
}
