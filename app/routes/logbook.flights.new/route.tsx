import { Container, Stack, Title } from "@mantine/core";
import { FlightFormSchema, flightCreateHelper } from "@/util/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/util/api";
import { useNavigate } from "@remix-run/react";
import { AxiosError } from "axios";
import FlightForm from "@/ui/form/flight-form";

export default function NewFlight() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const client = useApi();

  const createFlight = useMutation({
    mutationFn: async (values: FlightFormSchema) => {
      const newFlight = flightCreateHelper(values);
      if (newFlight) {
        const res = await client.post("/flights", newFlight);
        return res.data;
      }
      throw new Error("Flight creation failed");
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
        <Title order={2}>New Flight</Title>

        <FlightForm
          onSubmit={createFlight.mutate}
          isError={createFlight.isError}
          error={createFlight.error}
        />
      </Stack>
    </Container>
  );
}
