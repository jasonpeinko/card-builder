import electron from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'
import WebSocket from 'ws'
import { loadProject, createProject, ProjectFile } from './backend/project'
import { writeFileSync, existsSync } from 'fs'

const { ipcMain, nativeImage, clipboard, globalShortcut, dialog } = electron
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow: any

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false
  })
  // mainWindow.loadFile(
  //   path.join(__dirname, '/../public/index.html'),
  // )
  const url = isDev
    ? 'http://localhost:3333'
    : `file://${path.join(__dirname, '../build/index.html')}`
  mainWindow.loadURL(url)
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.on('ready', () => {
  createWindow()
  globalShortcut.register('CommandOrControl+V', () => {
    const image = clipboard.readImage()
    const png = image.toPNG()
    clients.map(c =>
      c.send(
        JSON.stringify({ type: 'paste-image', data: png.toString('base64') })
      )
    )
  })
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const wss = new WebSocket.Server({ port: 61111 })

const isProjectFile = (p: string) => path.extname(p) === '.cb'

const makeActionString = (action: SocketClientAction) => JSON.stringify(action)
let clients: WebSocket[] = []
let project: ProjectFile | null = null
wss.on('connection', ws => {
  clients = [...clients, ws]
  ws.on('message', async (message: string) => {
    const action = JSON.parse(message) as SocketServerAction
    console.log(action.type)
    switch (action.type) {
      case 'pick-image': {
        const { filePaths, canceled } = await dialog.showOpenDialog(
          mainWindow,
          {
            title: 'Load Image',
            filters: [
              { name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'gif'] }
            ],
            properties: ['openFile', 'createDirectory']
          }
        )
        if (canceled || !filePaths || filePaths.length < 1) {
          console.log('canceled or no file selected')
          break
        }
        const image = nativeImage.createFromPath(filePaths[0])
        const png = image.toPNG()
        clients.map(c =>
          c.send(
            JSON.stringify({
              type: 'paste-image',
              data: png.toString('base64')
            })
          )
        )
        break
      }
      case 'load-image': {
        if (!project || project.path != action.project) {
          project = await loadProject(action.project)
        }
        const data = await project.readImage(action.image)
        if (data) {
          ws.send(
            makeActionString({
              type: 'image',
              data: data,
              image: action.image
            })
          )
        }
        break
      }
      case 'store-image': {
        console.log('store')
        if (!project || project.path != action.project) {
          project = await loadProject(action.project)
        }
        project.writeImage(action.image, Buffer.from(action.data, 'base64'))
        break
      }
      case 'load': {
        const { filePaths, canceled } = await dialog.showOpenDialog(
          mainWindow,
          {
            title: 'Load Project',
            filters: [{ name: 'Card Builder Project', extensions: ['cb'] }],
            properties: ['openFile', 'createDirectory']
          }
        )
        if (canceled || !filePaths || filePaths.length < 1) {
          console.log('canceled or no file selected')
          break
        }
        const file = filePaths[0]
        project = await loadProject(file)
        project.listContents()
        const data = await project.readDataFile()
        ws.send(
          makeActionString({ type: 'loaded', data, project: project.path })
        )
        break
      }
      case 'save': {
        const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
          title: 'Save Project As',
          filters: [{ name: 'Card Builder Project', extensions: ['cb'] }]
        })
        const file = filePath ? filePath : ''
        if (canceled || !file) {
          console.log('failed to get file or canceled')
          break
        }
        const path = isProjectFile(file) ? file : `${file}.cb`
        const project = existsSync(path)
          ? await loadProject(path)
          : createProject(path)
        project.writeDataFile(action.data)
        ws.send(makeActionString({ type: 'saved' }))
        break
      }
    }
  })
})
