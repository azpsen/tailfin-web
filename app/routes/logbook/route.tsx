import { TailfinAppShell } from "@/ui/nav/app-shell";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Tailfin" },
    { name: "description", content: "Self-hosted flight logbook" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <TailfinAppShell>
        <Outlet />
      </TailfinAppShell>
    </div>
  );
}
