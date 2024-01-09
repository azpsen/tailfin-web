import ErrorDisplay from "@/ui/error-display";
import { useApi } from "@/util/api";
import { FlightConciseSchema } from "@/util/types";
import {
  NavLink,
  Text,
  Button,
  ScrollArea,
  Stack,
  Loader,
  Center,
  Badge,
  Group,
  Divider,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import {
  IconArrowRightTail,
  IconPlaneTilt,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

function useFlights() {
  const client = useApi();

  const flights = useQuery({
    queryKey: ["flights-list"],
    queryFn: async () =>
      await client.get(`/flights/by-date?order=1`).then((res) => res.data),
  });

  return flights;
}

function FlightsListDisplay({
  flights,
  page,
}: {
  flights: UseQueryResult<{
    [year: string]: {
      [month: string]: { [day: string]: FlightConciseSchema[] };
    };
  }>;
  page: string;
}) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      {flights.data ? (
        Object.entries(flights.data)?.length === 0 ? (
          <Center h="calc(100vh - 95px - 50px)">
            <Stack align="center">
              <IconX size="3rem" />
              <Center>No flights</Center>
            </Stack>
          </Center>
        ) : (
          Object.entries(flights.data)
            .reverse()
            .map(([year, months]) => (
              <>
                <NavLink
                  key={randomId()}
                  label={`-- ${year} --`}
                  fw={700}
                  style={{ textAlign: "center" }}
                  defaultOpened
                  childrenOffset={0}
                >
                  <>
                    <Divider />
                    {Object.entries(months)
                      .reverse()
                      .map(([month, days]) => (
                        <NavLink
                          key={randomId()}
                          label={monthNames[Number(month) - 1]}
                          fw={500}
                          style={{ textAlign: "center" }}
                          defaultOpened
                        >
                          <Divider />
                          {Object.entries(days)
                            .reverse()
                            .map(([, logs]) => (
                              <>
                                {logs
                                  .reverse()
                                  .map((flight: FlightConciseSchema) => (
                                    <>
                                      <NavLink
                                        key={randomId()}
                                        component={Link}
                                        to={`/logbook/flights/${flight.id}`}
                                        label={
                                          <Group>
                                            <Badge
                                              color="gray"
                                              size="lg"
                                              radius="sm"
                                              px="xs"
                                            >
                                              {flight.date}
                                            </Badge>
                                            <Text fw={500}>
                                              {`${Number(
                                                flight.time_total
                                              ).toFixed(1)} hr`}
                                            </Text>
                                            {flight.waypoint_from ||
                                            flight.waypoint_to ? (
                                              <>
                                                <Text>/</Text>
                                                <Group gap="xs">
                                                  {flight.waypoint_from ? (
                                                    <Text>
                                                      {flight.waypoint_from}
                                                    </Text>
                                                  ) : (
                                                    ""
                                                  )}
                                                  {flight.waypoint_from &&
                                                  flight.waypoint_to ? (
                                                    <IconArrowRightTail />
                                                  ) : null}
                                                  {flight.waypoint_to ? (
                                                    <Text>
                                                      {flight.waypoint_to}
                                                    </Text>
                                                  ) : (
                                                    ""
                                                  )}
                                                </Group>
                                              </>
                                            ) : null}
                                          </Group>
                                        }
                                        description={
                                          <Text lineClamp={1}>
                                            {flight.comments
                                              ? flight.comments
                                              : "(No Comment)"}
                                          </Text>
                                        }
                                        rightSection={
                                          flight.aircraft ? (
                                            <Badge
                                              key={randomId()}
                                              leftSection={
                                                <IconPlaneTilt size="1rem" />
                                              }
                                              color="gray"
                                              size="lg"
                                            >
                                              {flight.aircraft}
                                            </Badge>
                                          ) : null
                                        }
                                        active={page === flight.id}
                                      />
                                      <Divider />
                                    </>
                                  ))}
                              </>
                            ))}
                        </NavLink>
                      ))}
                  </>
                </NavLink>
              </>
            ))
        )
      ) : flights.isLoading ? (
        <Center h="calc(100vh - 95px - 50px)">
          <Loader />
        </Center>
      ) : flights.isError ? (
        <ErrorDisplay error={flights.error?.message} />
      ) : (
        <Center h="calc(100vh - 95px - 50px)">
          <Text p="sm">No Flights</Text>
        </Center>
      )}
    </>
  );
}

export function FlightsList() {
  const location = useLocation();
  const page = location.pathname.split("/")[3];

  const flights = useFlights();

  const navigate = useNavigate();

  return (
    <Stack p="0" m="0" gap="0">
      <Button
        variant="outline"
        leftSection={<IconPlus />}
        mb="md"
        onClick={() => navigate("/logbook/flights/new")}
      >
        Add
      </Button>
      <ScrollArea h="calc(100vh - 95px - 50px)">
        <FlightsListDisplay flights={flights} page={page} />
      </ScrollArea>
    </Stack>
  );
}

export function MobileFlightsList() {
  const location = useLocation();
  const page = location.pathname.split("/")[3];

  const flights = useFlights();

  const navigate = useNavigate();

  return (
    <Stack p="0" m="0" justify="space-between" h="calc(100vh - 95px)">
      <ScrollArea h="calc(100vh - 95px - 50px">
        <FlightsListDisplay flights={flights} page={page} />
      </ScrollArea>
      <Button
        variant="outline"
        leftSection={<IconPlus />}
        mt="md"
        onClick={() => navigate("/logbook/flights/new")}
      >
        Add
      </Button>
    </Stack>
  );
}

export default { FlightsList, MobileFlightsList };
