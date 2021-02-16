const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;
process.env.NODE_ENV = 'production';
let MainWindow;
let addWindow;
let helppopupwindow;

//listen for app to be ready
app.on('ready', function() {
    //create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    //load html window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //quit on app close
    mainWindow.on('closed', function() {
        app.quit();
    });

    //build menu template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

// handle create add window
function createAddWindow() {
    //create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true
        }
    });
    //load html window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //garbage collection
    addWindow.on('close', function() {
        addWindow = null;
    });
}

//help popup window
function helppopup() {
    //create new window
    helppopupwindow = new BrowserWindow({
        width: 600,
        height: 600,
        title: 'Help',
        webPreferences: {
            nodeIntegration: true
        }
    });
    //load html window
    helppopupwindow.loadURL(url.format({
        pathname: path.join(__dirname, 'helppopup.html'),
        protocol: 'file:',
        slashes: true
    }));

    //garbage collection
    helppopupwindow.on('close', function() {
        helppopupwindow = null;
    });
}

//catch item:add
ipcMain.on('item:add', function(e, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

//create menu template
const mainMenuTemplate = [{
        label: 'File',
        submenu: [{
                label: 'Add Item',
                accelerator: process.platform == 'darwin' ? "Command+N" : "Ctrl+N",
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                accelerator: process.platform == 'darwin' ? "Command+M" : "Ctrl+M",
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Help',
        accelerator: process.platform == 'darwin' ? "Command+H" : "Ctrl+H",
        click() {
            helppopup();
        }
    }
];

//if mac, add empty obj to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//dev tools if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? "Command+I" : "Ctrl+I",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}