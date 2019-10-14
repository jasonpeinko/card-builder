import React, { useState, useEffect } from 'react'
import { usePath, navigate } from 'hookrouter'
import { FAB } from './ui'
import { useSocket } from './hooks/use-socket'
import { useProjectContext } from './data/project'
import { useDataModal } from './ui/dialog'
import CollectionModal from './ui/collection-modal'
import Icon from './ui/icon'

type ItemProps = {
  label: string
  link?: string
  className?: string
  active?: boolean
  onClick?: () => void
  style?: {}
}
const Item: React.FC<ItemProps> = ({
  link = '/',
  label = 'Label',
  active = false,
  className = '',
  style,
  onClick,
  children
}) => {
  console.log(style)
  return (
    <li
      className={`${className} ${active ? 'active' : ''}`}
      style={style}
      onClick={() => (onClick ? onClick() : navigate(link))}
    >
      {children}
      {label}
    </li>
  )
}

const Drawer: React.FC = () => {
  const path = usePath()
  const ws = useSocket()
  const { state, dispatch, getColor } = useProjectContext()
  const { collections } = state
  const collectionModal = useDataModal<Collection>(() => {
    return {
      id: -1,
      name: 'New Collection',
      color: '#ff0000',
      cards: []
    }
  })
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
          {collections.map(c => {
            console.log(path)
            return (
              <Item
                key={c.id}
                label={c.name}
                active={path === '/collection/' + c.id}
                link={`/collection/${c.id}`}
                style={{ color: c.color }}
              />
            )
          })}
          <Item
            label='Create Collection'
            className='add'
            onClick={() => {
              collectionModal.open(null)
            }}
          >
            <Icon icon='plus' size={18} />
          </Item>
        </ul>
        <Item label='Quick Draw' />
        <Item label='Test Play' />
      </ul>
      <CollectionModal
        modal={collectionModal}
        onClose={() => {}}
        onSave={values => {
          dispatch({ type: 'collection.upsert', collection: values })
          collectionModal.close()
        }}
      />
    </div>
  )
}

export default Drawer
