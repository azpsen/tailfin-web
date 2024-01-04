import { Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function ErrorDisplay({ error }: { error: string }) {
  return (
    <Stack align="center" justify="center" h="100%" m="0" p="0">
      <Text c="red">
        <IconAlertTriangle size="3rem" />
      </Text>
      <Text c="red">{error}</Text>
    </Stack>
  );
}
