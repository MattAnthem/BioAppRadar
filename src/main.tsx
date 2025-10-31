import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { BrowserRouter } from 'react-router-dom';
import { loadConfig } from './config.ts';
import { initAxiosClient } from './api/axiosClient.ts';


const queryClient = new QueryClient();


loadConfig().then((config) => {

    initAxiosClient(config.API_BASE_URL);

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </QueryClientProvider>
      </StrictMode>
    );
  })
  .catch((err) => {
    console.error('Erreur config.json :', err);
    document.body.innerHTML = `<p style="color:red;text-align:center;margin-top:2rem;">Erreur de configuration<br>${err.message}</p>`;
});



