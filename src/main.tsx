import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerQueryClient } from './app/features/auth/session.ts';


const queryClient = new QueryClient();
registerQueryClient(queryClient);

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  worker.start({onUnhandledRequest: 'bypass'});
}

enableMocking().then(() => {
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
});
