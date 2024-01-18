import { Divider, Grid, Container, ScrollArea } from "@mantine/core";
import { Outlet } from "@remix-run/react";
import { FlightsList } from "./flights-list";

export default function FlightsLayout() {
  return (
    <>
      <Grid h="100%" visibleFrom="lg">
        <Grid.Col span={4}>
          <FlightsList />
        </Grid.Col>
        <Divider orientation="vertical" m="sm" />
        <Grid.Col span="auto">
          <ScrollArea.Autosize mah="calc(100vh - 95px)">
            <Outlet />
          </ScrollArea.Autosize>
        </Grid.Col>
      </Grid>
      <Container hiddenFrom="lg" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Outlet />
      </Container>
    </>
  );
}
