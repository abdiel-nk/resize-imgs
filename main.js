const path = require('path');

const {app, BrowserWindow} = require('electron');
//Window app
function createMainWindow(){
 const mainWindow= new BrowserWindow({
    title: 'Image Resizer',
    width: 500,
    height: 600
 });   
 mainWindow.loadFile(path.join(__dirname, './render/index.html'));
}  


app.whenReady().then(()=>{
    createMainWindow();
})