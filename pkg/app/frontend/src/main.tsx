import '@fontsource/ibm-plex-mono';
import '@fontsource/ibm-plex-sans';
import '@fontsource/ibm-plex-sans/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import Root from './routes/Root';
import RouterError from './routes/RouterError';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <RouterError />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
