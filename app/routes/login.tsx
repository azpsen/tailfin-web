import { useAuth } from "@/util/auth";
import {
  Button,
  Center,
  Container,
  Fieldset,
  Group,
  Image,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function LoginPage() {
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.length === 0 ? "Please enter a username" : null,
      password: (value) =>
        value.length === 0 ? "Please enter a password" : null,
    },
  });

  const { signin } = useAuth();

  useEffect(() => {
    document.title = "Log In - Tailfin";
  });

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
              onSubmit={form.onSubmit(async (values) => {
                setError("");
                try {
                  await signin(values)
                    .then(() => {})
                    .catch((err) => {
                      console.log(err);
                      setError((err as Error).message);
                    });
                } catch (err) {
                  console.log(err);
                  setError((err as Error).message);
                }
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
              {error === "" ? (
                <Space mt="md" />
              ) : (
                <Text mt="md" c="red">
                  {error}
                </Text>
              )}
              <Group justify="center">
                <Button type="submit" mt="xl" fullWidth>
                  Log In
                </Button>
              </Group>
            </form>
          </Fieldset>
        </Center>
      </Stack>
    </Container>
  );
}

export default function Login() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
}
