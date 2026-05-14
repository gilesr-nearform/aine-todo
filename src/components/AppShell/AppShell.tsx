import { GovieBranding } from './GovieBranding';
import { Header } from './Header';
import { MainContent } from './MainContent';
import { Sidebar } from '../Sidebar/Sidebar';
import { TodoInputBar } from '../TodoInputBar/TodoInputBar';
import { UndoToastContainer } from '../UndoToast/UndoToastContainer';

export function AppShell() {
  return (
    <div className="flex h-dvh w-full flex-col bg-white text-gray-900">
      <GovieBranding />
      <Header />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden min-h-0 md:flex">
          <Sidebar />
        </aside>
        <div className="flex min-h-0 flex-1 flex-col">
          <MainContent />
          <div
            className="w-full border-t border-gray-200 bg-white px-4 pt-3 sm:px-6"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="mb-3 flex justify-center">
              <UndoToastContainer />
            </div>
            <TodoInputBar />
          </div>
        </div>
      </div>
    </div>
  );
}
