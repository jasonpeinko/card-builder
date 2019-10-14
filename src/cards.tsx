import React from 'react'
import { useProjectContext } from './data/project'
import { Card, FAB } from './ui'
import CardDialog from './ui/card-dialog'
import { useDataModal } from './ui/dialog'

const Cards: React.FC = () => {
  const {
    state: { cards, colors, keywords },
    dispatch
  } = useProjectContext()
  const modal = useDataModal<Card>(() => ({
    cost: 4,
    name: '',
    subtitle: '',
    body: '',
    keywords: [],
    image: '',
    colorID: 0,
    power: 0,
    toughness: 0,
    id: -1
  }))
  return (
    <div className='page cards'>
      <CardDialog
        modal={modal}
        keywords={keywords}
        colors={colors}
        onClose={() => {
          modal.close()
        }}
        onSave={c => {
          dispatch({ type: 'card.upsert', card: c })
          modal.close()
        }}
      />
      <h1>Cards</h1>
      <div className='card-list'>
        {cards.map((c: Card) => (
          <div className='card-wrap'>
            <Card modal={modal} card={c} key={c.id} />
          </div>
        ))}
      </div>
      <FAB.Group>
        <FAB.Button
          icon='plus'
          onClick={() => {
            modal.open(null)
          }}
        />
      </FAB.Group>
    </div>
  )
}

export default Cards
