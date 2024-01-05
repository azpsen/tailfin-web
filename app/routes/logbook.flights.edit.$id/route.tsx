import { Container, Stack, Title } from "@mantine/core";
import {
  FlightFormSchema,
  flightCreateHelper,
  flightEditHelper,
} from "@/util/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/util/api";
import { useNavigate, useParams } from "@remix-run/react";
import { AxiosError } from "axios";
import FlightForm from "@/ui/form/flight-form";

export default function EditFlight() {
  const params = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const client = useApi();

  const flight = useQuery({
    queryKey: [params.id],
    queryFn: async () =>
      await client.get(`/flights/${params.id}`).then((res) => res.data),
  });

  const editFlight = useMutation({
    mutationFn: async (values: FlightFormSchema) => {
      const newFlight = flightCreateHelper(values);
      if (newFlight) {
        const res = await client.put(`/flights/${params.id}`, newFlight);
        return res.data;
      }
      throw new Error("Flight updating failed");
    },
    retry: (failureCount, error: AxiosError) => {
      return !error || error.response?.status !== 401;
    },
    onSuccess: async (data: { id: string }) => {
      await queryClient.invalidateQueries({ queryKey: ["flights-list"] });
      navigate(`/logbook/flights/${data.id}`);
    },
  });

  return (
    <Container>
      <Stack>
        <Title order={2}>Edit Flight</Title>

        <FlightForm
          initialValues={flightEditHelper(flight.data) ?? null}
          onSubmit={editFlight.mutate}
          isError={editFlight.isError}
          error={editFlight.error}
          submitButtonLabel="Update"
          withCancelButton
          cancelFunc={() => navigate(`/logbook/flights/${params.id}`)}
          mah="calc(100vh - 95px - 110px)"
        />
      </Stack>
    </Container>
  );
}
