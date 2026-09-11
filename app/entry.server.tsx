import { handleRequest as vercelHandleRequest, type EntryContext } from '@vercel/remix';
import { RemixServer } from '@remix-run/react';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const remixServer = <RemixServer context={remixContext} url={request.url} />;

  responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
  responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

  return vercelHandleRequest(request, responseStatusCode, responseHeaders, remixServer);
}
