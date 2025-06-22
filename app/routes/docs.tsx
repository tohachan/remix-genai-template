import { Outlet } from '@remix-run/react';

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css',
    },
  ];
}

export default function DocsLayout() {
  return <Outlet />;
}
