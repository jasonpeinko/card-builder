import React, { useContext } from 'react'
import { ConstantsContext } from '../data/constants'

type AffixProps = {
  affix: CardAffix
}
const Affix: React.FC<AffixProps> = ({ affix }) => {
  return (<li className="affix"><span>{affix.text}</span></li>)
}

type CardProps = {
  card: Card
  modal: DataModalProps<Card>
}
const Card: React.FC<CardProps> = ({ modal, card }) => {
  const { state: { colors } } = useContext(ConstantsContext)
  const color = colors.find(c => c.id === card.colorID)
  console.log('card', card)
  return (<div className="card" onClick={() => modal.open(card)}>
    <svg className="card-bg">
      <g
        id="layer1"
        transform="translate(0,-47)">
        <rect
          id="background"
          width="300"
          height="420"
          x="0"
          y="47"
          style={{ fill: color ? color.hex : '#000' }}
          rx="10"
          ry="10" />
        <rect
          id="rect10-3"
          width="280"
          height="180"
          x="10"
          y="277"
          style={{ fill: '#ffffff22' }}
          rx="6"
          ry="6" />
        <rect
          id="rect10-3-6"
          width="245"
          height="50"
          x="10"
          y="57"
          style={{ fill: '#ffffff22' }}
          rx="6"
          ry="6" />
        <circle
          style={{ fill: '#9f810f' }}
          id="path42"
          cx="277.5"
          cy="69.5"
          r="12.5" />
      </g>
    </svg >

    <div className="title">
      <span className="name">{card.name}</span>
      <span className="subtitle">{card.subtitle}</span>
    </div>
    <span className="cost">{card.cost}</span>
    <div className="body">
      <ul>
        {card.keywords.map(k => <li>{k}</li>)}
      </ul>
      {/* <span className="flavor">{card.flavor}</span> */}
    </div>
  </div >)
}

export default Card
