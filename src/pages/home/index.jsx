import React from 'react'
import { NavLink } from 'react-router-dom'
function Home() {
  return (
    <div className="content">
      <header>
        <p>{/* Visuion of Data Structures and Algorithms Examples */}</p>
      </header>
      <p>
        <NavLink end to="/octree">
          octree
        </NavLink>
      </p>
      <p>
        <NavLink end to="/kdtree">
          kdtree
        </NavLink>
      </p>
    </div>
  )
}

export default Home
