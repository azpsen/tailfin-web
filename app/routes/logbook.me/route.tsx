import ErrorDisplay from "@/ui/error-display";
import { client } from "@/util/api";
import { Center, Container, Loader, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export default function Me() {
  const user = useQuery({
    queryKey: ["user"],
    queryFn: async () => await client.get(`users/me`).then((res) => res.data),
  });

  return (
    <Container>
      {user.isLoading ? (
        <Center h="calc(100vh - 95px)">
          <Loader />
        </Center>
      ) : user.isError ? (
        <Center h="calc(100vh - 95px)">
          <ErrorDisplay error="Error Loading User" />
        </Center>
      ) : user.data ? (
        <>
          <Title order={2}>{user.data.username}</Title>
          <Text>Level {user.data.level}</Text>{" "}
        </>
      ) : (
        <Text c="red">Unknown Error</Text>
      )}
    </Container>
  );
}
