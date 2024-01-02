import { Divider, Grid, Container } from "@mantine/core";
import { Outlet } from "@remix-run/react";
import { FlightsList } from "./flights-list";

export default function FlightsLayout() {
  return (
    <>
      <Grid h="100%" visibleFrom="md">
        <Grid.Col span={3}>
          <FlightsList />
        </Grid.Col>
        <Divider orientation="vertical" m="sm" />
        <Grid.Col span="auto">
          <Outlet />
        </Grid.Col>
      </Grid>
      <Container hiddenFrom="md">
        <Outlet />
      </Container>
    </>
  );
}
