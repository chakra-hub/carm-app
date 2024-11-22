import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import TodoPage from './components/TodoPage'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
   <BrowserRouter>
   <Navbar/>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/todos' element={<TodoPage/>}/>
    </Routes>
   </BrowserRouter>
    </>
  )
}

export default App
