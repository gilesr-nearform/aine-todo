import { AppShell } from './components/AppShell/AppShell';
import { I18nProvider } from './i18n/I18nContext';
import { TodosProvider } from './state/TodosContext';

function App() {
  return (
    <I18nProvider>
      <TodosProvider>
        <AppShell />
      </TodosProvider>
    </I18nProvider>
  );
}

export default App;
