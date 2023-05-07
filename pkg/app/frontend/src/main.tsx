import '@fontsource/ibm-plex-mono';
import '@fontsource/ibm-plex-sans';
import '@fontsource/ibm-plex-sans/700.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import Home from './routes/Home';
import Root from './routes/Root';
import RouterError from './routes/RouterError';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <RouterError />,
        children: [
            {
                element: <Home />,
                index: true,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>,
);
