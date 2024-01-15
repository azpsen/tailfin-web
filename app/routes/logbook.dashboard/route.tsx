import CollapsibleFieldset from "@/ui/display/collapsible-fieldset";
import { VerticalLogItem } from "@/ui/display/log-item";
import ErrorDisplay from "@/ui/error-display";
import { useApi } from "@/util/api";
import {
  Center,
  Text,
  Group,
  Loader,
  Container,
  Stack,
  Title,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const client = useApi();

  const [totalsData, setTotalsData] = useState<{
    by_class: object;
    totals: object;
  } | null>(null);

  const totals = useQuery({
    queryKey: ["totals"],
    queryFn: async () =>
      await client.get(`/flights/totals`).then((res) => res.data),
  });

  useEffect(() => {
    if (totals.isFetched && !!totals.data) {
      setTotalsData(totals.data);
    }
  }, [totals.data]);

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
              <VerticalLogItem
                label="All"
                content={totalsData?.totals?.time_total ?? 0.0}
              />
              <VerticalLogItem
                label="Solo"
                content={totalsData?.totals?.time_solo ?? 0.0}
              />
              <VerticalLogItem
                label="PIC"
                content={totalsData?.totals?.time_pic ?? 0.0}
              />
              <VerticalLogItem
                label="SIC"
                content={totalsData?.totals?.time_sic ?? 0.0}
              />
              <VerticalLogItem
                label="Instrument"
                content={totalsData?.totals?.time_instrument ?? 0.0}
              />
              <VerticalLogItem
                label="Simulator"
                content={totalsData?.totals?.time_sim ?? 0.0}
              />
            </Group>
          </CollapsibleFieldset>
          <CollapsibleFieldset legend="Landings" w="100%">
            <Group grow>
              <VerticalLogItem
                label="Day"
                content={totalsData?.totals?.landings_day ?? 0}
              />
              <VerticalLogItem
                label="Night"
                content={totalsData?.totals?.landings_night ?? 0}
              />
            </Group>
          </CollapsibleFieldset>
          <CollapsibleFieldset legend="Cross-Country" w="100%">
            <Group grow>
              <VerticalLogItem
                label="Hours"
                content={totalsData?.totals?.time_xc ?? 0.0}
              />
              <VerticalLogItem
                label="Dual Recvd"
                content={totalsData?.totals?.xc_dual_recvd ?? 0.0}
              />
              <VerticalLogItem
                label="Solo"
                content={totalsData?.totals?.xc_solo ?? 0.0}
              />
              <VerticalLogItem
                label="PIC"
                content={totalsData?.totals?.xc_pic ?? 0.0}
              />
            </Group>
          </CollapsibleFieldset>
          <CollapsibleFieldset legend="Night" w="100%">
            <Group grow>
              <VerticalLogItem
                label="Hours"
                content={totalsData?.totals?.time_night ?? 0.0}
              />
              <VerticalLogItem
                label="Night Dual Received"
                content={totalsData?.totals?.night_dual_recvd ?? 0.0}
              />
              <VerticalLogItem
                label="Night PIC"
                content={totalsData?.totals?.night_pic ?? 0.0}
              />
            </Group>
          </CollapsibleFieldset>
          <CollapsibleFieldset legend="By Category / Class" w="100%">
            <Group justify="center" grow>
              {totalsData?.by_class?.map((category) => (
                <Stack key={randomId()} gap="0">
                  <Text pb="xs" style={{ textAlign: "center" }}>
                    {category.aircraft_category}
                  </Text>
                  <Group justify="center" grow>
                    {category.classes.map((total) => (
                      <>
                        <VerticalLogItem
                          key={randomId()}
                          label={total.aircraft_class}
                          content={total.time_total ?? 0.0}
                        />
                      </>
                    ))}
                  </Group>
                </Stack>
              ))}
            </Group>
          </CollapsibleFieldset>
        </Stack>
      )}
    </Container>
  );
}
