import FileNoteIcon from "@/assets/notes.png"

interface MetaData{
  createdAt: Date;
  updatedAt: Date;
}

type Result<T> =  {ok: true, value: T} | {ok: false, error: string};

function Ok<T>(value: T): Result<T>{
  return {ok: true, value};
}

function Err(error: string): Result<never>{
  return {ok: false, error};
}




export interface FileSystemEntry{
  name: string;
  metaData: MetaData;
  isDirectory: boolean;
  size?: number;
}

export interface File extends FileSystemEntry{
  content: string | ArrayBuffer;
  contentType?: string;
  isDirectory: false;
}



export interface Directory extends FileSystemEntry{
  children: FileNode[]
  isDirectory: true;
}

export type FileNode = File | Directory


interface FileSystem{
  root: Directory
  mkdir(path: string,name:string): Result<Directory>
  WriteFile(path: string,content: string): Result<File>
  touch(path: string,name:string): Result<File>
  getFromPath(path: string): Result<FileNode>
  rm(path: string): Result<void>

}






//     {
//         name: "Whatsapp",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/733/733585.png"
//     },
//     {
//         name: "Chrome",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732200.png"
//     },
//     {
//         name: "Netflix",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/870/870910.png"
//     },
//     {
//         name: "Spotify",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/174/174872.png"
//     },
//     {
//         name: "Amazon",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732217.png"
//     },
//     {
//         name: "Youtube",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
//     },
//     {
//         "name": "Galeria",
//         "urlIcon": "https://static.vecteezy.com/system/resources/previews/042/712/634/non_2x/google-gallery-icon-logo-symbol-free-png.png"
//     },
//     {
//         name: "Procesos",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/10239/10239999.png"
//     },
//     {
//         name: "Camara",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/1373/1373061.png"

//     },
//     {
//         name: "Telefono",
//         urlIcon: "https://cdn.iconscout.com/icon/free/png-256/free-apple-phone-icon-download-in-svg-png-gif-file-formats--logo-call-apps-pack-user-interface-icons-493154.png?f=webp&w=256"
//     },
//     {
//         name: "Recorder",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/3817/3817556.png"
//     },

//     {
//         name: "FileExplorer",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732223.png"
//     },
//     {
//         name: "BlockNotes",
//         urlIcon: FileNoteIcon
//     },
//     {
//         name:"vscode",
//         urlIcon:"https://cdn-icons-png.flaticon.com/512/732/732212.png"
//     }








