import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "./api";
import { useNavigate } from "@remix-run/react";

type User = {
  username: string;
  level: number;
};

export function useMe() {
  return useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: () => client.get(`/users/me`).then((res) => res.data),
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSignOut = async () => {
    queryClient.setQueryData(["user"], null);
    const res = await client.post("/auth/logout");
    if (res.status == 200) {
      navigate("/login");
    } else {
      console.error("Failed to log out");
    }
  };

  return onSignOut;
}

export function useLogin() {
  const navigate = useNavigate();

  const { mutate: signInMutation } = useMutation({
    mutationFn: async (values) => {
      return await client.postForm("/auth/login", values);
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.access_token);
      localStorage.setItem("refresh-token", data.data.refresh_token);
      navigate("/logbook");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return signInMutation;
}
