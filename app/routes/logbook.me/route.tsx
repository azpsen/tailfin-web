import { client } from "@/util/api";
import { Container, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export default function Me() {
  const user = useQuery({
    queryKey: ["user"],
    queryFn: async () => await client.get(`users/me`).then((res) => res.data),
  });

  return (
    <Container>
      <Title order={2}>{user.data.username}</Title>
      <Text>Level {user.data.level}</Text>
    </Container>
  );
}
