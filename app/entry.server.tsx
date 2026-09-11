import { handleRequest as vercelHandleRequest } from '@vercel/remix';
import type { EntryContext } from '@vercel/remix';
import { RemixServer } from '@remix-run/react';
import { themeStore } from '~/lib/stores/theme';
import { Head } from './root';
import { renderHeadToString } from 'remix-island';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const head = renderHeadToString({ request, remixContext, Head });
  const remixServer = <RemixServer context={remixContext} url={request.url} />;

  const htmlStart = `<!DOCTYPE html><html lang="en" data-theme="${themeStore.value}"><head>${head}</head><body><div id="root" class="w-full h-full">`;
  const htmlEnd = '</div></body></html>';

  responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
  responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

  return vercelHandleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixServer,
    htmlStart,
    htmlEnd,
  );
}
