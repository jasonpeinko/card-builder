import { useReducer } from 'react'
import * as yup from 'yup'
import { set } from 'lodash'

type FieldValue = string | number | string[] | number[] | any[]
type Action =
  | { type: 'set-value'; name: string; value: FieldValue }
  | { type: 'set-values'; values: any }
  | { type: 'set-errors'; errors: any }

type State<T> = {
  values: T
  errors: Partial<T> & { [s: string]: any }
  dirty: boolean
}

const reducer = <T extends {}>() => (
  state: State<T>,
  action: Action
): State<T> => {
  switch (action.type) {
    case 'set-value':
      console.log(action, state.values)
      return {
        ...state,
        values: set(state.values, action.name, action.value)
      }
    case 'set-errors': {
      return {
        ...state,
        errors: action.errors
      }
    }
    case 'set-values':
      return {
        ...state,
        values: {
          ...state.values,
          ...action.values
        }
      }
  }
  return state
}

const defaultState = {
  values: {},
  errors: {},
  dirty: false
}
const useForm = <T extends {}>(
  initialValues: T,
  schema: yup.ObjectSchema<any>
) => {
  const [state, dispatcher] = useReducer(reducer<T>(), {
    ...defaultState,
    values: { ...initialValues }
  })
  const setValue = (name: string, value: FieldValue) => {
    dispatcher({ type: 'set-value', name, value })
  }
  const getError = (name: string) => {
    return state.errors.hasOwnProperty(name) ? state.errors[name] : undefined
  }
  const setValues = (values: T) => {
    dispatcher({ type: 'set-values', values })
  }
  const resetErrors = () => {
    dispatcher({ type: 'set-errors', errors: {} })
  }
  const validate = () => {
    try {
      const values = schema.validateSync(state.values, {
        abortEarly: false
      })
      return values
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        const errors = e.inner.reduce((acc, err) => {
          return {
            ...acc,
            [err.path]: err.message
          }
        }, {})
        dispatcher({ type: 'set-errors', errors: errors })
      }
    }
    return null
  }
  const handleSubmit = (callback: (v: T) => void) => {
    console.log(state.values)
    const values = validate()
    if (values) {
      callback(values)
    }
    console.log(state.errors)
  }
  return {
    ...state,
    setValue,
    resetErrors,
    getError,
    setValues,
    handleSubmit,
    dispatcher
  }
}

export default useForm
