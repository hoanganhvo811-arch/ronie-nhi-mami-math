// src/App.tsx
import React from 'react';
import { AppShell } from './app/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
};

export default App;
