import AadhaarDisplayPage from "./pages/AadharList"
import Home from "./pages/Home"
import { BrowserRouter,Route,Routes } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/list" element={<AadhaarDisplayPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App