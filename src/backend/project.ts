import AdmZip from 'adm-zip'
import yaml from 'yaml'

const DATA_FILE = 'data.yaml'

type Project = {
  zip: AdmZip
  path: string
}
export const wrapProject = (zip: AdmZip, path: string) => {
  const project = {
    path,
    zip
  }
  return {
    path,
    listContents: listContents(project),
    writeDataFile: writeDataFile(project),
    readDataFile: readDataFile(project),
    readImage: readImage(project),
    writeImage: writeImage(project)
  }
}

export type ProjectFile = ReturnType<typeof wrapProject>

export const createProject = (path: string) => {
  const zip = new AdmZip()
  zip.writeZip(path)
  return wrapProject(new AdmZip(path), path)
}
export const loadProject = (path: string) => {
  console.log('loading project', path)
  const zip = new AdmZip(path)
  return wrapProject(zip, path)
}

const readDataFile = (project: Project) => () => {
  const d = project.zip.readAsText(DATA_FILE)
  if (!d) return null
  return yaml.parse(d)
}
const writeDataFile = (project: Project) => (data: any) => {
  console.log('writing data file')
  const d = yaml.stringify(data)
  writeFile(project)(DATA_FILE, d)
}
const writeFile = (project: Project) => (name: string, d: string | Buffer) => {
  const list = listContents(project)().map(c => c.entryName)
  console.log('list', list)
  const buff = Buffer.alloc(d.length, d)
  if (list.includes(name)) {
    project.zip.updateFile(name, buff)
  } else {
    project.zip.addFile(name, buff)
  }
  project.zip.writeZip(project.path)
}
const readImage = (project: Project) => (path: string) => {
  console.log('reading:', path)
  listContents(project)()
  const d = project.zip.readFile(path)
  if (!d) {
    console.log('failed to read image: ', path)
    return null
  }
  return d
}
const writeImage = (project: Project) => (
  path: string,
  data: string | Buffer
) => {
  console.log('writing image:', path)
  writeFile(project)(path, data)
}
const listContents = (project: Project) => () => {
  console.log('project contents:')
  const enteries = project.zip.getEntries()
  if (enteries.length < 1) {
    console.log('- [no contents')
  }
  enteries.map(e => console.log('- ' + e.name))
  return enteries
}
