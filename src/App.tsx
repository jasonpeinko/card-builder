import React from 'react'
import './styles/app.sass'
import Drawer from './drawer'
import AppBar from './ui/app-bar'
import Router from './router'
import Providers from './providers'
import StatusBar from './ui/status-bar'
import ProjectPicker from './project-picker'
import { useAppContext } from './data/app'

const ForceProject: React.FC<{}> = ({ children }) => {
  const {
    state: { currentProject }
  } = useAppContext()
  if (currentProject === '') {
    return <ProjectPicker />
  }
  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <>
      <Providers>
        <AppBar />
        <ForceProject>
          <>
            <div className='container'>
              <Drawer />
              <div className='content'>
                <Router />
              </div>
            </div>
            <StatusBar />
          </>
        </ForceProject>
      </Providers>
    </>
  )
}

export default App
