import React from 'react'
import Icon from './icon'

type Props = {
  icon: string
  className?: string
  small?: boolean
  onClick: () => void
}
const FAB: React.FC<Props> = ({
  className = '',
  children,
  small = false,
  icon,
  onClick
}) => {
  return (
    <div
      className={`fab ${small ? 'small' : ''} ${className}`}
      onClick={onClick}
    >
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
