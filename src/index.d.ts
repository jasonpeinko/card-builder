type Tag = 'creature' | 'monster' | 'curse' | 'treasure' | 'equipment'
type CardID = number
type EntityID = number
type Affix = 'text' | 'ability' | 'passive' | 'preview' | 'curse' | 'equipment'

type CardRarity = {
  label: string
  value: string
  colorID: EntityID
  id: EntityID
}

type CardAffix = {
  type: Affix
  text: string
}

type Card = {
  cost: number
  name: string
  subtitle: string
  body: string
  keywords: EntityID[]
  colorID: EntityID
  power: number
  toughness: number
  id: EntityID
}

type Collection = {
  cards: CardID[]
  name: string
}

type Color = {
  hex: string
  name: string
  id?: EntityID
}

type Block = {
  label: string
  id: number
}

type CardKeyword = {
  label: string
  value: string
  description: string
  id?: EntityID
}

type Tag = {
  label: string
  value: string
}

type OnChangeText = (s: string) => void
type OnClick = () => void

type DataModalProps<T> = {
  open: (data: T) => void
  close: () => void
  isOpen: boolean
  data: T
  reset: () => T
}
