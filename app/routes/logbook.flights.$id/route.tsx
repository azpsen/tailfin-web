import CollapsibleFieldset from "@/ui/display/collapsible-fieldset";
import { VerticalLogItem } from "@/ui/display/log-item";
import SecureImage from "@/ui/display/secure-img";
import ErrorDisplay from "@/ui/error-display";
import { useApi } from "@/util/api";
import {
  ActionIcon,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Title,
  Tooltip,
  Text,
  Modal,
  Button,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { randomId, useDisclosure } from "@mantine/hooks";
import { useNavigate, useParams } from "@remix-run/react";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Flight() {
  const params = useParams();

  const client = useApi();
  const navigate = useNavigate();

  const flight = useQuery({
    queryKey: [params.id],
    queryFn: async () =>
      await client.get(`/flights/${params.id}`).then((res) => res.data),
  });

  const [imageIds, setImageIds] = useState<string[]>([]);

  useEffect(() => {
    if (flight.data) {
      setImageIds(flight.data.images ?? []);
    }
  }, [flight.data]);

  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const deleteFlight = useMutation({
    mutationFn: async () =>
      await client.delete(`/flights/${params.id}`).then((res) => res.data),
    onSuccess: () => {
      navigate("/logbook/flights");
    },
  });

  const log = flight.data;

  return (
    <>
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Flight?"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to delete this flight? This action cannot be
            undone.
          </Text>
          {deleteFlight.isError ? (
            <Text c="red" fw={700}>
              {deleteFlight.error.message}
            </Text>
          ) : null}
          <Group justify="flex-end">
            <Button color="red" onClick={() => deleteFlight.mutate()}>
              Delete
            </Button>
            <Button color="gray" onClick={closeDelete}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Container>
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
              <Group justify="space-between" px="xl">
                <Title order={2} py="lg" style={{ textAlign: "center" }}>
                  Flight Log
                </Title>
                <Group>
                  <Tooltip
                    label="Edit Flight"
                    onClick={() =>
                      navigate(`/logbook/flights/edit/${params.id}`)
                    }
                  >
                    <ActionIcon variant="subtle" size="lg">
                      <IconPencil />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete Flight">
                    <ActionIcon
                      variant="subtle"
                      size="lg"
                      color="red"
                      onClick={openDelete}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
              <ScrollArea h="calc(100vh - 95px - 110px)" m="0" p="0">
                <Container h="100%">
                  <Grid justify="center">
                    {imageIds.length > 0 ? (
                      <CollapsibleFieldset legend="Images" mt="sm" w="100%">
                        <Carousel
                          withIndicators
                          slideGap="sm"
                          slideSize={{ base: "100%", sm: "80%" }}
                        >
                          {imageIds.map((img) => (
                            <Carousel.Slide key={randomId()}>
                              <SecureImage
                                key={randomId()}
                                id={img}
                                radius="lg"
                              />
                            </Carousel.Slide>
                          ))}
                        </Carousel>
                      </CollapsibleFieldset>
                    ) : null}
                    <CollapsibleFieldset legend="About" mt="sm" w="100%">
                      <Group grow>
                        <VerticalLogItem label="Date" content={log.date} date />
                        <VerticalLogItem
                          label="Aircraft"
                          content={log.aircraft}
                        />
                      </Group>
                      {(log.pax || log.crew) &&
                      (log.pax.length > 0 || log.crew.length > 0) ? (
                        <Group grow mt="sm">
                          <VerticalLogItem
                            label="Pax"
                            content={log.pax}
                            list
                            listColor="gray"
                          />
                          <VerticalLogItem
                            label="Crew"
                            content={log.crew}
                            list
                            listColor="gray"
                          />
                        </Group>
                      ) : null}
                      {log.tags && log.tags.length > 0 ? (
                        <Group grow mt="sm">
                          <VerticalLogItem
                            label="Tags"
                            content={log.tags}
                            list
                          />
                        </Group>
                      ) : null}
                      {log.comments?.length > 0 ? (
                        <Group grow mt="sm">
                          <VerticalLogItem
                            label="Comments"
                            content={log.comments}
                          />
                        </Group>
                      ) : null}
                    </CollapsibleFieldset>
                    {log.waypoint_from || log.waypoint_to || log.route ? (
                      <CollapsibleFieldset legend="Route" w="100%" mt="sm">
                        {log.waypoint_from || log.waypoint_to ? (
                          <Group grow>
                            <VerticalLogItem
                              label="From"
                              content={log.waypoint_from}
                            />
                            <VerticalLogItem
                              label="To"
                              content={log.waypoint_to}
                            />
                          </Group>
                        ) : null}
                        {log.route ? (
                          <Group grow>
                            <VerticalLogItem
                              label="Route"
                              content={log.route}
                            />
                          </Group>
                        ) : null}
                      </CollapsibleFieldset>
                    ) : null}
                    {log.hobbs_start || log.hobbs_end ? (
                      <CollapsibleFieldset legend="Times" w="100%" mt="sm">
                        <Group grow>
                          <VerticalLogItem
                            label="Hobbs Start"
                            content={log.hobbs_start}
                            hours
                          />
                          <VerticalLogItem
                            label="Hobbs End"
                            content={log.hobbs_end}
                            hours
                          />
                        </Group>
                      </CollapsibleFieldset>
                    ) : null}
                    {log.time_start ||
                    log.time_off ||
                    log.time_down ||
                    log.time_stop ? (
                      <CollapsibleFieldset legend="Start/Stop" w="100%" mt="sm">
                        {log.time_start || log.time_off ? (
                          <Group grow>
                            <VerticalLogItem
                              label="Time Start"
                              content={log.time_start}
                              time
                            />
                            <VerticalLogItem
                              label="Time Off"
                              content={log.time_off}
                              time
                            />
                          </Group>
                        ) : null}
                        {log.time_down || log.time_stop ? (
                          <Group grow mt="sm">
                            <VerticalLogItem
                              label="Time Down"
                              content={log.time_down}
                              time
                            />
                            <VerticalLogItem
                              label="Time Stop"
                              content={log.time_stop}
                              time
                            />
                          </Group>
                        ) : null}
                      </CollapsibleFieldset>
                    ) : null}
                    <CollapsibleFieldset legend="Hours" w="100%" mt="sm">
                      <Group grow>
                        <VerticalLogItem
                          label="Total"
                          content={log.time_total}
                          hours
                        />
                        <VerticalLogItem
                          label="Solo"
                          content={log.time_solo}
                          hours
                        />
                        <VerticalLogItem
                          label="Night"
                          content={log.time_night}
                          hours
                        />
                      </Group>
                      <Group grow mt="sm">
                        <VerticalLogItem
                          label="PIC"
                          content={log.time_pic}
                          hours
                        />
                        <VerticalLogItem
                          label="SIC"
                          content={log.time_sic}
                          hours
                        />
                      </Group>
                    </CollapsibleFieldset>
                    {log.time_xc || log.dist_xc ? (
                      <CollapsibleFieldset
                        legend="Cross-Country"
                        w="100%"
                        mt="sm"
                      >
                        <Group grow>
                          <VerticalLogItem
                            label="Hours"
                            content={log.time_xc}
                            hours
                          />
                          <VerticalLogItem
                            label="Distance"
                            content={log.dist_xc}
                            decimal={2}
                          />
                        </Group>
                      </CollapsibleFieldset>
                    ) : null}
                    <CollapsibleFieldset legend="Landings" w="100%">
                      <Group grow>
                        <VerticalLogItem
                          label="Day"
                          content={log.landings_day}
                        />
                        <VerticalLogItem
                          label="Night"
                          content={log.landings_night}
                        />
                      </Group>
                    </CollapsibleFieldset>
                    {log.time_instrument ||
                    log.time_sim_instrument ||
                    log.holds_instrument ? (
                      <CollapsibleFieldset legend="Instrument" mt="sm" w="100%">
                        <Group grow>
                          <VerticalLogItem
                            label="Instrument Time"
                            content={log.time_instrument}
                            hours
                          />
                          <VerticalLogItem
                            label="Simulated Instrument Time"
                            content={log.time_sim_instrument}
                            hours
                          />
                          <VerticalLogItem
                            label="Instrument Holds"
                            content={log.holds_instrument}
                          />
                        </Group>
                      </CollapsibleFieldset>
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
      </Container>
    </>
  );
}
