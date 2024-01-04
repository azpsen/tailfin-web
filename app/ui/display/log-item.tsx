import { Card, Group, Stack, Text } from "@mantine/core";

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
}: {
  label: string;
  content: string | null;
  decimal?: number;
  hours?: boolean;
  time?: boolean;
  date?: boolean;
}) {
  if (content === null) content = "";
  if (decimal > 0) content = Number(content).toFixed(decimal);
  if (hours) content = Number(content).toFixed(1);
  if (time) content = content.split("T")[1];
  if (date) content = content.split("T")[0];

  return (
    <Card>
      <Stack gap="xs" align="center">
        <Text c="dimmed" style={{ textalign: "center" }}>
          {label}
        </Text>
        <Text size="lg" style={{ textalign: "center" }}>
          {content}
        </Text>
      </Stack>
    </Card>
  );
}
