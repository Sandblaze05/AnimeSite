import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AnimeDetails from './pages/AnimeDetails'
import SearchResult from './pages/SearchResult'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/anime/:id' element={<AnimeDetails/>}/>
        <Route path='/search/:query' element={<SearchResult/>}/>
      </Routes>
    </Router>
  )
}

export default App