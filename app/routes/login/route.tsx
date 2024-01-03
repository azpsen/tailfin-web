import { useAuth } from "@/util/auth";
import {
  Box,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function Login() {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const { signin } = useAuth();

  return (
    <Stack gap="md" h="100%" justify="center" align="stretch">
      <Title order={2} style={{ textAlign: "center" }}>
        Login
      </Title>
      <Box maw={340} mx="auto">
        <form
          onSubmit={form.onSubmit((values) => {
            signin(values);
          })}
        >
          <TextInput
            label="Username"
            {...form.getInputProps("username")}
            mt="md"
          />
          <PasswordInput
            label="Password"
            {...form.getInputProps("password")}
            mt="md"
          />
          <Group justify="center" mt="xl">
            <Button type="submit">Log In</Button>
          </Group>
        </form>
      </Box>
    </Stack>
  );
}
