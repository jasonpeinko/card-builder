import React from 'react'

type ContainerProps = {
}
export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (<div className="list">
    {children}
  </div>)
}

type ItemProps = {
  className?: string
  onClick?: OnClick
}
export const Item: React.FC<ItemProps> = ({ className = '', children, onClick }) => {
  return (<div className={`list-item ${className}`} onClick={() => onClick && onClick()}>
    {children}
  </div>)
}


export default {
  Container,
  Item
}
