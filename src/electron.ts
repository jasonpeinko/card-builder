import electron from 'electron'
import path from 'path'

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow: any

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false
  })
  // mainWindow.loadFile(
  //   path.join(__dirname, '/../public/index.html'),
  // )
  mainWindow.loadURL('http://localhost:3333')
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.openDevTools()
  console.log('hi')
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
