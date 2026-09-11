import { useEffect, useState } from 'react';

const STORAGE_KEY = 'nova.webcontainer.apiKey';

export const WEB_CONTAINER_API_KEY_STORAGE_KEY = STORAGE_KEY;

export function WebContainerApiKeySettings() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setApiKey(window.localStorage.getItem(STORAGE_KEY) || '');
    } catch {
      // localStorage may be unavailable in privacy-restricted browsers.
    }
  }, []);

  const save = () => {
    const value = apiKey.trim();

    try {
      if (value) {
        window.localStorage.setItem(STORAGE_KEY, value);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch {
      setSaved(false);
    }
  };

  const clear = () => {
    setApiKey('');
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  };

  return (
    <div className="fixed right-3 top-3 z-[100]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2/95 px-3 py-2 text-xs font-medium text-bolt-elements-textSecondary shadow-lg backdrop-blur hover:text-bolt-elements-textPrimary"
        title="Configure WebContainer API key"
      >
        <span className="i-ph:terminal-window text-base" />
        WebContainer API
        <span className={apiKey ? 'i-ph:check-circle text-emerald-500' : 'i-ph:warning-circle text-amber-500'} />
      </button>

      {open && (
        <div className="mt-2 w-[min(92vw,390px)] rounded-xl border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 p-4 shadow-2xl">
          <div className="mb-3">
            <div className="text-sm font-semibold text-bolt-elements-textPrimary">WebContainer API key</div>
            <p className="mt-1 text-xs leading-5 text-bolt-elements-textTertiary">
              Enter your WebContainer API key. It is stored only in this browser and is never sent to this app's server.
              Save and reload so WebContainer can use the key before booting.
            </p>
          </div>

          <label className="block text-xs font-medium text-bolt-elements-textSecondary" htmlFor="webcontainer-api-key">
            API key
          </label>
          <input
            id="webcontainer-api-key"
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Paste your WebContainer API key"
            className="mt-1 w-full rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 px-3 py-2 text-sm text-bolt-elements-textPrimary outline-none focus:border-accent-500"
          />

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={clear}
              className="rounded-lg px-3 py-2 text-xs text-bolt-elements-textTertiary hover:bg-bolt-elements-background-depth-1 hover:text-bolt-elements-textPrimary"
            >
              Clear
            </button>
            <div className="flex items-center gap-2">
              {saved && <span className="text-xs text-emerald-500">Saved</span>}
              <button
                type="button"
                onClick={save}
                className="rounded-lg bg-accent-500 px-3 py-2 text-xs font-medium text-white hover:bg-accent-600"
              >
                Save & reload
              </button>
            </div>
          </div>

          <p className="mt-3 border-t border-bolt-elements-borderColor pt-3 text-[11px] leading-4 text-bolt-elements-textTertiary">
            Your Vercel domain must also be allowed by the WebContainer API key configuration. If the key provider rejects
            the referrer, adding the key here alone cannot override that restriction.
          </p>
        </div>
      )}
    </div>
  );
}
