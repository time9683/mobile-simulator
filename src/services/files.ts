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
  children: FileSystemEntry[];
  isDirectory: true;
}

interface FileSystem{
  root: Directory
  mkdir(path: string,name:string): Result<Directory>
  touch(path: string,name:string): Result<File>
  getFromPath(path: string): Result<Directory>

}


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
      children: []
    }
  }


  suscribe(cb: () => void){
    this.suscribers.push(cb);
  }

  update(){
    for(const cb of this.suscribers){
      cb();
    }
  }

  // create a new file
  touch(path: string,name: string): Result<File>{

    const parentDir = this.getFromPath(path);
    if(!parentDir.ok){
      return Err(parentDir.error);
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

  getFromPath(path: string):Result<Directory>{

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