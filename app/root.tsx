import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import {
  Button,
  ColorSchemeScript,
  Container,
  Group,
  MantineProvider,
  Stack,
  Title,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { IconRocket } from "@tabler/icons-react";

import { AuthProvider } from "./util/auth";
import { ApiProvider } from "./util/api";

export const links: LinksFunction = () => [
  {
    rel: "apple-touch-icon",
    href: "/favicon/apple-touch-icon.png",
    sizes: "180x180",
  },
  {
    rel: "icon",
    href: "/favicon/favicon-32x32.png",
    type: "image/png",
    sizes: "32x32",
  },
  {
    rel: "icon",
    href: "/favicon/favicon-16x16.png",
    type: "image/png",
    sizes: "16x16",
  },
  { rel: "manifest", href: "/favicon/site.webmanifest" },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Oops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Container>
            <Stack>
              <Title order={2} pt="xl" style={{ textAlign: "center" }}>
                {isRouteErrorResponse(error)
                  ? `Error ${error.status} - ${error.statusText}`
                  : error instanceof Error
                  ? error.message
                  : "Unknown Error"}
              </Title>
              <Group justify="center">
                <Button
                  leftSection={<IconRocket />}
                  component={Link}
                  to="/logbook"
                  variant="default"
                >
                  Get me out of here!
                </Button>
              </Group>
            </Stack>
          </Container>
        </MantineProvider>
      </body>
    </html>
  );
}

export async function loader() {
  return json({
    ENV: {
      TAILFIN_API_URL: process.env.TAILFIN_API_URL ?? "http://localhost:8081",
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <ApiProvider apiUrl={data.ENV.TAILFIN_API_URL}>
          <MantineProvider theme={{ primaryColor: "violet" }}>
            <ModalsProvider>
              <AuthProvider>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
              </AuthProvider>
            </ModalsProvider>
          </MantineProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
