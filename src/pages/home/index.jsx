import React from 'react'
import { NavLink } from 'react-router-dom'
function Home() {
  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default Home
