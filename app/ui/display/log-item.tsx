import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";

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

export function VerticalLogItem({
  label,
  content,
  decimal = 0,
  hours = false,
  time = false,
  date = false,
  list = false,
}: {
  label: string;
  content: string | string[] | null;
  decimal?: number;
  hours?: boolean;
  time?: boolean;
  date?: boolean;
  list?: boolean;
}) {
  if (content === null) content = "";
  if (decimal > 0) content = Number(content).toFixed(decimal);
  if (hours) content = Number(content).toFixed(1);
  if (time) {
    const time = (content as string).split("T")[1].split(":");
    content = `${time[0]}:${time[1]}`;
  }
  if (date) content = (content as string).split("T")[0];

  return (
    <Card shadow="sm" withBorder h="100%">
      <Stack gap="xs" align="center" h="100%">
        <Text c="dimmed" style={{ textalign: "center" }}>
          {label}
        </Text>
        {list ? (
          <>
            {(content as string[]).length > 0 ? (
              <Text size="lg">
                {(content as string[]).map((item) => (
                  <Badge key={randomId()} size="lg" mx="xs">
                    {item}
                  </Badge>
                ))}
              </Text>
            ) : (
              <Text size="lg" style={{ textAlign: "center" }} c="dimmed">
                <IconX />
              </Text>
            )}
          </>
        ) : (
          <Text
            size="lg"
            style={{ textAlign: "center" }}
            c={content === "" ? "dimmed" : ""}
          >
            {content === "" ? <IconX /> : content}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
