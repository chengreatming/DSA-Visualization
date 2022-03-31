import React, { useState } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '@/router'
import ToolBar from './component/toolbar'
function App() {
  const element = useRoutes(routes)

  return (
    <React.Fragment>
      <ToolBar />
      {element}
    </React.Fragment>
  )
}

export default App
