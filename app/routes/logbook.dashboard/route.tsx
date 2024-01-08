import CollapsibleFieldset from "@/ui/display/collapsible-fieldset";
import { VerticalLogItem } from "@/ui/display/log-item";
import ErrorDisplay from "@/ui/error-display";
import { useApi } from "@/util/api";
import { Center, Group, Loader, Container, Stack, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const client = useApi();

  const totals = useQuery({
    queryKey: ["totals"],
    queryFn: async () =>
      await client.get(`/flights/totals`).then((res) => res.data),
  });

  return (
    <Container>
      {totals.isLoading ? (
        <Center h="calc(100vh - 95px)">
          <Loader />
        </Center>
      ) : totals.isError ? (
        <Center h="calc(100vh - 95px)">
          <ErrorDisplay error={totals.error?.message} />
        </Center>
      ) : (
        <Stack align="center" mt="xl">
          <Title order={3}>Totals</Title>
          <CollapsibleFieldset legend="Time" w="100%">
            <Group grow>
              <VerticalLogItem label="All" content={totals.data.time_total} />
              <VerticalLogItem label="Solo" content={totals.data.time_solo} />
              <VerticalLogItem label="PIC" content={totals.data.time_pic} />
              <VerticalLogItem label="SIC" content={totals.data.time_sic} />
              <VerticalLogItem
                label="Instrument"
                content={totals.data.time_instrument}
              />
              <VerticalLogItem
                label="Simulator"
                content={totals.data.time_sim}
              />
            </Group>
          </CollapsibleFieldset>
          <CollapsibleFieldset legend="Landings" w="100%">
            <Group grow>
              <VerticalLogItem label="Day" content={totals.data.landings_day} />
              <VerticalLogItem
                label="Night"
                content={totals.data.landings_night}
              />
            </Group>
          </CollapsibleFieldset>
          <CollapsibleFieldset legend="Cross-Country" w="100%">
            <Group grow>
              <VerticalLogItem label="Hours" content={totals.data.time_xc} />
              <VerticalLogItem
                label="Dual Recvd"
                content={totals.data.xc_dual_recvd}
              />
              <VerticalLogItem label="Solo" content={totals.data.xc_solo} />
              <VerticalLogItem label="PIC" content={totals.data.xc_pic} />
            </Group>
          </CollapsibleFieldset>
          <CollapsibleFieldset legend="Night" w="100%">
            <Group grow>
              <VerticalLogItem label="Hours" content={totals.data.time_night} />
              <VerticalLogItem
                label="Night Dual Received"
                content={totals.data.night_dual_recvd}
              />
              <VerticalLogItem
                label="Night PIC"
                content={totals.data.night_pic}
              />
            </Group>
          </CollapsibleFieldset>
        </Stack>
      )}
    </Container>
  );
}
