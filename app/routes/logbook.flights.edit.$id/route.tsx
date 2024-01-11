import { Center, Container, Loader, Stack, Title } from "@mantine/core";
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
import ErrorDisplay from "@/ui/error-display";

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

        {flight.isLoading ? (
          <Center h="calc(100vh - 95px - 110px)">
            <Loader />
          </Center>
        ) : flight.isError ? (
          <Center h="calc(100vh - 95px - 110px)">
            <ErrorDisplay error={flight.error.message} />
          </Center>
        ) : (
          <FlightForm
            initialValues={
              flight.data ? flightEditHelper(flight.data) ?? null : null
            }
            onSubmit={editFlight.mutate}
            isPending={editFlight.isPending}
            isError={editFlight.isError}
            error={editFlight.error}
            submitButtonLabel="Update"
            withCancelButton
            cancelFunc={() => navigate(`/logbook/flights/${params.id}`)}
            mah="calc(100vh - 95px - 110px)"
            autofillHobbs={false}
          />
        )}
      </Stack>
    </Container>
  );
}
