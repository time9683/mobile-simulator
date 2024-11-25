import useMovilStore from "@stores/movil"

const fileOptions = ["cut","copy","delete","open chrome"] as const
const ExplorerOptions = ["new folder","new file","paste","open vscode"] as const

export type OptionExplorer  =  typeof ExplorerOptions[number]
export type OptionFile = typeof fileOptions[number]

export type ContextMenuOption = | {type:"file",option:OptionFile} | {type:"explorer",option:OptionExplorer}


export type Option = ContextMenuOption["option"]




export default  function ContentMenu(){
  const context = useMovilStore((state) => state.ContextMenu)
  const setContextMenu = useMovilStore((state) => state.setContextMenu)
  const options = context.file ? fileOptions : ExplorerOptions


  if (!context.visible) return <></>


  

  function handleOptionClick(option:Option){
    context.actionHandler(option)
    setContextMenu(0,0,false,"",undefined,()=>{})
  } 



  return  <div className="bg-neutral-800  border-neutral-600 border w-52 h-min z-20 text-white"
      
  style={{position:"absolute",top:`${context.y}px`,left:`${context.x}px`}}
  >
  {
      options.map((option)=>{
          return <button 
          key={option}
          onClick={()=>handleOptionClick(option)}
          
          className="w-full p-2  border-neutral-700 text-xs
          hover:bg-neutral-700 hover:text-neutral-100
          
          ">{option}</button>
      }
      )
  }

</div>



}