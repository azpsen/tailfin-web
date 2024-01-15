import AircraftForm from "@/ui/form/aircraft-form";
import { useApi } from "@/util/api";
import { useAircraft, usePatchFlight } from "@/util/hooks";
import { AircraftFormSchema, AircraftSchema } from "@/util/types";
import {
  ActionIcon,
  Group,
  Tooltip,
  Text,
  Select,
  Modal,
  Card,
  Stack,
  Button,
  Loader,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconPencil, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function AircraftLogItem({
  label,
  content,
  id = "",
  field = "",
}: {
  label: string;
  content: string | null;
  id?: string;
  field?: string;
}) {
  const [editValue, setEditValue] = useState<string>(content ?? "");
  const [editError, setEditError] = useState("");

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const [aircraftOpened, { open: openAircraft, close: closeAircraft }] =
    useDisclosure(false);

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

  const getAircraft = useAircraft();

  const updateValue = usePatchFlight(id, field, closeEdit);

  if (content === null) content = "";
  const editForm = (
    <Select
      label={
        <Group gap="0">
          <Text size="sm" fw={700} span>
            Aircraft
          </Text>

          <Tooltip label="Add Aircraft">
            <ActionIcon variant="transparent" onClick={openAircraft}>
              <IconPlus size="1rem" />
            </ActionIcon>
          </Tooltip>
        </Group>
      }
      data={
        getAircraft.isFetched
          ? getAircraft.data?.map((item: AircraftSchema) => ({
              value: item.tail_no,
              label: item.tail_no,
            }))
          : content
          ? [
              {
                value: content,
                label: content,
              },
            ]
          : null
      }
      allowDeselect={false}
      value={editValue}
      onChange={(_value, option) => {
        setEditError("");
        setEditValue(option.label);
      }}
      error={editError}
    />
  );

  return (
    <>
      <Modal
        opened={aircraftOpened}
        onClose={closeAircraft}
        title="New Aircraft"
        centered
      >
        <AircraftForm
          onSubmit={addAircraft.mutate}
          isError={addAircraft.isError}
          error={addAircraft.error}
          isPending={addAircraft.isPending}
          submitButtonLabel="Add"
          withCancelButton
          cancelFunc={closeAircraft}
        />
      </Modal>
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title={`Edit ${label}`}
        centered
      >
        <Stack>
          {editForm}
          <Group justify="flex-end">
            {updateValue.isPending ? <Loader /> : null}
            {updateValue.isError ? (
              <Text c="red">{updateValue.error?.message}</Text>
            ) : null}
            <Button
              onClick={() => {
                if (editValue.length === 0) {
                  setEditError("Please select an aircraft");
                } else {
                  updateValue.mutate(editValue);
                }
              }}
              leftSection={<IconPencil />}
            >
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Card shadow="sm" withBorder h="100%">
        <Stack gap="xs" align="center" h="100%">
          <Text c="dimmed">{label}</Text>
          <Tooltip label={`Edit ${label}`}>
            <UnstyledButton onClick={openEdit}>
              <Text
                size="lg"
                style={{ textAlign: "center" }}
                c={content === "" ? "dimmed" : ""}
              >
                {content === "" ? <IconX /> : content}
              </Text>
            </UnstyledButton>
          </Tooltip>
        </Stack>
      </Card>
    </>
  );
}
