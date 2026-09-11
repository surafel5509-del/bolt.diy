import { WebContainer, configureAPIKey } from '@webcontainer/api';
import { WORK_DIR_NAME } from '~/utils/constants';
import { cleanStackTrace } from '~/utils/stacktrace';

interface WebContainerContext {
  loaded: boolean;
  error?: string;
}

export const webcontainerContext: WebContainerContext = import.meta.hot?.data.webcontainerContext ?? {
  loaded: false,
};

if (import.meta.hot) {
  import.meta.hot.data.webcontainerContext = webcontainerContext;
}

export let webcontainer: Promise<WebContainer> = new Promise(() => {
  // noop for ssr
});

if (!import.meta.env.SSR) {
  webcontainer =
    import.meta.hot?.data.webcontainer ??
    Promise.resolve().then(async () => {
      if (!window.isSecureContext) {
        throw new Error('WebContainer requires a secure HTTPS context.');
      }

      if (!window.crossOriginIsolated) {
        throw new Error(
          'WebContainer requires cross-origin isolation. Check that COOP is "same-origin" and COEP is "require-corp".',
        );
      }

      const apiKey = import.meta.env.VITE_WEB_CONTAINER_API_KEY;
      if (apiKey) {
        configureAPIKey(apiKey);
      }

      return WebContainer.boot({
        coep: 'require-corp',
        workdirName: WORK_DIR_NAME,
        forwardPreviewErrors: true,
      });
    })
      .then(async (webcontainer) => {
        webcontainerContext.loaded = true;
        webcontainerContext.error = undefined;

        const { workbenchStore } = await import('~/lib/stores/workbench');

        const response = await fetch('/inspector-script.js');
        if (!response.ok) {
          throw new Error(`Failed to load WebContainer inspector script (${response.status}).`);
        }

        const inspectorScript = await response.text();
        await webcontainer.setPreviewScript(inspectorScript);

        webcontainer.on('error', (error) => {
          console.error('WebContainer runtime error:', error);
          webcontainerContext.error = error instanceof Error ? error.message : String(error);
        });

        webcontainer.on('preview-message', (message) => {
          console.log('WebContainer preview message:', message);

          if (message.type === 'PREVIEW_UNCAUGHT_EXCEPTION' || message.type === 'PREVIEW_UNHANDLED_REJECTION') {
            const isPromise = message.type === 'PREVIEW_UNHANDLED_REJECTION';
            const title = isPromise ? 'Unhandled Promise Rejection' : 'Uncaught Exception';
            workbenchStore.actionAlert.set({
              type: 'preview',
              title,
              description: 'message' in message ? message.message : 'Unknown error',
              content: `Error occurred at ${message.pathname}${message.search}${message.hash}\nPort: ${message.port}\n\nStack trace:\n${cleanStackTrace(message.stack || '')}`,
              source: 'preview',
            });
          }
        });

        return webcontainer;
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        webcontainerContext.loaded = false;
        webcontainerContext.error = message;
        console.error('Failed to boot WebContainer:', error);
        throw error;
      });

  if (import.meta.hot) {
    import.meta.hot.data.webcontainer = webcontainer;
  }
}
