import { TailfinAppShell } from "@/ui/nav/app-shell";
import { useAuth } from "@/util/auth";
import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Tailfin" },
    { name: "description", content: "Self-hosted flight logbook" },
  ];
};

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (location.pathname === "/logbook") {
      navigate("/logbook/dashboard");
    }
  }, [user, loading, navigate, location]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: Error) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
              navigate("/login");
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000,
            retry: (failureCount, error: Error) => {
              return (
                failureCount < 3 &&
                (!error ||
                  (error instanceof AxiosError &&
                    error.response?.status !== 401 &&
                    error.response?.status !== 404))
              );
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TailfinAppShell>
        <Outlet />
      </TailfinAppShell>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
