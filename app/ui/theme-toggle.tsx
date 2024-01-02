import {
  ActionIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

const ThemeToggle = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const comoputedColorScheme = useComputedColorScheme("dark");
  const toggleColorScheme = () => {
    setColorScheme(comoputedColorScheme === "dark" ? "light" : "dark");
  };
  return (
    <Tooltip label={(colorScheme === "dark" ? "Light" : "Dark") + " Theme"}>
      <ActionIcon
        variant="default"
        radius="xl"
        size="lg"
        aria-label="Toggle Dark Theme"
        onClick={toggleColorScheme}
      >
        {colorScheme === "dark" ? <IconSun /> : <IconMoonStars />}
      </ActionIcon>
    </Tooltip>
  );
};

export default ThemeToggle;
