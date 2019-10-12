import React from 'react'
import { SketchPicker } from 'react-color'
import ReactSelect from 'react-select'

type Props = {
  label: string
  value?: string
  error?: string
  onChange?: OnChangeText
  onBlur?: () => void
}

const FormError: React.FC<{ error: string | undefined }> = ({ error }) => {
  return <span className='form-error'>{error ? error : ''}</span>
}
export const TextInput: React.FC<Props> = ({
  error,
  onChange = s => null,
  onBlur = () => null,
  children,
  value = '',
  label
}) => {
  return (
    <div className='form-input'>
      <label>{label}</label>
      {error !== undefined && <FormError error={error} />}
      <input
        type='text'
        value={value}
        onBlur={e => {
          onBlur()
        }}
        onChange={e => {
          onChange(e.currentTarget.value)
        }}
      />
    </div>
  )
}

type TextAreaProps = {
  label: string
  value?: string
  onChange?: OnChangeText
}
export const TextArea: React.FC<Props> = ({
  value = '',
  onChange,
  children,
  label
}) => {
  return (
    <div className='form-input'>
      <label>{label}</label>
      <textarea
        value={value}
        onChange={e => onChange && onChange(e.currentTarget.value)}
      ></textarea>
    </div>
  )
}

type RowProps = {
  className?: string
}
export const Row: React.FC<RowProps> = ({ className = '', children }) => {
  return <div className={`form-row ${className}`}>{children}</div>
}

type ColorPickerProps = {
  label: string
  color: string
  onChange: (c: string) => void
}
export const ColorPicker: React.FC<ColorPickerProps> = ({
  onChange,
  color,
  label,
  children
}) => {
  return (
    <div className='form-input'>
      <label>{label}</label>
      <SketchPicker
        onChangeComplete={color => onChange(color.hex)}
        color={color}
      />
    </div>
  )
}

const dot = (color = '#ccc') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 3,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 14,
    width: 14
  }
})
const selectStyles = {
  option: (styles: any, { data }: any) => {
    return {
      ...styles,
      backgroundColor: '#000',
      color: data.color,
      ...dot(data.color),
      ':hover': {
        backgroundColor: '#333'
      }
    }
  },
  control: (styles: any) => ({
    ...styles,
    background: '#000',
    border: 'none',
    borderRadius: 5
  }),
  menu: (styles: any) => ({
    ...styles,
    background: '#000'
  }),
  singleValue: (styles: any, { data }: any) => {
    return {
      ...styles,
      color: data.color,
      ...dot(data.color)
    }
  },
  multiValue: (styles: any, { data }: any) => {
    return {
      ...styles,
      background: '#2c2f33'
    }
  },
  multiValueLabel: (styles: any, { data }: any) => {
    return {
      ...styles,
      color: '#fff'
    }
  }
}

type SelectOption = {
  label: string
  value: string
  color?: string
}
type SelectProps = Partial<
  JSX.LibraryManagedAttributes<typeof ReactSelect, ReactSelect['props']>
> & {
  options: SelectOption[]
  selected: string
  label: string
}

export const Select: React.FC<SelectProps> = ({
  label,
  selected,
  options,
  ...props
}) => {
  const value = options.find(o => o.value === selected)
  return (
    <div className='form-input select'>
      <label>{label}</label>
      <ReactSelect
        value={value}
        styles={selectStyles}
        options={options}
        {...props}
      />
    </div>
  )
}

type MultiSelectProps = Partial<
  JSX.LibraryManagedAttributes<typeof ReactSelect, ReactSelect['props']>
> & {
  options: SelectOption[]
  selected: string[]
  label: string
}
export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  selected,
  options,
  ...props
}) => {
  const value = options.filter(o => selected.find(s => s === o.value))
  return (
    <div className='form-input select'>
      <label>{label}</label>
      <ReactSelect
        value={value}
        styles={selectStyles}
        options={options}
        {...props}
      />
    </div>
  )
}

export default {
  TextInput,
  TextArea,
  ColorPicker,
  Select,
  MultiSelect,
  Row
}
