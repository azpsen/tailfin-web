import {
  AppShell,
  Burger,
  Group,
  Title,
  UnstyledButton,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ThemeToggle from "../theme-toggle";
import { Link, useNavigate } from "@remix-run/react";
import Navbar from "./navbar";

export function TailfinAppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "xl", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" justify="space-between" px="md">
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="xl"
              size="sm"
            />
          </Group>
          <Group gap="xs">
            <Avatar src="/logo.png" component={Link} to="/logbook" />
            <UnstyledButton onClick={() => navigate("/logbook")}>
              <Title order={2} fw="normal">
                Tailfin
              </Title>
            </UnstyledButton>
          </Group>
          <ThemeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar opened={opened} toggle={toggle} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
