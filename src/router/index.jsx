import React from 'react'

import Home from '@/pages/home'
import Octree from '@/pages/octree'
import Kdtree from '@/pages/kdtree'
const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/octree',
    element: <Octree />
  },
  {
    path: '/kdtree',
    element: <Kdtree />
  }
]

export default routes
