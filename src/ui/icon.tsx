import React from 'react'

type Props = {
  icon: string
  size?: number
}
const Icon: React.FC<Props> = ({ icon, size = 24 }) => {
  return (<i className={`lni-${icon}`} style={{ fontSize: size }}></i>)
}

export default Icon
