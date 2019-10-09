"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __importDefault(require("electron"));
var app = electron_1.default.app;
var BrowserWindow = electron_1.default.BrowserWindow;
var mainWindow;
var createWindow = function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false
    });
    // mainWindow.loadFile(
    //   path.join(__dirname, '/../public/index.html'),
    // )
    mainWindow.loadURL('http://localhost:3333');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    mainWindow.webContents.openDevTools();
    console.log('hi');
};
app.on('ready', function () {
    createWindow();
});
app.on('window-all-closed', function () {
    app.quit();
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
