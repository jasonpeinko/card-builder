import React, { useReducer, useEffect, useContext, useState } from 'react'

export interface AppState {
  currentProject: string
  lastProject: string
  recentProjects: string[]
}
const defaultState: AppState = {
  currentProject: '',
  lastProject: '',
  recentProjects: []
}
type Action =
  | { type: 'loaded'; state: AppState }
  | { type: 'reset' }
  | { type: 'set-project'; project: string }
  | { type: 'add-recent'; project: string }
type Context = {
  state: AppState
  dispatch: (a: Action) => void
}
export type AppDispatch = (a: Action) => void
export const AppContext = React.createContext<Context | undefined>(undefined)
export const useAppContext = () => {
  const c = useContext(AppContext)
  if (!c) {
    throw new Error('data context not in provider')
  }
  return c
}

const Provider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer(
    (state: AppState, action: Action): AppState => {
      switch (action.type) {
        case 'reset':
          setLoading(false)
          return { ...defaultState }
        case 'set-project':
          return { ...state, currentProject: action.project }
        case 'loaded':
          console.log(action.state, 'state')
          if (!action.state || !Array.isArray(action.state)) {
            console.log('init state')
            return { ...defaultState }
          }
          return {
            ...state,
            ...action.state
          }
      }
      return state
    },
    { ...defaultState }
  )

  useEffect(() => {
    const persist = async () => {
      await window.localStorage.setItem('app-state', JSON.stringify(state))
    }
    if (!loading) {
      persist()
    }
  }, [state])

  useEffect(() => {
    const load = async () => {
      /* await window.localStorage.removeItem('cards') */
      const str = await window.localStorage.getItem('app-state')
      dispatch({ type: 'loaded', state: JSON.parse(str || '[]') })
    }
    load()
  }, [])

  const context = {
    state,
    dispatch
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
export default Provider
