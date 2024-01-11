import { useQuery } from "@tanstack/react-query";
import { useApi } from "./api";

export function useAircraft() {
  const client = useApi();

  const aircraft = useQuery({
    queryKey: ["aircraft-list"],
    queryFn: async () => await client.get(`/aircraft`).then((res) => res.data),
  });

  return aircraft;
}
