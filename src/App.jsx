import React, { useState } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '@/router'
import ToolBar from './component/toolbar'
import LeftBar from './component/leftBar'
import { Layout } from 'antd'
const { Header, Footer, Sider, Content } = Layout

function App() {
  const element = useRoutes(routes)

  return (
    <React.Fragment>
      <Layout>
        <Sider>
          <LeftBar />
        </Sider>
        <Layout>
          <Header>
            <ToolBar />
          </Header>
          <Content>{element}</Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </React.Fragment>
  )
}

export default App
