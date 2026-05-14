import { AppShell } from './components/AppShell/AppShell';
import { TodosProvider } from './state/TodosContext';

function App() {
  return (
    <TodosProvider>
      <AppShell />
    </TodosProvider>
  );
}

export default App;
