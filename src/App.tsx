import OSHeader from './components/OSHeader'
import Page from '@components/page'
function App() {

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <OSHeader />
      {/* <p> filler</p> */}
      <Page />
    </div>
  )
}

export default App
