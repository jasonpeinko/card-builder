import React from 'react'
import Button from './button'

const AppBar: React.FC = () => {
  return (<div className="appbar">
    <span className="title">
      Card Builder
    </span>
    <div className="actions">
      <Button onClick={() => null} label="Test Draw" color="secondary" variant="solid" />
    </div>
  </div>)
}

export default AppBar
