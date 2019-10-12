type CardID = number
type EntityID = number

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

type Filename = string
type Card = {
  cost: number
  name: string
  subtitle: string
  body: string
  keywords: { id: EntityID; count: number }[]
  colorID: EntityID
  image: Filename
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

type SocketServerAction =
  | { type: 'save'; data: any }
  | { type: 'load' }
  | { type: 'pick-image' }
  | { type: 'store-image'; image: string; data: string; project: string }
  | { type: 'load-image'; image: string; project: string }
type SocketClientAction =
  | { type: 'saved' }
  | { type: 'loaded'; project: string; data: any }
  | { type: 'image'; image: string; data: string }
  | { type: 'paste-image'; data: string }
