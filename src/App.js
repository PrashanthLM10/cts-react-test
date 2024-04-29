import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import ComponentResolver from './components/componentResolver/component-resolver';
import Messages from './components/messages/messages.component';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Messages />
    },
    {
      path: '/mask',
      element: <ComponentResolver />
    },
    {
      path: '/notes',
      async lazy() {
        const { default: Notes } = await import('./components/notes/notes.component');
        return {Component: Notes};
      }
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