class WebFileSys implements FileSystem{
  root: Directory;
  suscribers: (() => void)[] = [];
  constructor(){
    this.root = {
      name: '/',
      metaData: {
        createdAt: new Date(),
        updatedAt: new Date()
      },
      isDirectory: true,
      children: [
        {
          name: 'Documents',
          metaData: {
            createdAt: new Date(),
            updatedAt: new Date()
          },
          isDirectory: true,
          children: [
            
            {
              name: 'Biografia.txt',
              metaData: {
                createdAt: new Date(),
                updatedAt: new Date()
              },
              isDirectory: false,
              content: 'Hello World',
              contentType: 'text/plain'
            }

          ]
        },
        {
          name: 'Desktop',
          metaData: {
            createdAt: new Date(),
            updatedAt: new Date()
          },
          isDirectory: true,
          children: [{
            name:"Chrome",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/732/732200.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Whatsapp",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/733/733585.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Netflix",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/870/870910.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Spotify",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/174/174872.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Amazon",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/732/732217.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Youtube",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Galeria",
            isDirectory:false,
            content:"https://static.vecteezy.com/system/resources/previews/042/712/634/non_2x/google-gallery-icon-logo-symbol-free-png.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Procesos",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/10239/10239999.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Camara",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/1373/1373061.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Telefono",
            isDirectory:false,
            content:"https://cdn.iconscout.com/icon/free/png-256/free-apple-phone-icon-download-in-svg-png-gif-file-formats--logo-call-apps-pack-user-interface-icons-493154.png?f=webp&w=256",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"Recorder",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/3817/3817556.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"FileExplorer",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/732/732223.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"BlockNotes",
            isDirectory:false,
            content:FileNoteIcon,
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name:"vscode",
            isDirectory:false,
            content:"https://cdn-icons-png.flaticon.com/512/732/732212.png",
            contentType:"app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            name: "Sheets",
            isDirectory: false,
            content: "https://cdn.icon-icons.com/icons2/3053/PNG/512/google_sheets_alt_macos_bigsur_icon_190110.png",
            contentType: "app",
            metaData: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
        ]
        },
        {
          name: 'Music',
          metaData: {
            createdAt: new Date(),
            updatedAt: new Date()
          },
          isDirectory: true,
          children: []
        },
        {
          name: 'Downloads',
          metaData: {
            createdAt: new Date(),
            updatedAt: new Date()
          },
          isDirectory: true,
          children: []
        },
        {
          name: 'Images',
          metaData: {
            createdAt: new Date(),
            updatedAt: new Date()
          },
          isDirectory: true,
          children: []
        }
        
        
  ]



    }
  }


  suscribe(cb: () => void){
    this.suscribers.push(cb);
  }

  desuscribe(cb: () => void){
    const index = this.suscribers.findIndex(c => c === cb);
    if(index !== -1){
      this.suscribers.splice(index,1);
    }
  }


  update(){
    for(const cb of this.suscribers){
      cb();
    }
  }


  // write content to a file
  WriteFile(path: string,content: string): Result<File>{
    console.log('writing file',path,content);
    const pathParts = path.split('/').filter(part => part !== '');
    const name = pathParts.pop();
    if(pathParts.length === 0){
      pathParts.push('/');
    }
    const parentDir = this.getFromPath(pathParts.join('/'));
    if(!parentDir.ok){
      return Err(parentDir.error);
    }

    if(!parentDir.value.isDirectory){
      return Err(`Path ${path} is not a directory`);
    }

    const file = parentDir.value.children.find(child => child.name === name);
    if(!file){
      return Err(`File ${name} not found`);
    }

    if(file.isDirectory){
      return Err(`Path ${path} is a directory`);
    }

    file.content = content;
    file.metaData.updatedAt = new Date();
    this.update();
    return Ok(file);
  }






  // remove a file or directory
  rm(path: string): Result<void>{
    // /file.txt
    const pathParts = path.split('/').filter(part => part !== '');
    const name = pathParts.pop();
    if(pathParts.length === 0){
      pathParts.push('/');
    }
    const parentDir = this.getFromPath(pathParts.join('/'));
    if(!parentDir.ok){
      return Err(parentDir.error);
    }

    if(!parentDir.value.isDirectory){
      return Err(`Path ${path} is not a directory`);
    }


    const index = parentDir.value.children.findIndex(child => child.name === name);
    if(index === -1){
      return Err(`Path ${path} not found`);
    }
    parentDir.value.children.splice(index,1);
    this.update();
    return Ok(undefined);
  }



  // create a new file
  touch(path: string,name: string): Result<File>{

    const parentDir = this.getFromPath(path);
    if(!parentDir.ok){
      return Err(parentDir.error);
    }

    if(!parentDir.value.isDirectory){
      return Err(`Path ${path} is not a directory`);
    }

    if (name === '') {
      return Err('Name cannot be empty');
    }


    const file: File = {
      name,
      metaData: {
        createdAt: new Date(),
        updatedAt: new Date()
      },
      isDirectory: false,
      content: '',
      contentType: 'text/plain'
    }
    parentDir.value.children.push(file);
    this.update();
    return Ok(file);
    
  }






  // create a new directory
  mkdir(path: string,name: string): Result<Directory>{

  
    const parentDir = this.getFromPath(path);

    if(!parentDir.ok){
      return Err(parentDir.error);
    }

    if(!parentDir.value.isDirectory){
      return Err(`Path ${path} is not a directory`);
    }

    if (name === '') {
      return Err('Name cannot be empty');
    }


    const dir:Directory = {
      name,
      metaData: {
        createdAt: new Date(),
        updatedAt: new Date()
      },
      isDirectory: true,
      children: []
    }

    parentDir.value.children.push(dir);
    this.update();
    return Ok(dir);
  }


  printFileSystem(){
    console.log(this.root);
  }

  getFromPath(path: string):Result<FileNode>{

    if(path == ''){
      return Err('Path cannot be empty');
    }


    let currentDir = this.root;
    const pathParts = path.split('/').filter(part => part !== '');
    for(const part of pathParts){
      const dir = currentDir.children.find(child => child.name === part);
      if(!dir){
        return Err(`Path ${path} not found`);
      }
      currentDir = dir as Directory;
    }
    return Ok(currentDir);
  }
}


const fileSystem = new WebFileSys();

export default fileSystem;

