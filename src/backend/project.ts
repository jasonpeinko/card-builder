import JSZip from 'jszip'
import yaml from 'yaml'
import * as fs from 'fs'

const DATA_FILE = 'data.yaml'

type Project = {
  zip: JSZip
  path: string
}
export const wrapProject = (zip: JSZip, path: string) => {
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
  const zip = new JSZip()
  return wrapProject(zip, path)
}
export const loadProject = async (path: string) => {
  console.log('loading project', path)
  const data = fs.readFileSync(path)
  const zip = await JSZip.loadAsync(data)
  return wrapProject(zip, path)
}

const readDataFile = (project: Project) => async () => {
  const d = await project.zip.file(DATA_FILE).async('text')
  console.log('load project file', d)
  if (!d) return null
  return yaml.parse(d)
}
const writeDataFile = (project: Project) => (data: any) => {
  console.log('writing data file')
  const d = yaml.stringify(data)
  writeFile(project)(DATA_FILE, d)
}
const writeFile = (project: Project) => (name: string, d: string | Buffer) => {
  listContents(project)
  project.zip.file(name, d)
  project.zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(project.path))
    .on('finish', function() {
      console.log('project file saved', project.path)
    })
}
const readImage = (project: Project) => async (path: string) => {
  console.log('reading:', path)
  listContents(project)()
  try {
    const d = await project.zip.file(path).async('base64')
    return d
  } catch (e) {
    console.log('image not in project file', path)
    return null
  }
}
const writeImage = (project: Project) => (
  path: string,
  data: string | Buffer
) => {
  console.log('writing image:', path)
  writeFile(project)(path, data)
}
const listContents = (project: Project) => () => {
  console.log('project contents:', Object.keys(project.zip.files))
}
