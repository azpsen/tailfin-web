import { TailfinAppShell } from "@/ui/nav/app-shell";
import { useAuth } from "@/util/auth";
import type { MetaFunction } from "@remix-run/node";
import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Tailfin" },
    { name: "description", content: "Self-hosted flight logbook" },
  ];
};

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  return (
    <TailfinAppShell>
      <Outlet />
    </TailfinAppShell>
  );
}
