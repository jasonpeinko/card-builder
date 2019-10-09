import React from 'react'
import { usePath, navigate } from 'hookrouter'

type ItemProps = {
  label: string
  link?: string                                           
  active?: boolean
}
const Item: React.FC<ItemProps> = ({ link = '/', label = 'Label', active = false }) => {
  return (
    <li className={`${active ? 'active' : ''}`} onClick={() => navigate(link)}>
      {label}
    </li>
  )
}

const Drawer: React.FC = () => {
  const path = usePath()
  console.log(path)                                       
  return (
    <div className="drawer">
      <ul>
        <Item label="Rules" active={false} />
        <Item label="Constants" link="/constants" active={path == '/constants'} />
        <Item label="Cards" link="/cards" active={path == '/' || path == '/cards'} />
        <Item label="Collections" />
        <ul>
          <Item label="Shared Pool" />
          <Item label="Enchantress" />
          <Item label="Beastmaster" />
          <Item label="Monsters" />
          <Item label="Treasure" />
        </ul>
        <Item label="Decks" />
        <ul>
          <Item label="Enchantress Starter" />
          <Item label="Beastmaster Starter" />
          <Item label="Monster Actions" />
          <Item label="Treasure" />
        </ul>
        <Item label="Quick Draw" />
        <Item label="Test Play" />
      </ul>
    </div>
  )
}

export default Drawer
