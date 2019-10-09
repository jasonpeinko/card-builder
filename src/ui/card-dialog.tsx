import React, { useEffect } from 'react'
import Forms from './forms'
import Button from './button'
import { Dialog } from '.'
import useForm from '../hooks/use-form'
import { array } from 'prop-types'

type Props = {
  colors: Color[]
  keywords: CardKeyword[]
  modal: DataModalProps<Card>
  onClose: () => void
  onSave: (c: Card) => void
}
const buildColorOptions = (colors: Color[]) => {
  return colors.map(c => ({
    label: c.name,
    color: c.hex,
    value: c.id ? c.id.toString() : '0'
  }))
}
const buildKeywordOptions = (keywords: CardKeyword[]) => {
  return keywords.map(c => ({
    label: c.label,
    color: '#fff',
    value: c.id ? c.id.toString() : '0'
  }))
}
const CardDialog: React.FC<Props> = ({ colors, keywords, children, modal, onClose, onSave }) => {
  const { setValue, setValues, values, handleSubmit } = useForm<Card>(modal.data)
  useEffect(() => {
    console.log('setting', modal.data)
    setValues(modal.data)
  }, [modal.data])
  const onSubmit = (values: Card) => {
    console.log('submit', values)
    onSave(values)
  }
  const card = modal.data
  console.log(values)

  return (<Dialog.Dialog open={modal.isOpen}>
    <Dialog.Header>
      <h1>{card.id > -1 ? 'Edit Card' : 'Add Card'}</h1>
    </Dialog.Header>
    <Dialog.Body>
      <form>
        <Forms.Row>
          <Forms.TextInput label="Name"
            value={values.name}
            onChange={(v) => setValue('name', v)} />
          <Forms.TextInput label="Subtitle"
            value={values.subtitle}
            onChange={(v) => setValue('subtitle', v)} />
          <Forms.TextInput label="Cost"
            value={values.cost.toString()}
            onChange={(v) => setValue('cost', parseInt(v, 10))} />
        </Forms.Row>
        <Forms.Row>
          <Forms.Select label="Color"
            selected={values.colorID.toString()}
            onChange={(v) => {
              let value = ''
              if (Array.isArray(v)) {
                value = v[0].value
              } else {
                value = (v as any).value
              }
              setValue('colorID', parseInt(value, 10))
            }}
            options={buildColorOptions(colors)}
          />
        </Forms.Row>
        <Forms.Row>
          <Forms.Select label="Keywords"
            selected={values.keywords.map(k => k.toString())}
            onChange={() => null}
            isMulti
            options={buildKeywordOptions(keywords)}
          />
        </Forms.Row>
        <Forms.Row>
          <Forms.TextArea label="Body"
            value={values.body}
            onChange={(v) => setValue('body', v)} />
        </Forms.Row>
        <Forms.Row>
          <Forms.TextInput label="Power"
            value={values.power.toString()}
            onChange={(v) => setValue('power', parseInt(v, 10))} />
          <Forms.TextInput label="Toughness"
            value={values.toughness.toString()}
            onChange={(v) => setValue('toughness', parseInt(v, 10))} />
        </Forms.Row>
      </form>
    </Dialog.Body>
    <Dialog.Footer>
      <Button variant="solid" color="secondary" label="Cancel" onClick={() => modal.close()} />
      <Button variant="solid" color="primary" label="Save" onClick={() => handleSubmit(onSubmit)} />
    </Dialog.Footer>
  </Dialog.Dialog >)
}

export default CardDialog
