import { useAuth } from "@/util/auth";
import { Stack, NavLink } from "@mantine/core";
import { Link, useLocation } from "@remix-run/react";
import {
  IconBook2,
  IconLogout,
  IconPlaneDeparture,
  IconUser,
} from "@tabler/icons-react";

export default function Navbar({
  opened,
  toggle,
}: {
  opened: boolean;
  toggle: () => void;
}) {
  const location = useLocation();
  const page = location.pathname.split("/")[2];

  const { user, signout } = useAuth();

  return (
    <Stack justify="space-between" h="100%">
      <Stack gap="0">
        <NavLink
          p="md"
          component={Link}
          to="/logbook/dashboard"
          label="Dashboard"
          leftSection={<IconPlaneDeparture />}
          active={page == "dashboard"}
          onClick={() => (opened ? toggle() : null)}
        />
        <NavLink
          p="md"
          component={Link}
          to="/logbook/flights"
          label="Flights"
          leftSection={<IconBook2 />}
          active={page === "flights"}
          onClick={() => (opened ? toggle() : null)}
        />
      </Stack>
      <Stack gap="0">
        <NavLink
          p="md"
          label={user ? user : "Not Logged In"}
          leftSection={<IconUser />}
        >
          <NavLink
            p="md"
            component={Link}
            to="/logbook/me"
            label="Account"
            leftSection={<IconUser />}
          />
          <NavLink
            p="md"
            onClick={() => signout()}
            label="Sign Out"
            leftSection={<IconLogout />}
          />
        </NavLink>
      </Stack>
    </Stack>
  );
}
