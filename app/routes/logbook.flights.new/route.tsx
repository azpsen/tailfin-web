import { Container, Stack, Title } from "@mantine/core";
import { FlightFormSchema, flightCreateHelper } from "@/util/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/util/api";
import { useNavigate } from "@remix-run/react";
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

        const id = res.data.id;
        if (!id) throw new Error("Flight creation failed");

        console.log(values.images);

        const imageForm = new FormData();

        // Upload images
        for (const img of values.images) {
          imageForm.append("images", img);
        }

        console.log(imageForm);

        const img_id = await client.post(
          `/flights/${id}/add_images`,
          imageForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (!img_id) {
          await queryClient.invalidateQueries({ queryKey: ["flights-list"] });
          throw new Error("Image upload failed");
        }

        return res.data;
      }
      throw new Error("Flight creation failed");
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
          isPending={createFlight.isPending}
          isError={createFlight.isError}
          error={createFlight.error}
          mah="calc(100vh - 95px - 110px)"
          autofillHobbs
        />
      </Stack>
    </Container>
  );
}
