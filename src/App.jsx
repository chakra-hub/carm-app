import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import TodoPage from './components/TodoPage'
import Navbar from './components/Navbar'
import { useState } from 'react'

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <>
   <BrowserRouter>
   <Navbar onAuthChange={setIsAuthenticated} isAuthenticated={isAuthenticated}/>
    <Routes>
      <Route path='/' element={<LandingPage onAuthChange={setIsAuthenticated}/>}/>
      <Route path='/todos' element={<TodoPage onAuthChange={setIsAuthenticated}/>}/>
    </Routes>
   </BrowserRouter>
    </>
  )
}

export default App
