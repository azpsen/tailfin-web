import { client } from "@/util/api";
import { useAuth } from "@/util/auth";
import { Center, Container, List, Loader, Stack, Text } from "@mantine/core";
import { useNavigate, useParams } from "@remix-run/react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";

export default function Flight() {
  const params = useParams();

  const flight = useQuery({
    queryKey: [params.id],
    queryFn: async () =>
      await client.get(`/flights/${params.id}`).then((res) => res.data),
    retry: (failureCount, error: AxiosError) => {
      return !error || error.response?.status !== 401;
    },
  });

  const navigate = useNavigate();
  const { clearUser } = useAuth();

  useEffect(() => {
    if (
      flight.isError &&
      flight.error instanceof AxiosError &&
      flight.error.response?.status === 401
    ) {
      clearUser();
      navigate("/login");
    }
  }, [flight]);

  return (
    <Container>
      <Stack h="calc(100vh - 95px)">
        {flight.isError ? (
          <Stack align="center" justify="center" h="100%" m="0" p="0">
            <Text c="red">
              <IconAlertTriangle size="3rem" />
            </Text>
            <Text c="red">Error fetching flight</Text>
          </Stack>
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
