import React, { useEffect } from 'react'
import * as yup from 'yup'
import { Dialog } from '.'
import useForm from '../hooks/use-form'
import Button from './button'
import Forms from './forms'

type Props = {
  modal: DataModalProps<Collection>
  onClose: () => void
  onSave: (c: Collection) => void
}

const CollectionModal: React.FC<Props> = ({
  children,
  modal,
  onClose,
  onSave
}) => {
  const {
    setValue,
    getError,
    setValues,
    values,
    errors,
    resetErrors,
    handleSubmit
  } = useForm<Collection>(
    modal.data,
    yup.object().shape({
      color: yup.string(),
      name: yup.string(),
      cards: yup.object()
    })
  )
  useEffect(() => {
    setValues(modal.data)
    resetErrors()
  }, [modal.data])
  const onSubmit = (values: Collection) => {
    onSave(values)
  }
  const collection = modal.data

  return (
    <Dialog.Dialog className='' open={modal.isOpen}>
      <Dialog.Header>
        <h1>{collection.id > -1 ? 'Edit Collection' : 'Add Collection'}</h1>
      </Dialog.Header>
      <Dialog.Body>
        <form>
          <Forms.Row>
            <Forms.TextInput
              label='Name'
              error={getError('name')}
              value={values.name}
              onChange={v => setValue('name', v)}
            />
          </Forms.Row>
          <Forms.Row>
            <Forms.ColorPicker
              label='Color'
              color={values.color}
              onChange={c => setValue('color', c)}
            />
          </Forms.Row>
        </form>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          variant='solid'
          color='secondary'
          label='Cancel'
          onClick={() => modal.close()}
        />
        <Button
          variant='solid'
          color='primary'
          label='Save'
          onClick={() => handleSubmit(onSubmit)}
        />
      </Dialog.Footer>
    </Dialog.Dialog>
  )
}

export default CollectionModal
