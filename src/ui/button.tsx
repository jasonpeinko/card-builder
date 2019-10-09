import React from 'react'
import Icon from './icon'

type Props = {
  variant?: 'outline' | 'solid' | 'transparent',
  color?: 'secondary' | 'primary'
  icon?: string
  label?: string
  size?: 'small' | 'default' | 'large'
  onClick?: (e: React.MouseEvent) => void
}
const Button: React.FC<Props> = ({
  variant = 'solid',
  onClick = () => null,
  color = 'primary',
  icon = '',
  label = '',
  size = 'default'
}) => {
  return (<div onClick={onClick} className={`button ${color} ${size} ${variant}`}>
    {icon.length > 0 && <Icon icon={icon} size={16} />}
    {label}
  </div>)
}

export default Button
