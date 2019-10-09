import { useReducer } from "react"

type FieldValue = string | number
type Action =
  | { type: 'set-value', name: string, value: FieldValue }
  | { type: 'set-values', values: any }

type State<T> = {
  values: T
  errors: {}
  dirty: boolean
}

const reducer = <T extends {}>() => (state: State<T>, action: Action): State<T> => {
  switch (action.type) {
    case 'set-value':
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value
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
const useForm = <T extends {}>(initialValues: T) => {
  const [state, dispatcher] = useReducer(reducer<T>(), { ...defaultState, values: { ...initialValues } })
  const setValue = (name: string, value: FieldValue) => {
    dispatcher({ type: 'set-value', name, value })
  }
  const setValues = (values: T) => {
    dispatcher({ type: 'set-values', values })
  }
  const handleSubmit = (callback: (v: T) => void) => {
    callback(state.values)
  }
  return {
    ...state,
    setValue,
    setValues,
    handleSubmit,
    dispatcher
  }
}

export default useForm
