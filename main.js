const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require('fs-extra');
const path = require('path');

let mainWindow;

try {
    require("electron-reloader")(module);
} catch (_) {}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on("ready", createWindow);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: "public/favicon.png",
    });

    mainWindow.loadFile("public/index.html");

    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
    if (mainWindow === null) createWindow();
});

function readSelected(directory, event) {
    let processedFiles = [];

    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        for (var i = 0; i < files.length; i++) {
            if (files[i].isDirectory()) {
                processedFiles.push({
                    name: files[i].name, isDirectory: 1, addr: path.join(directory, files[i].name)
                });
            }
            else {
                processedFiles.push({
                    name: files[i].name, isDirectory: 0, addr: path.join(directory, files[i].name)
                });
            }
        }

        event.sender.send('directory', {
            directory,
            files: processedFiles
        });
    });
}

ipcMain.on('select', (event, arg) => {
    if (arg) return readSelected(arg, event);

    dialog.showOpenDialog(mainWindow, {
        title: "Select directory",
        properties: ['openDirectory']
    }).then(result => {
        if (!result.cancelled && result.filePaths.length > 0) {
            let directory = result.filePaths[0];

            readSelected(directory, event);
        }
    }).catch(err => {
        console.log("Error opening file: ", err);
    });
});