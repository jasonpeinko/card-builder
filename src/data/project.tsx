import React, { useReducer, useEffect, useContext } from 'react'
import { migrate } from './migrations'
import { upsert, remove, nextID } from './util'
import collectionsReducer, {
  CollectionsState,
  CollectionAction
} from './collections'

export interface State {
  meta: {
    version: number
    projectFile: string
  }
  collections: CollectionsState
  cards: Card[]
  colors: Color[]
  keywords: CardKeyword[]
  loading: boolean
}
const defaultState: State = {
  meta: {
    projectFile: '',
    version: 1
  },
  collections: [],
  cards: [],
  colors: [],
  keywords: [],
  loading: true
}
type Action =
  | { type: 'loaded'; state: State | null; project: string }
  | { type: 'reset'; project?: string }
  | { type: 'card.upsert'; card: Card }
  | { type: 'card.remove'; card: Card }
  | { type: 'color.upsert'; color: Color }
  | { type: 'color.remove'; color: Color }
  | { type: 'keyword.upsert'; keyword: CardKeyword }
  | { type: 'keyword.remove'; keyword: CardKeyword }
  | CollectionAction
type Context = {
  state: State
  dispatch: (a: Action) => void
  getKeyword: (id: EntityID) => CardKeyword | undefined
  getColor: (id: EntityID) => Color | undefined
  getCollection: (id: EntityID) => Collection | undefined
  getCard: (id: EntityID) => Card | undefined
}
export type ContstantsDispatch = (a: Action) => void
export const ProjectContext = React.createContext<Context | undefined>(
  undefined
)
export const useProjectContext = () => {
  const c = useContext(ProjectContext)
  if (!c) {
    throw new Error('data context not in provider')
  }
  return c
}

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    (state: State, action: Action): State => {
      switch (action.type) {
        case 'reset':
          return {
            ...defaultState,
            loading: false,
            meta: {
              ...defaultState.meta,
              projectFile: action.project ? action.project : ''
            }
          }
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
          console.log(action.state)
          if (!action.state || Array.isArray(action.state)) {
            return { ...defaultState }
          }
          return migrate({
            ...state,
            ...action.state,
            loading: false,
            meta: {
              ...state.meta,
              projectFile: action.project || action.state.meta.projectFile
            }
          })
      }
      return {
        ...state,
        collections: collectionsReducer(state.collections, action)
      }
    },
    { ...defaultState }
  )

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
      dispatch({ type: 'loaded', project: '', state: JSON.parse(str || '[]') })
    }
    load()
  }, [])

  const getColor = (id: EntityID) => {
    console.log('find color', id)
    return state.colors.find(c => c.id === id)
  }

  const getKeyword = (id: EntityID) => {
    return state.keywords.find(c => c.id === id)
  }

  const getCollection = (id: EntityID) => {
    return state.collections.find(c => c.id === id)
  }

  const getCard = (id: EntityID) => {
    return state.cards.find(c => c.id === id)
  }

  const context = {
    state,
    dispatch,
    getKeyword,
    getColor,
    getCollection,
    getCard
  }

  return (
    <ProjectContext.Provider value={context}>
      {children}
    </ProjectContext.Provider>
  )
}
export default Provider
