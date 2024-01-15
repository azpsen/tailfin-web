import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./api";

export function useAircraft() {
  const client = useApi();

  const aircraft = useQuery({
    queryKey: ["aircraft-list"],
    queryFn: async () => await client.get(`/aircraft`).then((res) => res.data),
  });

  return aircraft;
}

export function useFlights(filter: string = "", value: string = "") {
  const client = useApi();

  const flights = useQuery({
    queryKey: ["flights-list"],
    queryFn: async () =>
      await client
        .get(
          `/flights/by-date?order=1${
            filter !== "" && value !== ""
              ? `&filter=${filter}&value=${value}`
              : ""
          }`
        )
        .then((res) => res.data),
  });

  return flights;
}

export function usePatchFlight(
  id: string,
  field: string,
  onSuccess: () => void
) {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: string | string[] | number | Date | null) =>
      await client
        .patch(`/flights/${id}`, { [field]: value })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id] });
      queryClient.invalidateQueries({ queryKey: ["flights-list"] });
      onSuccess();
    },
  });
}
