const path = require('path');
const os =require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron');

process.env.NODE_ENV = 'production';
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';
let mainWindow;
//Create main Window 
function createMainWindow(){
  mainWindow= new BrowserWindow({
    title: 'Image Resizer',
    width: isDev? 1000: 500,
    height: 600,
    webPreferences:{
        contextIsolation: true,
        nodeIntegration:true,
        preload: path.join(__dirname, 'preload.js')
    }
 });   




 //open devtools if in dev env

 if(isDev){
    mainWindow.webContents.openDevTools();
 }
 mainWindow.loadFile(path.join(__dirname, './render/index.html'));
}  
//Create about windows
function createAboutWindow(){
    const aboutWindow= new BrowserWindow({
        title: 'About Image Resizer',
        width: 300,
        height: 300
});
 aboutWindow.loadFile(path.join(__dirname, './render/about.html'));
}
//When the app is going to run 
app.whenReady().then(()=>{
    createMainWindow();

    //implement menu

    const mainMenu= Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    // remove mainWindow from memory on close

    mainWindow.on('closed',()=>(mainWindow = null));
    
    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length === 0){
            createMainWindow()
        }
    });
});
//Menu template
const menu= [
        ...(isMac ? 
            [
            {
            label: app.name,
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                },
            ],
         },
      ]
    : []),
    {
        role: 'fileMenu',
    },
    ...(!isMac ? [{
        label: 'help',
        submenu : [{
            label:'about',
            click: createAboutWindow
        },
    ],
    },
    ] 
: []),
];

//response to ipcrenderer resize

ipcMain.on('image:resize',(e,options)=>{
    options.dest = path.join(os.homedir(),'imageresizer');
    resizeImage(options);
});

//resize the image
async function resizeImage({imgPath,width,height, dest}){
    try{
        const newPath = await resizeImg(fs.readFileSync(imgPath),{
            width: +width,
            height: +height
        });
        //create filename
        const filename = path.basename(imgPath);
        //create destinatoin folder if not exists
        if(!fs.existsSync(dest)){
            fs.mkdirSync(dest);
        }
        //write file to dest
        fs.writeFileSync(path.join(dest, filename), newPath);
        //send success to render
        mainWindow.webContents.send('image:done');
        //Open dest folder    
        shell.openPath(dest);
    }
    catch(error){
        console.log(error);
    }
}

app.on('window-all-closed', ()=>{
    if(isMac){
        app.quit()
    }
});
