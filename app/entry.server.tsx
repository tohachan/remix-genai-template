import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import type { EntryContext } from '@remix-run/node';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const html = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );
  
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('<!DOCTYPE html>' + html));
      controller.close();
    },
  });
  
  return new Response(body, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      'Content-Type': 'text/html',
    }
  });
}
