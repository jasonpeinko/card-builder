import React, { useEffect, useState } from 'react'
import Forms from './forms'
import Button from './button'
import { Dialog } from '.'
import useForm from '../hooks/use-form'
import { useSocket } from '../hooks/use-socket'
import nanoid from 'nanoid'
import { useImageCache } from '../hooks/use-image-cache'
import Card from './card'
import * as yup from 'yup'

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
const keywordOption = (k: CardKeyword) => {
  return {
    label: k.label,
    color: '#fff',
    value: k.id ? k.id.toString() : '0'
  }
}
const buildKeywordOptions = (keywords: CardKeyword[]) => {
  return keywords.map(keywordOption)
}
type KeywordRow = {
  data: { id: number; count: number }
  keyword: CardKeyword
  setCount: (v: string) => void
}
const KeywordRow: React.FC<KeywordRow> = ({ data, keyword, setCount }) => {
  return (
    <div className='keyword-row'>
      <span className='label'>{keyword.label}</span>
      <Forms.TextInput
        label=''
        value={data.count.toString()}
        onChange={setCount}
      />
    </div>
  )
}
const CardDialog: React.FC<Props> = ({
  colors,
  keywords,
  children,
  modal,
  onClose,
  onSave
}) => {
  const [imageData, setImageData] = useState('')
  const { storeImage } = useImageCache()
  const {
    setValue,
    getError,
    setValues,
    values,
    errors,
    resetErrors,
    handleSubmit
  } = useForm<Card>(
    modal.data,
    yup.object().shape({
      power: yup.number().typeError('must be a number'),
      toughness: yup.number().typeError('must be a number'),
      cost: yup.number().typeError('must be a number'),
      keywords: yup.array().of(
        yup.object().shape({
          id: yup.number(),
          count: yup.number()
        })
      )
    })
  )
  const ws = useSocket()
  useEffect(() => {
    return ws.on(action => {
      if (action.type === 'paste-image') {
        setImageData(action.data)
        if (values.image === '') {
          setValue('image', `img/${nanoid()}.png`)
        }
      }
    })
  })
  useEffect(() => {
    setValues(modal.data)
    resetErrors()
    setImageData('')
  }, [modal.data])
  const onSubmit = (values: Card) => {
    storeImage(values.image, imageData)
    onSave(values)
  }
  const card = modal.data

  return (
    <Dialog.Dialog className='card-modal' open={modal.isOpen}>
      <Dialog.Header>
        <h1>{card.id > -1 ? 'Edit Card' : 'Add Card'}</h1>
      </Dialog.Header>
      <Dialog.Body>
        <form>
          <Forms.Row>
            {/* <div
              className='art'
              style={{
                backgroundImage: `url(data:image/png;base64,${imageData}) `
              }}
            ></div> */}
            <div className='preview'>
              <Card card={values} imageBase64={imageData} />
            </div>
            <div className=''>
              <Forms.Row>
                <Forms.TextInput
                  label='Name'
                  error={getError('name')}
                  value={values.name}
                  onChange={v => setValue('name', v)}
                />
                <Forms.TextInput
                  label='Subtitle'
                  error={getError('subtitle')}
                  value={values.subtitle}
                  onChange={v => setValue('subtitle', v)}
                />
              </Forms.Row>
              <Forms.Row>
                <Forms.TextInput
                  label='Cost'
                  value={values.cost.toString()}
                  error={getError('cost')}
                  onChange={v => setValue('cost', v)}
                />
                <Forms.Select
                  label='Color'
                  selected={values.colorID.toString()}
                  error={getError('color')}
                  onChange={v => {
                    let value = ''
                    if (Array.isArray(v)) {
                      value = v[0].value
                    } else {
                      value = (v as any).value
                    }
                    console.log('new color id', value)
                    setValue('colorID', value)
                  }}
                  options={buildColorOptions(colors)}
                />
              </Forms.Row>
              <Forms.Row>
                <Forms.TextInput
                  label='Power'
                  error={getError('power')}
                  value={values.power.toString()}
                  onChange={v => setValue('power', v)}
                />
                <Forms.TextInput
                  label='Toughness'
                  error={getError('toughness')}
                  value={values.toughness.toString()}
                  onChange={v => setValue('toughness', v)}
                />
              </Forms.Row>
              <Forms.Row>
                <Forms.MultiSelect
                  label='Keywords'
                  selected={values.keywords.map(k => k.id.toString())}
                  error={getError('keywords')}
                  onChange={v => {
                    if (Array.isArray(v)) {
                      const ids = v.map(v => {
                        const existing = values.keywords.find(
                          kw => kw.id.toString() === v.value.toString()
                        )
                        if (existing) {
                          return existing
                        }
                        return { id: v.value, count: 1 }
                      })
                      setValue('keywords', ids)
                    } else {
                      setValue('keywords', [])
                    }
                  }}
                  isMulti
                  options={buildKeywordOptions(keywords)}
                />
              </Forms.Row>
              {values.keywords.length > 0 && (
                <Forms.Row className='keyword-list'>
                  {values.keywords.map((kw, index) => {
                    const keyword = keywords.find(
                      k =>
                        k.id ===
                        (typeof kw.id === 'number'
                          ? kw.id
                          : parseInt(kw.id, 10))
                    )
                    if (!keyword) {
                      return null
                    }
                    return (
                      <KeywordRow
                        key={kw.id}
                        data={kw}
                        keyword={keyword}
                        setCount={v => {
                          setValue(`keywords[${index}].count`, v)
                        }}
                      />
                    )
                  })}
                </Forms.Row>
              )}
              <Forms.Row>
                <Forms.TextArea
                  label='Body'
                  value={values.body}
                  error={getError('body')}
                  onChange={v => setValue('body', v)}
                />
              </Forms.Row>
            </div>
          </Forms.Row>
        </form>
      </Dialog.Body>
      <Dialog.Footer>
        <div className='group'>
          <Button
            label='Pick Art'
            onClick={() => {
              ws.send({ type: 'pick-image' })
            }}
          />
        </div>
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

export default CardDialog
