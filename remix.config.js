import { defineRoutes } from "@remix-run/dev/dist/config/routes.js";

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  postcss: true,
  ignoredRouteFiles: ["**/.*"],
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route("/", "routes/_index.tsx", { index: true });
      route("logbook", "routes/logbook/route.tsx", () => {
        route("dashboard", "routes/logbook/dashboard.tsx");
        route("admin", "routes/logbook/admin.tsx");
        route("me", "routes/logbook/me.tsx");
        route("aircraft", "routes/logbook/aircraft.tsx");
        route("flights", "routes/logbook/flights/route.tsx", () => {
          route("", "routes/logbook/flights/_index.tsx", { index: true });
          route(":id", "routes/logbook/flights/$id.tsx");
          route("new", "routes/logbook/flights/new.tsx");
          route("edit/:id", "routes/logbook/flights/edit/$id.tsx");
        });
      });
      route("login", "routes/login.tsx");
    });
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
