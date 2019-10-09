import React from 'react';
import logo from './logo.svg';
import './styles/app.sass'
import Drawer from './drawer'
import AppBar from './ui/app-bar'
import Router from './router'
import Providers from './providers'

const App: React.FC = () => {
  return (
    <>
      <AppBar />
      <div className="container">
        <Drawer />
        <div className="content">
          <Providers>
            <Router />
          </Providers>
        </div>
      </div>
    </>
  )
}

export default App;
