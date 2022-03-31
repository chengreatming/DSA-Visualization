import { Button } from 'antd'
import React, { useEffect } from 'react'

export default function ToolBar() {
  return (
    <div>
      <Button type="primary">缩放</Button>
      <Button type="primary">平移</Button>
      <Button type="primary">旋转</Button>
    </div>
  )
}
