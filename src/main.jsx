import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router , Routes, Route} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import WelcomeScreen from './WelcomeScreen.jsx' //when this is immorted 
import LeaderBoard from "./LeaderBoard.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Router>
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/game" element={<App />} />
      <Route path = "/leaderboard" element = {<LeaderBoard/>}/>
    </Routes>
  </Router>
  </StrictMode>
)
