import React, { useRef, useEffect } from 'react'
import p3dTools from '@/libs/p3dTools'
import * as THREE from 'three'
import Controler from './controler'
import { ResizeSensor } from 'css-element-queries'
let scene, camera, renderer, light

function Points(props) {
  const divRef = useRef(null),
    canvasRef = useRef(null),
    modlesControlerRef = useRef(null)

  // canvas尺寸自适应
  const resizeCanvas = () => {
    const { clientWidth, clientHeight } = divRef.current
    const canvas = canvasRef.current
    if (canvas && clientWidth && clientHeight) {
      const width = clientWidth,
        height = clientHeight
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${canvas.width}px`
      canvas.style.height = `${canvas.height}px`
      const controls = modlesControlerRef.current
      if (controls && controls.resize) {
        controls.resize(width, height)
      }
    }
  }
  // 初始化场景
  const init = () => {
    const canvas = canvasRef.current
    const { clientWidth, clientHeight } = divRef.current

    // 计算视觉中心位置
    const volumeBoundingBox = new THREE.Box3()
    volumeBoundingBox.max.set(512, 512, 512)
    const maxDistance =
      Math.sqrt(
        volumeBoundingBox.max.x * volumeBoundingBox.max.x +
          volumeBoundingBox.max.y * volumeBoundingBox.max.y +
          volumeBoundingBox.max.z * volumeBoundingBox.max.z
      ) * 1.5
    const position = new THREE.Vector3(
      volumeBoundingBox.max.x / 2,
      maxDistance,
      volumeBoundingBox.max.z / 2
    )
    const target = volumeBoundingBox.getCenter(new THREE.Vector3())

    // 设置camera
    camera = new THREE.OrthographicCamera(
      -clientWidth / 2,
      clientWidth / 2,
      clientHeight / 2,
      -clientHeight / 2,
      0.1,
      3000
    )
    camera.position.copy(position)
    camera.lookAt(target)

    // 设置scene
    scene = new THREE.Scene()
    scene.add(camera)
    light = new THREE.DirectionalLight(0xffffff, 1.3)
    light.position.copy(camera.position)
    const lightObject = new THREE.Object3D()
    lightObject.position.copy(target)
    light.target = lightObject

    scene.add(light)

    // 设置renderer
    renderer = new THREE.WebGLRenderer({
      // premultipliedAlpha: false,
      // sortObjects: true,
      antialias: true, // 抗锯齿
      alpha: true, //背景透明
      canvas: canvas,
      context: canvas.getContext('webgl2')
    })
    renderer.localClippingEnabled = true
    renderer.autoClear = false // 手动clear才能将另一个场景覆盖上来
    // renderer.autoClearDepth = false
    renderer.sortObjects = false // 根据children顺序渲染

    // 白色背景
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(divRef.current.clientWidth, divRef.current.clientHeight)

    // 设置交互控制器
    modlesControlerRef.current = new Controler({
      scene,
      camera,
      renderer,
      light,
      canvas: canvasRef.current,
      boundingBox: volumeBoundingBox
    })

    // 设置p3dTools
    p3dTools.init({
      // showSVGCursors: true,
    })

    const enableElement = {
      camera,
      scene,
      control: modlesControlerRef.current,
      domElement: canvas,
      widgets: {
        getVolumeBoundingBox: () => volumeBoundingBox
      },
      target: target.clone(),
      offset: new THREE.Vector3(0, 0, 0)
    }
    p3dTools.addEnabledElement(enableElement)

    const tools = ['ZoomTool', 'ZoomMouseWheelTool', 'PanTool', 'RotateTool']
    tools.forEach(tool => {
      p3dTools[tool] && p3dTools.addTool(p3dTools[tool])
    })

    // 初始工具，中键拖动，右键旋转，滚轮缩放, 不可更改
    p3dTools.setToolActive('PanTool', { mouseButtonMask: 4 })
    p3dTools.setToolActive('RotateTool', { mouseButtonMask: 2 })
    p3dTools.setToolActive('ZoomMouseWheelTool', { mouseButtonMask: 1 })

    // 设置方位显示盒子
    // const orientationBox = new OrientationBoxHelper({
    //   size: 30,
    //   rotation: camera.rotation,
    //   renderSize: new THREE.Vector2(clientWidth, clientHeight),
    //   camera
    // })

    // modlesControlerRef.current.addOrientationBoxHelper(orientationBox)
    // 坐标轴
    const axesHelper = new THREE.AxesHelper(500)
    scene.add(axesHelper)

    // 设置canvas尺寸自适应
    const resizeSensor = new ResizeSensor(divRef.current, resizeCanvas)

    // for test
    Object.assign(window, {
      scene,
      camera,
      renderer,
      modles: props.modles,
      light,
      modelControler: modlesControlerRef.current
    })
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div
      className="content"
      ref={divRef}
      onContextMenu={e => {
        e.preventDefault()
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}

export default Points
