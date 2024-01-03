import { Divider, Grid, Container, ScrollAreaAutosize } from "@mantine/core";
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
          <ScrollAreaAutosize mah="calc(100vh - 95px)">
            <Outlet />
          </ScrollAreaAutosize>
        </Grid.Col>
      </Grid>
      <Container hiddenFrom="md">
        <Outlet />
      </Container>
    </>
  );
}
