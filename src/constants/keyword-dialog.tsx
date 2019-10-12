import React, { useEffect, useState } from 'react'
import { Button, Dialog, Forms } from '../ui'

type CardTypeDialogProps = {
  modal: DataModalProps<CardKeyword>
  onClose: () => void
  onSave: (c: CardKeyword) => void
}
export const CardTypeDialog: React.FC<CardTypeDialogProps> = ({
  children,
  modal,
  onSave,
  onClose
}) => {
  const [value, setValue] = useState('')
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [valueBlurred, setValueBlurred] = useState(false)
  const keyword = modal.data
  const resetState = () => {
    setLabel('')
    setValue('')
    setDescription('')
    setValueBlurred(false)
  }
  useEffect(() => {
    if (keyword) {
      setLabel(keyword.label)
      setValue(keyword.label)
      setDescription(keyword.description)
    } else {
      resetState()
    }
  }, [keyword])
  return (
    <Dialog.Dialog open={modal.isOpen}>
      <Dialog.Header>
        <h1>{keyword ? 'Edit Card Type' : 'Add Card Type'}</h1>
      </Dialog.Header>
      <Dialog.Body>
        <form>
          <Forms.Row>
            <Forms.TextInput
              onChange={(v: string) => {
                setLabel(v)
                if (!valueBlurred) {
                  setValue(v.toLowerCase().replace(' ', '-'))
                }
              }}
              value={label}
              label='Label'
            />
          </Forms.Row>
          <Forms.Row>
            <Forms.TextArea
              onChange={setDescription}
              value={description}
              label='Description'
            />
          </Forms.Row>
        </form>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          variant='solid'
          color='secondary'
          label='Cancel'
          onClick={onClose}
        />
        <Button
          variant='solid'
          color='primary'
          label='Save'
          onClick={() => {
            onSave({
              label,
              value,
              description,
              id: (keyword && keyword.id) || undefined
            })
          }}
        />
      </Dialog.Footer>
    </Dialog.Dialog>
  )
}

export default CardTypeDialog
