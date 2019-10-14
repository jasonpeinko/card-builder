import { State } from './project'
const currentVersion = 2

const migrations = [
  (data: State, from: number, to: number) => {
    if (data.meta.version !== from && data.meta.version < to) {
      console.log('skipping migration, newer version')
      return data
    }
    data.cards = data.cards.map(c => ({
      ...c,
      // Migrate keyword format to include count
      keywords: c.keywords.map((k: any) =>
        typeof k === 'number' ? { id: k, count: 1 } : k
      )
    }))
    data.meta.version = to
    return data
  }
]
export const migrate = (data: State) => {
  console.log('migrating')
  return migrations.reduce((acc, migration) => {
    return migration(acc, data.meta.version, currentVersion)
  }, data)
}
