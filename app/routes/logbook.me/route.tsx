import { useMe } from "@/util/hooks";
import { Container, Title } from "@mantine/core";

export default function Me() {
  const me = useMe();

  return (
    <Container>
      <Title order={2}>{me.data?.username}</Title>
    </Container>
  );
}
