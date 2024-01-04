import { client } from "@/util/api";
import { useAuth } from "@/util/auth";
import { Container, Text, Title } from "@mantine/core";
import { useNavigate } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Me() {
  const user = useQuery({
    queryKey: ["user"],
    queryFn: async () => await client.get(`users/me`).then((res) => res.data),
    retry: (failureCount, error) => {
      return !error || error.response?.status !== 401;
    },
  });

  const { clearUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError && user.error.response?.status === 401) {
      clearUser();
      navigate("/login");
    }
  }, [user]);

  return (
    <Container>
      <Title order={2}>{user.data.username}</Title>
      <Text>Level {user.data.level}</Text>
    </Container>
  );
}
