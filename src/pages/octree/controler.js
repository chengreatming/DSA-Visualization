// import STLloader from './loaders/STLLoader'
import * as THREE from 'three'
// import { UndoManager } from '@/utils/PVTools'
// import exporter from '@/utils/stlExporter'
// import Oit from './oit'
// import async from 'async'

// const loader = new STLloader()
export default class ModelControler extends THREE.EventDispatcher {
  constructor({ scene, camera, renderer, modles, canvas, boundingBox, light }, opts) {
    super()
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.modles = modles
    this.canvas = canvas
    this.light = light
    this.boundingBox = boundingBox
    this.opts = Object.assign({
      useOIT: false
    }, opts)
    canvas.addEventListener('p3dtoolsupdateimage', this.render)
  }

  /**
   * 窗宽大小重置
   *
   * @param {Number} width
   * @param {Number} height
   * @memberof ModelControler
   */
  resize(width, height) {
    const { camera, renderer } = this
    camera.left = -width / 2
    camera.right = width / 2
    camera.top = height / 2
    camera.bottom = -height / 2
    // camera.aspect = width / height
    // 渲染器大小
    camera.updateWorldMatrix()
    camera.updateMatrixWorld()
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    if (this.orientationBox) {
      this.orientationBox.resize(width, height)
    }
    if (this.opts.useOIT && this.oit.isInit) {
      this.oit.uniforms.rendererSize.value.set(1 / width, 1 / height)
      this.oit.alphaRenderTarget.setSize(width, height)
      this.oit.colorRenderTarget.setSize(width, height)
    }

    this.render()

  }

  /**
   * 渲染
   *
   * @memberof ModelControler
   */
  render = () => {
    // this.t = new Date().getTime()
    // console.time('render' + this.t)
    // this.updateSpriteScale()
    this.updateLight()
    this.renderer.setClearAlpha(0.0);
    this.renderer.clear()
    if (this.opts.useOIT) {
      this.oit.render()
    } else {
      this.renderer.render(this.scene, this.camera)
    }
    if (this.orientationBox) {
      // console.log('render orientationBox');
      this.renderer.render(this.orientationBox.scene, this.orientationBox.camera)
    }
    // console.timeEnd('render' + this.t)
  }

  /**
   * 更新灯光
   *
   * @memberof ModelControler
   */
  updateLight() {
    if (this.light && this.light.position) {
      this.light.position.copy(this.camera.position)
    }
  }

  /**
   * OIT渲染算法开关
   *
   * @param {Boolean} useOIT
   * @memberof ModelControler
   */
  useOIT(useOIT = true) {
    this.opts.useOIT = useOIT
    this.oit.init()
  }
}