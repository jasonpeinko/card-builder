import chroma from 'chroma-js'
import React from 'react'
import { useProjectContext } from '../data/project'
import { useImageCache } from '../hooks/use-image-cache'

type CardProps = {
  card: Card
  imageBase64?: string
  modal?: DataModalProps<Card>
}
const Card: React.FC<CardProps> = ({ modal, imageBase64, card }) => {
  const { getColor, getKeyword, state } = useProjectContext()
  const { getImage } = useImageCache()
  const cardColor = getColor(parseInt(card.colorID.toString(), 10))
  const color = chroma(cardColor ? cardColor.hex : '#000')
  const keywords = card.keywords.reduce<CardKeyword[]>((acc, k) => {
    const kw = getKeyword(k.id)
    if (kw) {
      return [...acc, kw]
    }
    return acc
  }, [])
  const imageData = imageBase64 ? imageBase64 : getImage(card.image)
  return (
    <div
      className='card'
      style={{
        backgroundImage: `url(data:image/png;base64,${imageData})`,
        borderColor: color.hex()
      }}
      onClick={() => modal && modal.open(card)}
    >
      <span className='cost'>{card.cost}</span>
      <div
        className='card-row card-header'
        style={{
          backgroundColor: color.hex()
        }}
      >
        <div className='title'>
          <span className='name'>{card.name}</span>
          {/* <span className='subtitle'>{card.subtitle}</span> */}
        </div>
      </div>
      <div
        className='card-body'
        style={{
          backgroundColor: color.hex()
        }}
      >
        <ul className='keywords'>
          {card.keywords.map(k => {
            const kw = getKeyword(
              typeof k.id === 'string' ? parseInt(k.id, 10) : k.id
            )
            if (!kw) return null
            return (
              <li key={k.id}>
                {kw.label}{' '}
                {k.count > 1 && <span className='count'>{k.count}</span>}
              </li>
            )
          })}
        </ul>
        {card.body}
        {/* <span className="flavor">{card.flavor}</span> */}
        <div className='card-row card-footer'>
          {card.power + card.toughness > 0 && (
            <div className='stats'>
              <div className='power'>{card.power}</div>
              <div className='divider'></div>
              <div className='toughness'>{card.toughness}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
