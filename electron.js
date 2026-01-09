const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Ini akan mengarah ke folder build yang sudah Anda buat
  win.loadFile(path.join(__dirname, 'build/index.html'));
}

app.whenReady().then(createWindow);