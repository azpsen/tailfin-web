import { VerticalLogItem } from "@/ui/display/log-item";
import ErrorDisplay from "@/ui/error-display";
import { useApi } from "@/util/api";
import {
  Center,
  Container,
  Grid,
  Loader,
  ScrollArea,
  Stack,
  Title,
} from "@mantine/core";
import { useParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";

export default function Flight() {
  const params = useParams();

  const client = useApi();

  const flight = useQuery({
    queryKey: [params.id],
    queryFn: async () =>
      await client.get(`/flights/${params.id}`).then((res) => res.data),
  });

  const log = flight.data;

  return (
    // <Container>
    <Stack h="calc(100vh-95px)">
      {flight.isError ? (
        <Center h="calc(100vh - 95px)">
          <ErrorDisplay error="Error Fetching Flight" />
        </Center>
      ) : flight.isPending ? (
        <Center h="calc(100vh - 95px)">
          <Loader />
        </Center>
      ) : flight.data ? (
        <>
          <Title order={3} py="lg" style={{ textAlign: "center" }}>
            Flight Log
          </Title>
          <ScrollArea h="calc(100vh - 95px - 110px)" m="0" p="0">
            <Container h="100%">
              <Grid justify="center">
                <Grid.Col span={6}>
                  <VerticalLogItem label="Date" content={log.date} date />
                </Grid.Col>
                <Grid.Col span={6}>
                  <VerticalLogItem label="Aircraft" content={log.aircraft} />
                </Grid.Col>
                {log.waypoint_from || log.waypoint_to ? (
                  <>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Waypoint From"
                        content={log.waypoint_from}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Waypoint To"
                        content={log.waypoint_to}
                      />
                    </Grid.Col>
                  </>
                ) : null}
                {log.route ? (
                  <>
                    <Grid.Col span={12}>
                      <VerticalLogItem label="Route" content={log.route} />
                    </Grid.Col>
                  </>
                ) : null}
                {log.hobbs_start || log.hobbs_end ? (
                  <>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Hobbs Start"
                        content={log.hobbs_start}
                        hours
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Hobbs End"
                        content={log.hobbs_end}
                        hours
                      />
                    </Grid.Col>
                  </>
                ) : null}
                {log.tach_start || log.tach_end ? (
                  <>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Tach Start"
                        content={log.tach_start}
                        hours
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Tach End"
                        content={log.tach_end}
                        hours
                      />
                    </Grid.Col>
                  </>
                ) : null}
                {log.time_start || log.time_off ? (
                  <>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Time Start"
                        content={log.time_start}
                        time
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Time Off"
                        content={log.time_off}
                        time
                      />
                    </Grid.Col>
                  </>
                ) : null}
                {log.time_down || log.time_stop ? (
                  <>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Time Down"
                        content={log.time_down}
                        time
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Time Stop"
                        content={log.time_stop}
                        time
                      />
                    </Grid.Col>
                  </>
                ) : null}
                <Grid.Col span={4}>
                  <VerticalLogItem
                    label="Total Time"
                    content={log.time_total}
                    hours
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <VerticalLogItem
                    label="Time Solo"
                    content={log.time_solo}
                    hours
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <VerticalLogItem
                    label="Time Night"
                    content={log.time_night}
                    hours
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <VerticalLogItem
                    label="Time PIC"
                    content={log.time_pic}
                    hours
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <VerticalLogItem
                    label="Time SIC"
                    content={log.time_sic}
                    hours
                  />
                </Grid.Col>
                {log.time_xc && log.dist_xc ? (
                  <>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Time Cross-Country"
                        content={log.time_xc}
                        hours
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <VerticalLogItem
                        label="Cross-Country Distance"
                        content={log.dist_xc}
                        decimal={2}
                      />
                    </Grid.Col>
                  </>
                ) : null}
                <Grid.Col span={6}>
                  <VerticalLogItem
                    label="Takeoffs (Day)"
                    content={log.takeoffs_day}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <VerticalLogItem
                    label="Landings (Day)"
                    content={log.landings_day}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <VerticalLogItem
                    label="Takeoffs (Night)"
                    content={log.takeoffs_night}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <VerticalLogItem
                    label="Landings (Night)"
                    content={log.landings_night}
                  />
                </Grid.Col>
                {log.time_instrument ||
                log.time_sim_instrument ||
                log.holds_instrument ? (
                  <>
                    <Grid.Col span={4}>
                      <VerticalLogItem
                        label="Instrument Time"
                        content={log.time_instrument}
                        hours
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <VerticalLogItem
                        label="Simulated Instrument Time"
                        content={log.time_sim_instrument}
                        hours
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <VerticalLogItem
                        label="Instrument Holds"
                        content={log.holds_instrument}
                      />
                    </Grid.Col>
                  </>
                ) : null}
              </Grid>
            </Container>
          </ScrollArea>
        </>
      ) : (
        <Center h="calc(100vh - 95px)">
          <ErrorDisplay error="Unknown Error" />
        </Center>
      )}
    </Stack>
    // </Container>
  );
}
