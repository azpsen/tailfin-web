import { Center, Container, Stack } from "@mantine/core";
import { MobileFlightsList } from "@/routes/logbook.flights/flights-list";
import { IconFeather } from "@tabler/icons-react";

export default function Flights() {
  return (
    <>
      <Container visibleFrom="md" h="calc(100vh - 95px)">
        <Stack align="center" justify="center" h="100%">
          <IconFeather size="3rem" />
          <Center>Select a flight</Center>
        </Stack>
      </Container>
      <Container hiddenFrom="md">
        <MobileFlightsList />
      </Container>
    </>
  );
}
