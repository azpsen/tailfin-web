import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import SecureImage from "../display/secure-img";
import { randomId } from "@mantine/hooks";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";

export default function ImageListInput({
  label,
  imageIds,
  setImageIds,
  collapsible = false,
  startCollapsed = true,
}: {
  label: string;
  imageIds: string[];
  setImageIds: Dispatch<SetStateAction<string[]>>;
  collapsible?: boolean;
  startCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  return (
    <>
      <Group gap="0">
        <Text size="sm" fw={700} span>
          {label}
        </Text>

        {collapsible ? (
          <Tooltip label={collapsed ? "Expand" : "Collapse"}>
            <ActionIcon
              variant="transparent"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <IconPlus size="1rem" /> : <IconMinus size="1rem" />}
            </ActionIcon>
          </Tooltip>
        ) : null}
      </Group>
      <Collapse in={!collapsed}>
        <Group variant="column">
          {imageIds.map((id) => (
            <Card key={randomId()} padding="md" shadow="md" withBorder>
              <SecureImage id={id} />
              <Button
                mt="md"
                leftSection={<IconTrash />}
                onClick={() => setImageIds(imageIds.filter((i) => i !== id))}
              >
                Remove
              </Button>
            </Card>
          ))}
        </Group>
      </Collapse>
    </>
  );
}
