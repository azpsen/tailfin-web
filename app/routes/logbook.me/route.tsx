import { useAuth } from "@/util/auth";
import { Container, Title } from "@mantine/core";

export default function Me() {
  const { user } = useAuth();

  return (
    <Container>
      <Title order={2}>{user}</Title>
    </Container>
  );
}
