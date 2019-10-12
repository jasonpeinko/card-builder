import React from 'react'
import ColorDialog from './constants/color-dialog'
import KeywordDialog from './constants/keyword-dialog'
import { ContstantsDispatch, useProjectContext } from './data/project'
import { Button, FAB, List } from './ui'
import { useDataModal } from './ui/dialog'

type ColorProps = {
  color: Color
  dispatch: ContstantsDispatch
  editColor: (c: Color) => void
}
const Color: React.FC<ColorProps> = ({ color, dispatch, editColor }) => {
  return (
    <div className='color' onClick={() => editColor(color)}>
      <div className='preview' style={{ background: color.hex }}></div>
      <span>{color.name}</span>
      <Button
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          dispatch({ type: 'color.remove', color })
        }}
        icon='close'
        variant='transparent'
        size='small'
      />
    </div>
  )
}

const DeleteButton = ({ onClick }: any) => {
  return (
    <Button
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      icon='close'
      variant='transparent'
      size='small'
    />
  )
}

type Action =
  | { type: 'color.open'; color: Color | null }
  | { type: 'color.close' }
  | { type: 'keyword.open'; keyword: CardKeyword | null }
  | { type: 'keyword.close' }
const Constants: React.FC = () => {
  const {
    state: { colors, keywords },
    dispatch
  } = useProjectContext()
  const colorModal = useDataModal<Color>(() => ({ name: '', hex: '#ff00ff' }))
  const keywordModal = useDataModal<CardKeyword>(() => ({
    label: '',
    value: '',
    description: ''
  }))
  return (
    <div className='page constants'>
      <section>
        <div className='constant-header'>
          <ColorDialog
            modal={colorModal}
            onClose={() => {
              colorModal.close()
            }}
            onSave={color => {
              console.log('save color', color)
              dispatch({ type: 'color.upsert', color })
              colorModal.close()
            }}
          />
          <h1>Colors</h1>
          <FAB.Button
            small
            icon='plus'
            onClick={() => {
              colorModal.open({ name: '', hex: '#00ff00' })
            }}
          />
        </div>
        <div className='color-list'>
          {console.log(colors)}
          {colors.map((c: Color) => (
            <Color
              editColor={() => colorModal.open(c)}
              dispatch={dispatch}
              color={c}
              key={c.name}
            />
          ))}
        </div>
      </section>
      <section>
        <KeywordDialog
          modal={keywordModal}
          onClose={() => {
            keywordModal.close()
          }}
          onSave={keyword => {
            dispatch({ type: 'keyword.upsert', keyword: keyword })
            keywordModal.close()
          }}
        />
        <div className='constant-header'>
          <h1>Keywords</h1>
          <FAB.Button
            small
            icon='plus'
            onClick={() => {
              keywordModal.open({ label: '', value: '', description: '' })
            }}
          />
        </div>
        <List.Container>
          {keywords.map(k => {
            return (
              <List.Item
                key={k.id}
                onClick={() => {
                  keywordModal.open(k)
                }}
                className='card-type'
              >
                <div className='row'>
                  <span>{k.label}</span>
                  <DeleteButton
                    onClick={() => {
                      dispatch({ type: 'keyword.remove', keyword: k })
                    }}
                  />
                </div>
                <span className='description'>{k.description}</span>
              </List.Item>
            )
          })}
        </List.Container>
      </section>
    </div>
  )
}

export default Constants
