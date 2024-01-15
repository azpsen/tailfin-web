import {
  Button,
  Card,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { usePatchFlight } from "@/util/hooks";
import { ZeroIntInput } from "@/ui/input/int-input";

export function IntLogItem({
  label,
  content,
  id = "",
  field = "",
}: {
  label: string;
  content: number | string | null;
  id?: string;
  field?: string;
}) {
  content = Number(content);

  const [editValue, setEditValue] = useState<number>(content);

  const [editError, setEditError] = useState("");

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const updateValue = usePatchFlight(id, field, closeEdit);

  const editForm = (
    <ZeroIntInput
      label=""
      value={editValue}
      setValue={setEditValue}
      error={editError}
    />
  );

  return (
    <>
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
                if (editValue === null || editValue < 0) {
                  setEditError("Please enter a valid number");
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
          <Text c="dimmed" style={{ textalign: "center" }}>
            {label}
          </Text>
          <Tooltip label={`Edit ${label}`}>
            <UnstyledButton onClick={openEdit}>
              <Text
                size="lg"
                style={{ textAlign: "center" }}
                c={content === null ? "dimmed" : ""}
              >
                {content === null ? <IconX /> : content}
              </Text>
            </UnstyledButton>
          </Tooltip>
        </Stack>
      </Card>
    </>
  );
}
