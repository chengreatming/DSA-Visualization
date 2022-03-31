import { Menu } from 'antd'
import React, { useEffect } from 'react'
import catalog from '@/catalog'
import { NavLink } from 'react-router-dom'

export default function LeftBar(props) {
  return (
    <div className="leftBar">
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        {catalog.map((item, idx) => {
          return (
            <Menu.Item key={idx} icon={item.icon}>
              <NavLink style={{ textDecoration: 'none' }} end to={item.path}>
                {item.name}
              </NavLink>
            </Menu.Item>
          )
        })}
      </Menu>
    </div>
  )
}
