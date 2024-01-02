import { useMe, useSignOut } from "@/util/hooks";
import { Stack, NavLink, ActionIcon } from "@mantine/core";
import { Link, useLocation } from "@remix-run/react";
import {
  IconBook2,
  IconLogout,
  IconMapRoute,
  IconPlaneDeparture,
  IconUser,
} from "@tabler/icons-react";

export default function Navbar() {
  const location = useLocation();
  const page = location.pathname.split("/")[2];

  const me = useMe();
  const signOut = useSignOut();

  return (
    <Stack justify="space-between" h="100%">
      <Stack gap="0">
        <NavLink
          p="md"
          component={Link}
          to="/logbook"
          label="Dashboard"
          leftSection={<IconPlaneDeparture />}
          active={page == null}
        />
        <NavLink
          p="md"
          component={Link}
          to="/logbook/flights"
          label="Flights"
          leftSection={<IconBook2 />}
          active={page === "flights"}
        />
      </Stack>
      <Stack gap="0">
        <NavLink
          p="md"
          label={
            me.isError
              ? me.error.message
              : me.isFetched
              ? me.data?.username
              : "Not Logged In"
          }
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
            onClick={() => signOut()}
            label="Sign Out"
            leftSection={<IconLogout />}
          />
        </NavLink>
      </Stack>
    </Stack>
  );
}
