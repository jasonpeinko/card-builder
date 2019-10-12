import React from 'react'
import { useProjectContext } from '../data/project'

type StatusBarProps = {}
export const StatusBar: React.FC<StatusBarProps> = ({ children }) => {
  const {
    state: {
      cards,
      meta: { projectFile }
    }
  } = useProjectContext()
  return (
    <div className='status-bar'>
      <div className='group'>
        {projectFile.length ? projectFile : 'No project selceted'}
      </div>
      <div className='group'>
        <div className='cards'>{cards.length} cards</div>
      </div>
      {children}
    </div>
  )
}

export default StatusBar
