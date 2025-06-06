import { RemixServer } from '@remix-run/react'
import { renderToReadableStream } from 'react-dom/server'
import type { EntryContext } from '@remix-run/node'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      status: responseStatusCode,
      headers: responseHeaders
    }
  )
}
