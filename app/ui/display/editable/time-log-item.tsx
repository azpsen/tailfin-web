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
import TimeInput from "@/ui/input/time-input";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { usePatchFlight } from "@/util/hooks";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export function TimeLogItem({
  label,
  content,
  date,
  id = "",
  field = "",
}: {
  label: string;
  content: string | null;
  date: dayjs.Dayjs | string;
  id?: string;
  field?: string;
}) {
  if (date instanceof String) date = dayjs(date);

  const time = (content as string).split("T")[1].split(":");
  const [editValue, setEditValue] = useState<number | string | undefined>(
    Number(`${time[0]}${time[1]}`)
  );

  const [editError, setEditError] = useState("");

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const updateValue = usePatchFlight(id, field, closeEdit);

  content = `${time[0]}:${time[1]}`;
  const editForm = (
    <TimeInput
      label={label}
      value={editValue}
      setValue={setEditValue}
      error={editError}
      allowLeadingZeros
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
                if (Number(editValue) > 2359)
                  setEditError("Time must be between 0000 and 2359");
                else if (Number(editValue) % 100 > 59)
                  setEditError("Minutes must not exceed 59");
                else {
                  updateValue.mutate(
                    dayjs(date)
                      .utc()
                      .hour(Math.floor((Number(editValue) ?? 0) / 100))
                      .minute(Math.floor((Number(editValue) ?? 0) % 100))
                      .second(0)
                      .millisecond(0)
                      .toISOString()
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
