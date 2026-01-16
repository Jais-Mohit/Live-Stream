// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoLive from './GoLive';
import Watch from './Watch';

function App() {

  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoLive />} />
        <Route path="/watch" element={<Watch />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
