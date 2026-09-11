import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('nova-header flex items-center px-4 h-[var(--header-height)]', {
        'nova-header-idle': !chat.started,
        'nova-header-active': chat.started,
      })}
    >
      <div className="nova-brand flex items-center gap-3 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <button
          type="button"
          className="nova-menu-trigger"
          aria-label="Open workspace menu"
          title="Workspace menu"
        >
          <span className="i-ph:sidebar-simple-duotone text-lg" />
        </button>

        <a href="/" className="nova-wordmark" aria-label="NOVA Studio home">
          <span className="nova-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="nova-wordmark-text">
            NOVA<span>Studio</span>
          </span>
        </a>
      </div>

      {chat.started && (
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
