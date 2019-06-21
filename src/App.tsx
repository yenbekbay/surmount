import React from 'react';

interface AppProps {}

export const App: React.FC<AppProps> = _props => (
  <div className="min-h-screen flex items-center justify-center">
    <h1 className="text-5xl text-purple font-sans">Hello world!</h1>
  </div>
);
