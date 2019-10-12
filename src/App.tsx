import React from 'react'
import './styles/app.sass'
import Drawer from './drawer'
import AppBar from './ui/app-bar'
import Router from './router'
import Providers from './providers'
import StatusBar from './ui/status-bar'

const App: React.FC = () => {
  return (
    <>
      <Providers>
        <AppBar />
        <div className='container'>
          <Drawer />
          <div className='content'>
            <Router />
          </div>
        </div>
        <StatusBar />
      </Providers>
    </>
  )
}

export default App
