import React from 'react'
import Icon from './icon'

type Props = {
  icon: string
  small?: boolean
  onClick: () => void
}
const FAB: React.FC<Props> = ({ children, small = false, icon, onClick }) => {
  return (
    <div className={`fab ${small ? 'small' : ''}`} onClick={onClick}>
      <Icon icon={icon} size={small ? 20 : 48} />
      {children}
    </div>
  )
}

const FABGroup: React.FC = ({ children }) => {
  return <div className='fab-group'>{children}</div>
}

export default {
  Button: FAB,
  Group: FABGroup
}
