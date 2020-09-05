import React from 'react';
import './App.css';

import AppContext from './context';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

const defaultContext = {
  theme: 'dark',
};

function App() {
  return (
    <div className="App">
      <AppContext.Provider value={defaultContext}>
        <Header />
        <Main />
        <Footer />
      </AppContext.Provider>
    </div>
  );
}

export default App;
