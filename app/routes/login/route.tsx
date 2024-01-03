import { useAuth } from "@/util/auth";
import {
  Button,
  Center,
  Container,
  Fieldset,
  Group,
  Image,
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
    <Container h="75%">
      <Stack gap="md" h="100%" justify="center" align="stretch">
        <Center>
          <Image src="/logo.png" w="100px" />
        </Center>
        <Title order={2} style={{ textAlign: "center" }}>
          Tailfin
        </Title>
        <Center>
          <Fieldset legend="Log In" w="350px">
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
          </Fieldset>
        </Center>
      </Stack>
    </Container>
  );
}
