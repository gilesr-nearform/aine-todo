import { Header } from './Header';
import { MainContent } from './MainContent';
import { TodoInputBar } from '../TodoInputBar/TodoInputBar';

export function AppShell() {
  return (
    <div className="flex h-dvh w-full flex-col bg-white">
      <Header />
      <MainContent />
      <div
        className="w-full border-t border-gray-200 bg-white px-4 pt-4 sm:px-6"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <TodoInputBar />
      </div>
    </div>
  );
}
