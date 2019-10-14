import React, { useEffect } from 'react'
import { useSocket } from './hooks/use-socket'
import { FAB } from './ui'
import { useProjectContext } from './data/project'
import { useAppContext } from './data/app'

type ProjectPickerProps = {}
export const ProjectPicker: React.FC<ProjectPickerProps> = ({ children }) => {
  const ws = useSocket()

  const { dispatch } = useProjectContext()
  const { dispatch: appDispatch } = useAppContext()
  useEffect(() => {
    return ws.on(action => {
      if (action.type === 'saved') {
        appDispatch({
          type: 'set-project',
          project: action.project
        })
        dispatch({
          type: 'reset',
          project: action.project
        })
      }
      if (action.type === 'loaded') {
        console.log('loaded!')
        appDispatch({
          type: 'set-project',
          project: action.project
        })
        dispatch({
          type: 'loaded',
          state: action.data,
          project: action.project
        })
      }
    })
  }, [])
  return (
    <div className='project-picker'>
      <div>
        <div className='branding'>
          <h1>Card Builder</h1>
          <p>Select an existing project to get started or create a new one.</p>
        </div>
      </div>
      <div className='button-group'>
        <div>
          <FAB.Button
            icon='add-file'
            onClick={() => ws.send({ type: 'save', data: {} })}
          >
            <h2>New Project</h2>
          </FAB.Button>
        </div>
        <div>
          <FAB.Button
            icon='folder'
            className='secondary'
            onClick={() => ws.send({ type: 'load' })}
          >
            <h2>Load Project</h2>
          </FAB.Button>
        </div>
      </div>
    </div>
  )
}
export default ProjectPicker
