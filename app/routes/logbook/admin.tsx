import { Container, Group, Title } from "@mantine/core";

export default function Admin() {
  return (
    <>
      <Container>
        <Group justify="space-between" align="center" grow my="lg">
          <Title order={2}>Admin</Title>
        </Group>
      </Container>
    </>
  );
}
