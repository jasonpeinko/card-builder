import React, { useReducer, useEffect } from 'react'

interface State {
  cards: Card[]
  colors: Color[]
  keywords: CardKeyword[]
  loading: boolean
}
const defaultState: State = {
  cards: [],
  colors: [],
  keywords: [],
  loading: true
}
type Action =
  | { type: 'loaded', state: State }
  | { type: 'card.upsert', card: Card }
  | { type: 'card.remove', card: Card }
  | { type: 'color.upsert', color: Color }
  | { type: 'color.remove', color: Color }
  | { type: 'keyword.upsert', keyword: CardKeyword }
  | { type: 'keyword.remove', keyword: CardKeyword }
type Context = {
  state: State
  dispatch: (a: Action) => void
}
export type ContstantsDispatch = (a: Action) => void
export const ConstantsContext = React.createContext<Context>({ state: { ...defaultState }, dispatch: (a: Action) => null })

const upsert = <T extends { id?: EntityID }>(arr: T[], item: T) => {
  const newItem = { ...item }
  if (!newItem.id || newItem.id < 0) {
    newItem.id = nextID(arr)
    console.log(newItem.id)
    return [...arr, newItem]
  }
  return arr.map(i => {
    if (i.id === item.id) {
      return item
    }
    return i
  })
}

const remove = <T extends { id?: EntityID }>(arr: T[], item: T) =>
  arr.filter(i => i.id !== item.id)

const nextID = <T extends { id?: EntityID }>(arr: T[]) =>
  arr.reduce((acc, i) => {
    return Math.max(i.id || 0, acc)
  }, 0) + 1

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer((state: State, action: Action): State => {
    switch (action.type) {
      case 'keyword.upsert':
        return {
          ...state,
          keywords: upsert(state.keywords, action.keyword)
        }
      case 'keyword.remove':
        return {
          ...state,
          keywords: remove(state.keywords, action.keyword)
        }
      case 'card.upsert':
        return {
          ...state,
          cards: upsert(state.cards, action.card)
        }
      case 'card.remove':
        return {
          ...state,
          cards: remove(state.cards, action.card)
        }
      case 'color.upsert':
        return {
          ...state,
          colors: upsert(state.colors, action.color)
        }
      case 'color.remove':
        return {
          ...state,
          colors: remove(state.colors, action.color)
        }
      case 'loaded':
        return {
          ...state,
          ...action.state,
          loading: false,
        }
    }
  }, { ...defaultState })

  useEffect(() => {
    const persist = async () => {
      await window.localStorage.setItem('constants', JSON.stringify(state))
    }
    if (!state.loading) {
      persist()
    }
  }, [state])

  useEffect(() => {
    const load = async () => {
      /* await window.localStorage.removeItem('cards') */
      const str = await window.localStorage.getItem('constants')
      dispatch({ type: 'loaded', state: JSON.parse(str || '[]') })
    }
    load()
  }, [])

  const context = {
    state,
    dispatch
  }
  console.log('context', context)
  // console.log(context)

  return (
    <ConstantsContext.Provider value={context}>
      {children}
    </ConstantsContext.Provider>
  )
}
export default Provider
