import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormRegistration from './pages/home'; 
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route  path="/" element={<FormRegistration />} />
        </Routes>
        
      </BrowserRouter>

    </>
  )
}

export default App
