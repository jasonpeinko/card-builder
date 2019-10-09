import electron from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'

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
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
