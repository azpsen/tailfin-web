import { usePatchFlight } from "@/util/hooks";
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
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export function DateLogItem({
  label,
  content,
  id = "",
  field = "",
}: {
  label: string;
  content: Date | string | null;
  id?: string;
  field?: string;
}) {
  const [editValue, setEditValue] = useState<Date | null>(
    content ? new Date(content as string) : null
  );
  const [editError, setEditError] = useState("");

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const updateValue = usePatchFlight(id, field, closeEdit);

  content = (content as string).split("T")[0];
  const editForm = (
    <DatePickerInput
      label={label}
      value={editValue}
      onChange={setEditValue}
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
                if (editValue === null) {
                  setEditError("Please select a date");
                } else {
                  updateValue.mutate(
                    dayjs(editValue).utc().startOf("day").toISOString()
                  );
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
