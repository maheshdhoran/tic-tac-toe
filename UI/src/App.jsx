import { useState } from 'react'
import { UserContext } from './utility/UserContext'
import { Route, Routes } from 'react-router'
import  Cookies  from 'js-cookie'
import Home from './components/Home'
import Game from './components/game/Game'
import './App.css'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate } from 'react-router-dom'
function App() {
  const [user, setUser] = useState(undefined)

  useEffect(()=>{
    const getUser= Cookies.get('user')
    if(getUser){
      setUser(JSON.parse(getUser))
    }
  },[])

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Navbar/>
      <Routes>
        <Route path='/' element= {<Home />} />
        <Route path='/game/:roomID' element= {<Game />}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserContext.Provider>
  )
}

export default App
