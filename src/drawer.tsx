import React, { useState, useEffect } from 'react'
import { usePath, navigate } from 'hookrouter'
import { FAB } from './ui'
import { useSocket } from './hooks/use-socket'
import { useProjectContext } from './data/project'
import { arrowFunctionExpression } from '@babel/types'

type ItemProps = {
  label: string
  link?: string
  className?: string
  active?: boolean
}
const Item: React.FC<ItemProps> = ({
  link = '/',
  label = 'Label',
  active = false,
  className = ''
}) => {
  return (
    <li
      className={`${className} ${active ? 'active' : ''}`}
      onClick={() => navigate(link)}
    >
      {label}
    </li>
  )
}

const Drawer: React.FC = () => {
  const path = usePath()
  const ws = useSocket()
  const { state, dispatch } = useProjectContext()
  useEffect(() => {
    return ws.on(action => {
      if (action.type === 'loaded') {
        dispatch({
          type: 'loaded',
          state: action.data,
          project: action.project
        })
      }
    })
  }, [])
  return (
    <div className='drawer'>
      <div className='actions'>
        <FAB.Button
          small
          icon='add-file'
          onClick={() => {
            dispatch({
              type: 'reset'
            })
          }}
        />
        <FAB.Button
          small
          icon='save'
          onClick={() => {
            ws.send({ type: 'save', data: state })
          }}
        />
        <FAB.Button
          small
          icon='folder'
          onClick={() => {
            ws.send({ type: 'load' })
          }}
        />
      </div>
      <ul>
        <Item label='Rules' active={false} />
        <Item
          label='Constants'
          link='/constants'
          active={path === '/constants'}
        />
        <Item
          label='Cards'
          link='/cards'
          active={path === '/' || path === '/cards'}
        />
        <Item label='Collections' />
        <ul>
          <Item label='Create Collection' className='add' />
        </ul>
        <Item label='Decks' />
        <ul>
          <Item label='Create Collection' className='add' />
        </ul>
        <Item label='Quick Draw' />
        <Item label='Test Play' />
      </ul>
    </div>
  )
}

export default Drawer
