import React, { useEffect } from 'react'

import {
  BarChartOutlined,
  CloudOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'

const catalog = [
  {
    name: 'home',
    path: '/',
    icon: <UserOutlined />,
    description: '首页'
  },
  {
    name: 'octree',
    path: '/octree',
    icon: <BarChartOutlined />,
    description: '空间八叉树'
  },
  {
    name: 'kdtree',
    path: '/kdtree',
    icon: <CloudOutlined />,
    description: 'kdtree'
  }
]

export default catalog
