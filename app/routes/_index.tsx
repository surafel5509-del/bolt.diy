import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';

export const meta: MetaFunction = () => {
  return [
    { title: 'NOVA Studio — AI Software Workspace' },
    {
      name: 'description',
      content: 'A focused AI software workspace for turning ideas into working products.',
    },
    { name: 'theme-color', content: '#090b10' },
  ];
};

export const loader = () => json({});

export default function Index() {
  return (
    <div className="nova-app flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <Header />
      <main className="nova-main flex-1 min-h-0">
        <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
      </main>
    </div>
  );
}
