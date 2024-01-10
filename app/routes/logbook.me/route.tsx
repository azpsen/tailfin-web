import ErrorDisplay from "@/ui/error-display";
import { useApi } from "@/util/api";
import {
  Avatar,
  Button,
  Center,
  Container,
  Fieldset,
  Group,
  Loader,
  PasswordInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFingerprint } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function Me() {
  const client = useApi();

  const user = useQuery({
    queryKey: ["user"],
    queryFn: async () => await client.get(`users/me`).then((res) => res.data),
  });

  const updatePassword = useMutation({
    mutationFn: async (values: {
      current_psk: string;
      new_psk: string;
      confirm_new_psk: string;
    }) => {
      console.log({
        current_password: values.current_psk,
        new_password: values.new_psk,
      });
      await client.put(`/users/me/password`, {
        current_password: values.current_psk,
        new_password: values.new_psk,
      });
    },
  });

  const updatePskForm = useForm({
    initialValues: {
      current_psk: "",
      new_psk: "",
      confirm_new_psk: "",
    },
    validate: {
      current_psk: (value) =>
        value.length === 0 ? "Please enter your current password" : null,
      new_psk: (value) => {
        if (value.length === 0) return "Please enter a new password";
        if (value.length < 8 || value.length > 16)
          return "Password must be between 8 and 16 characters";
      },
      confirm_new_psk: (value, values) => {
        if (value.length === 0) return "Please confirm your new password";
        if (value.length < 8 || value.length > 16)
          return "Password must be between 8 and 16 characters";
        if (value !== values.new_psk) return "Passwords must match";
      },
    },
  });

  return (
    <Container>
      {user.isLoading ? (
        <Center h="calc(100vh - 95px)">
          <Loader />
        </Center>
      ) : user.isError ? (
        <Center h="calc(100vh - 95px)">
          <ErrorDisplay error="Error Loading User" />
        </Center>
      ) : user.data ? (
        <Stack pt="xl">
          <Stack align="center" pb="xl">
            <Avatar size="xl" />
            <Title order={2}>{user.data.username}</Title>
            <Text>
              {user.data.level === 2
                ? "Admin"
                : user.data.level === 1
                ? "User"
                : "Guest"}
            </Text>{" "}
          </Stack>
          <form
            onSubmit={updatePskForm.onSubmit((values) => {
              updatePassword.mutate(values);
            })}
          >
            <Fieldset legend="Update Password">
              <PasswordInput
                label="Current Password"
                {...updatePskForm.getInputProps("current_psk")}
              />
              <PasswordInput
                mt="sm"
                label="New Password"
                {...updatePskForm.getInputProps("new_psk")}
              />
              <PasswordInput
                mt="sm"
                label="Confirm New Password"
                {...updatePskForm.getInputProps("confirm_new_psk")}
              />
              <Group justify="flex-end" mt="lg">
                {updatePassword.isPending ? (
                  <Text>Updating...</Text>
                ) : updatePassword.isError ? (
                  updatePassword.error &&
                  (updatePassword.error as AxiosError).response?.status ===
                    403 ? (
                    <Text c="red">Incorrect password</Text>
                  ) : (
                    <Text c="red">Failed: {updatePassword.error.message}</Text>
                  )
                ) : updatePassword.isSuccess ? (
                  <Text c="green">Updated</Text>
                ) : null}
                <Button type="submit" leftSection={<IconFingerprint />}>
                  Update
                </Button>
              </Group>
            </Fieldset>
          </form>
        </Stack>
      ) : (
        <Text c="red">Unknown Error</Text>
      )}
    </Container>
  );
}
