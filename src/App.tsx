import { AppShell } from './components/AppShell/AppShell';
import { I18nProvider } from './i18n/I18nContext';
import { TodosProvider } from './state/TodosContext';
import { ThemeProvider } from './theme/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <TodosProvider>
          <AppShell />
        </TodosProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
