import React from 'react';
import logo from './logo.svg';
import './App.css';

import AppContext from './context';

const defaultContext = {
  theme: 'dark',
};

function App() {
  return (
    <div className="App">
      <AppContext.Provider value={defaultContext}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </AppContext.Provider>
    </div>
  );
}

export default App;
