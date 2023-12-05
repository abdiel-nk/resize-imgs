const path = require('path');

const {app, BrowserWindow, Menu} = require('electron');
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'development';

//Create main Window 
function createMainWindow(){
 const mainWindow= new BrowserWindow({
    title: 'Image Resizer',
    width: isDev? 1000: 500,
    height: 600
 });   

 //open devtools if in dev env

 if(isDev){
    mainWindow.webContents.openDevTools();
 }


 mainWindow.loadFile(path.join(__dirname, './render/index.html'));
}  

//When the app is going to run 
app.whenReady().then(()=>{
    createMainWindow();

    //implement menu

    const mainMenu= Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu)

    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length === 0){
            createMainWindow()
        }
    });
})
//Menu template
const menu= {
    label:'File',
    submenu:[{
        label: 'Quit',
        click: ()=>app.quit(),
        accelerator: 'CmdOrCtrl+W'
    }
   ]
};



app.on('window-all-closed', ()=>{
    if(isMac){
        app.quit()
    }
});
