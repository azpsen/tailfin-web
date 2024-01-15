import {
  Button,
  Card,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Textarea,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { usePatchFlight } from "@/util/hooks";

export function TextLogItem({
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

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const updateValue = usePatchFlight(id, field, closeEdit);

  const editForm = (
    <Textarea
      label=""
      value={editValue}
      onChange={(event) => setEditValue(event.currentTarget.value)}
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
              onClick={() => updateValue.mutate(editValue)}
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
