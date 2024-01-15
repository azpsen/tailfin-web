import {
  Badge,
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
import { randomId, useDisclosure } from "@mantine/hooks";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import ListInput from "@/ui/input/list-input";
import { usePatchFlight } from "@/util/hooks";

export function LogItem({
  label,
  content,
}: {
  label: string;
  content: string | null;
}) {
  if (content === null) content = "";

  return (
    <Group justify="space-between" px="sm">
      <Text>{label}</Text>
      <Text>{content}</Text>
    </Group>
  );
}

export function ListLogItem({
  label,
  content,
  listColor = "",
  id = "",
  field = "",
}: {
  label: string;
  content: string | string[] | null;
  listColor?: string;
  id?: string;
  field?: string;
}) {
  if (content === null) content = [];
  if (content instanceof String) content = [content as string];

  const [editValue, setEditValue] = useState<string[]>(content as string[]);

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const updateValue = usePatchFlight(id, field, closeEdit);

  const editForm = (
    <ListInput label={label} value={editValue} setValue={setEditValue} />
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
                updateValue.mutate(editValue);
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
              {(content as string[]).length > 0 ? (
                <Text size="lg">
                  {(content as string[]).map((item) => (
                    <Badge key={randomId()} size="lg" mx="xs" color={listColor}>
                      {item}
                    </Badge>
                  ))}
                </Text>
              ) : (
                <Text size="lg" style={{ textAlign: "center" }} c="dimmed">
                  <IconX />
                </Text>
              )}
            </UnstyledButton>
          </Tooltip>
        </Stack>
      </Card>
    </>
  );
}
