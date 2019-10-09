import React, { useContext } from 'react'
import { DataContext, useDataContext } from '../data/constants'
import chroma from 'chroma-js'

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
  const { state: { colors }, getColor, getKeyword } = useDataContext()
  const cardColor = getColor(card.colorID)
  const color = chroma(cardColor ? cardColor.hex : '#000')
  const keywords = card.keywords.reduce<CardKeyword[]>((acc, k) => {
    const kw = getKeyword(k)
    if (kw) {
      return [...acc, kw]
    }
    return acc
  }, [])
  console.log(keywords)
  return (<div className="card"
    style={{ background: color.hex(), borderColor: color.hex() }}
    onClick={() => modal.open(card)}>
    <div className="card-row card-header">
      <div className="title">
        <span className="name">{card.name}</span>
        <span className="subtitle">{card.subtitle}</span>
      </div>
      <span className="cost">{card.cost}</span>
    </div>
    <div className="card-body">
      <ul className="keywords">
        {keywords.map(k => <li>{k.label}</li>)}
      </ul>
      {card.body}
      {/* <span className="flavor">{card.flavor}</span> */}
    </div>
    <div className="card-row card-footer">
      {card.power + card.toughness > 0 && <div className="stats">
        <div className="power">
          {card.power}
        </div>
        <div className="divider"></div>
        <div className="toughness">
          {card.toughness}
        </div>
      </div>}
    </div>
  </div >)
}

export default Card
