import { ActionIcon, Collapse, Fieldset, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { ReactNode } from "react";

export default function CollapsibleFieldset({
  children,
  legend,
  w = "",
  mt = "",
}: {
  children: ReactNode;
  legend?: string;
  w?: string;
  mt?: string;
}) {
  const [open, { toggle }] = useDisclosure(true);

  return (
    <Fieldset
      legend={
        <Group gap="xs">
          {legend ? <Text>{legend}</Text> : null}
          <ActionIcon variant="transparent" onClick={toggle} color="gray">
            {open ? <IconMinus /> : <IconPlus />}
          </ActionIcon>
        </Group>
      }
      w={w}
      mt={mt}
    >
      <Collapse in={open}>{children}</Collapse>
    </Fieldset>
  );
}
