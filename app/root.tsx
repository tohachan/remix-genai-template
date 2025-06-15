import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { ReduxProvider } from '~/shared/lib/providers/redux-provider';

import styles from './tailwind.css?url';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-full bg-background font-sans antialiased">
        <ReduxProvider>
          <Outlet />
        </ReduxProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
