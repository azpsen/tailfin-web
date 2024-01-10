import ErrorDisplay from "@/ui/error-display";
import AircraftForm from "@/ui/form/aircraft-form";
import { useApi } from "@/util/api";
import { AircraftFormSchema, AircraftSchema } from "@/util/types";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId, useDisclosure } from "@mantine/hooks";
import { IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

function useAircraft() {
  const client = useApi();

  const aircraft = useQuery({
    queryKey: ["aircraft-list"],
    queryFn: async () => await client.get(`/aircraft`).then((res) => res.data),
  });

  return aircraft;
}

function AircraftCard({ aircraft }: { aircraft: AircraftSchema }) {
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const client = useApi();
  const queryClient = useQueryClient();

  const deleteAircraft = useMutation({
    mutationFn: async () =>
      await client.delete(`/aircraft/${aircraft.id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aircraft-list"] });
    },
  });

  return (
    <>
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Aircraft?"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to delete this aircraft? This action cannot be
            undone.
          </Text>
          {deleteAircraft.isError ? (
            <Text c="red" fw={700}>
              {deleteAircraft.error.message}
            </Text>
          ) : null}
          <Group justify="flex-end">
            <Button color="red" onClick={() => deleteAircraft.mutate()}>
              Delete
            </Button>
            <Button color="gray" onClick={closeDelete}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Card key={randomId()}>
        <Stack>
          <Group grow justify="space-between">
            <Title order={4}>{aircraft.tail_no}</Title>
            <Group justify="flex-end">
              <ActionIcon variant="transparent">
                <IconPencil />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="red"
                onClick={openDelete}
              >
                <IconTrash />
              </ActionIcon>
            </Group>
          </Group>
          <Group>
            <Text>{aircraft.make}</Text>
            <Text>{aircraft.model}</Text>
          </Group>
          <Group>
            <Text>{aircraft.aircraft_category}</Text>
            <Text>/</Text>
            <Text>{aircraft.aircraft_class}</Text>
          </Group>
          {aircraft.hobbs ? <Text>Hobbs: {aircraft.hobbs}</Text> : null}
        </Stack>
      </Card>
    </>
  );
}

function NewAircraftModal({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const client = useApi();
  const queryClient = useQueryClient();

  const addAircraft = useMutation({
    mutationFn: async (values: AircraftFormSchema) => {
      const newAircraft = values;
      if (newAircraft) {
        const res = await client.post("/aircraft", newAircraft);
        return res.data;
      }
      throw new Error("Aircraft creation failed");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["aircraft-list"] });
      close();
    },
  });

  return (
    <Modal opened={opened} onClose={close} title="New Aircraft" centered>
      <AircraftForm
        onSubmit={addAircraft.mutate}
        isError={addAircraft.isError}
        error={addAircraft.error}
        isPending={addAircraft.isPending}
        submitButtonLabel="Add"
      />
    </Modal>
  );
}

export default function Aircraft() {
  const aircraft: UseQueryResult<AircraftSchema[]> = useAircraft();

  const [newOpened, { open: openNew, close: closeNew }] = useDisclosure(false);

  return (
    <>
      <NewAircraftModal opened={newOpened} close={closeNew} />
      <Container>
        <Group justify="space-between" align="center" grow my="lg">
          <Title order={2}>Aircraft</Title>
          <Group justify="flex-end">
            <Tooltip label="Add Aircraft">
              <ActionIcon variant="subtle" onClick={openNew}>
                <IconPlus />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <ScrollArea h="calc(100vh - 95px - 75px)">
          {aircraft.isLoading ? (
            <Center h="calc(100vh - 95px - 75px)">
              <Loader />
            </Center>
          ) : aircraft.isError ? (
            <Center h="calc(100vh - 95px - 75px)">
              <ErrorDisplay error={aircraft.error?.message} />
            </Center>
          ) : aircraft.data && aircraft.data.length === 0 ? (
            <Center h="calc(100vh - 95px - 75px)">
              <Stack align="center">
                <IconX size="3rem" />
                <Text c="dimmed">No Aircraft</Text>
              </Stack>
            </Center>
          ) : (
            <Stack justify="center">
              {aircraft.data?.map((item) => (
                <AircraftCard key={randomId()} aircraft={item} />
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Container>
    </>
  );
}
