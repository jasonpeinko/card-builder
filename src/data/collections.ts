import { remove, upsert } from './util'

export type CollectionsState = Collection[]
export type CollectionAction =
  | {
      type: 'collection.add-card'
      id: EntityID
      card: EntityID
    }
  | { type: 'collection.dec'; collection: EntityID; card: EntityID }
  | { type: 'collection.inc'; collection: EntityID; card: EntityID }
  | { type: 'collection.upsert'; collection: Collection }
  | { type: 'collection.remove'; collection: Collection }
export const collectionsReducer = (
  state: CollectionsState,
  action: CollectionAction
): CollectionsState => {
  console.log(action)
  switch (action.type) {
    case 'collection.upsert':
      return upsert(state, action.collection)
    case 'collection.remove':
      return remove(state, action.collection)
    case 'collection.inc':
      return state.map(c => {
        if (c.id === action.collection) {
          return {
            ...c,
            cards: {
              ...c.cards,
              [action.card]: c.cards[action.card] + 1
            }
          }
        }
        return c
      })
    case 'collection.dec':
      return state.map(c => {
        if (c.id === action.collection) {
          const count = c.cards[action.card]
          if (count <= 1) {
            const { [action.card]: _, ...newCards } = c.cards
            return { ...c, cards: newCards }
          }
          return {
            ...c,
            cards: {
              ...c.cards,
              [action.card]: c.cards[action.card] - 1
            }
          }
        }
        return c
      })
    case 'collection.add-card':
      return state.map(c => {
        if (c.id === action.id) {
          console.log('adding card')
          return {
            ...c,
            cards: {
              ...c.cards,
              [action.card]: 1
            }
          }
        }
        return c
      })
  }
  return state
}

export default collectionsReducer
