import React from 'react'
import { useProjectContext } from './data/project'
import { Forms, FAB } from './ui'
import { isArray } from 'util'
import { colors } from 'react-select/src/theme'
import { CollectionAction } from './data/collections'
import { useDataModal } from './ui/dialog'
import CollectionModal from './ui/collection-modal'

type CollectionProps = {
  id: number
}
type CardRowProps = {
  card: Card
  color: Color | undefined
  count: number
  onDec: (c: Card) => void
  onInc: (c: Card) => void
}
const CardRow: React.FC<CardRowProps> = ({
  onDec,
  onInc,
  card,
  color,
  count
}) => {
  return (
    <div
      className='card-row'
      style={{ background: color ? color.hex : '#000' }}
      key={card.id}
    >
      <div>
        <FAB.Button icon='minus' small onClick={() => onDec(card)} />
        <FAB.Button icon='plus' small onClick={() => onInc(card)} />
      </div>
      <span className='name'>{card.name}</span>
      <span className='count'>{count}</span>
    </div>
  )
}
export const Collection: React.FC<CollectionProps> = ({ id, children }) => {
  const {
    getCollection,
    state: { cards },
    getColor,
    dispatch,
    getCard
  } = useProjectContext()
  const collection = getCollection(id)
  const modal = useDataModal<Collection>(() => ({
    id: -1,
    name: '',
    color: '#000',
    cards: []
  }))
  if (!collection) {
    return <h1>Not Found</h1>
  }
  return (
    <div className='collection'>
      <CollectionModal
        modal={modal}
        onClose={() => null}
        onSave={values => {
          console.log(values)
          dispatch({ type: 'collection.upsert', collection: values })
          modal.close()
        }}
      />
      <div className='header'>
        <h1 style={{ color: collection.color }}>{collection.name}</h1>
        <FAB.Button icon='cog' small onClick={() => modal.open(collection)} />
      </div>
      <div className='row'>
        <div className='collection-cards'>
          <h2>Cards</h2>
          <div className='card-list'>
            {Object.keys(collection.cards).map(id => {
              console.log(typeof id)
              const card = getCard(parseInt(id, 10))
              if (!card) return null
              return (
                <CardRow
                  key={id}
                  card={card}
                  onInc={c =>
                    dispatch({
                      type: 'collection.inc',
                      collection: collection.id,
                      card: card.id
                    })
                  }
                  onDec={c =>
                    dispatch({
                      type: 'collection.dec',
                      collection: collection.id,
                      card: card.id
                    })
                  }
                  color={getColor(card.colorID)}
                  count={collection.cards[parseInt(id, 10)]}
                />
              )
            })}
          </div>
        </div>
        <div className='sidebar'>
          <h2>Add Cards</h2>
          <Forms.MultiSelect
            label=''
            selected={[]}
            onChange={v => {
              console.log('adding cards', v)
              if (isArray(v)) {
                dispatch({
                  type: 'collection.add-card',
                  id,
                  card: parseInt(v[0].value, 10)
                })
              }
            }}
            options={cards.map(c => ({
              value: c.id.toString(),
              label: c.name
            }))}
          />
          <h2>Analytics</h2>
        </div>
      </div>
    </div>
  )
}
export default Collection
