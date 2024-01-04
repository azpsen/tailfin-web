import { client } from "@/util/api";
import { FlightConciseSchema } from "@/util/types";
import {
  NavLink,
  Text,
  Button,
  ScrollArea,
  Stack,
  Loader,
  Center,
  Divider,
} from "@mantine/core";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { IconPlus } from "@tabler/icons-react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

function useFlights() {
  const flights = useQuery({
    queryKey: ["flights-list"],
    queryFn: async () => {
      const res = await client.get(`/flights`);
      const groupedFlights: { [date: string]: FlightConciseSchema[] } = {};
      res.data.map((log: FlightConciseSchema) => {
        const dateStr = log.date;

        if (!groupedFlights[dateStr]) {
          groupedFlights[dateStr] = [];
        }

        groupedFlights[dateStr].push(log);
      });
      return groupedFlights;
    },
  });

  return flights;
}

function FlightsListDisplay({
  flights,
  page,
}: {
  flights: UseQueryResult<{ [date: string]: FlightConciseSchema[] }>;
  page: string;
}) {
  return (
    <>
      {flights.data ? (
        Object.entries(flights.data).map(([date, logs], index: number) => (
          <>
            <Text key={date} mt="md" mb="xs" fw={700}>
              {date}
            </Text>
            <Divider key={date + index} />
            {logs.map((flight: FlightConciseSchema) => (
              <NavLink
                key={flight.id}
                component={Link}
                to={`/logbook/flights/${flight.id}`}
                label={`${flight.waypoint_from ? flight.waypoint_from : ""} ${
                  flight.waypoint_to ? flight.waypoint_to : ""
                }`}
                description={`${flight.date}`}
                active={page === flight.id}
              />
            ))}
          </>
        ))
      ) : flights.isLoading ? (
        <Center h="calc(100vh - 95px - 50px)">
          <Loader />
        </Center>
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
