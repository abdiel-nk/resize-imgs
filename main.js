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

    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length === 0){
            createMainWindow()
        }
    });
})
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


app.on('window-all-closed', ()=>{
    if(isMac){
        app.quit()
    }
});
