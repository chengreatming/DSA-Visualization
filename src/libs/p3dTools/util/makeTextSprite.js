import * as THREE from 'three'
import toolColors from '../stateManagement/toolColors'
export default function makeTextSprite(message, parameters) {
  if (parameters === undefined) parameters = {}

  var fontface = parameters.hasOwnProperty('fontface') ?
    parameters['fontface'] : 'Arial'

  /* 字体大小 */
  var fontsize = parameters.hasOwnProperty('fontsize') ?
    parameters['fontsize'] : 18

  /* 创建画布 */
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  context.save()
  /* 字体加粗 */
  context.font = 'Bold ' + fontsize + 'px ' + fontface

  /* 获取文字的大小数据，高度取决于文字的大小 */
  var metrics = context.measureText(message)
  var textWidth = metrics.width * 1.5
  var textHeight = fontsize + 10
  context.restore()

  canvas.width = textWidth
  canvas.height = textHeight
  canvas.style.width = canvas.width + 'px'
  canvas.style.height = canvas.height + 'px'

  context.save()
  context.fillStyle = 'rgba(255,255,255,0)'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.restore()

  context.save()
  canvas.width = textWidth * 1.4
  canvas.height = textHeight
  canvas.style.width = canvas.width + 'px'
  canvas.style.height = canvas.height + 'px'
  // canvas.style.border = '1px solid #d3d3d3'
  canvas.style.background = 'rgba(255,255,255,0)'
  /* 字体颜色 */
  var fontColor = parameters.hasOwnProperty('fontColor') ?
    parameters['fontColor'] : { r: 95, g: 95, b: 95, a: 1.0 }
  context.font = 'Bold ' + fontsize + 'px ' + fontface
  // context.fillStyle = 'rgba(' + fontColor.r + ',' + fontColor.g + ','
  //   + fontColor.b + ',' + fontColor.a + ')'
  context.fillStyle = 'rgba(255,255,255,1)'
  var padding = 20
  context.fillText(message, padding, fontsize)
  context.restore()
  /* 画布内容用于纹理贴图 */

  /* 缩放比例 */
  const rate = textWidth / fontsize
  const scaleY = 20
  const scaleX = scaleY * rate

  // 控制台打印canvas图片
  // const consoleImage = (canvas) => {
  //   if (!canvas) return false
  //   const dataUrl = canvas.toDataURL()
  //   const image = new Image()
  //   return new Promise((resolve, reject) => {
  //     image.onload = function () {
  //       const style = [
  //         'font-size: 1px',
  //         'line-height: ' + canvas.height + 'px',
  //         'padding: ' + .5 + 'px ' + canvas.width * .5 + 'px',
  //         'background-size: ' + canvas.width + 'px ' + canvas.height + 'px',
  //         'background: url(' + dataUrl + ') no-repeat'
  //       ].join(' ')
  //       console.log('w/h', canvas.width, canvas.height)
  //       console.log('scale', scaleX, scaleY)
  //       console.log('%c ', style)
  //       resolve(true)
  //     }
  //     image.onerror = function (e) {
  //       console.log('image.onerror', e)
  //       reject(false)
  //     }
  //     image.src = dataUrl
  //   })
  // }
  // consoleImage(canvas)
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  var spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    color: toolColors.getTipsColor(),
    depthTest: false
  })
  var sprite = new THREE.Sprite(spriteMaterial)
  sprite.name = message
  sprite.center.set(0, 0)
  sprite.scale.set(scaleX || 1, scaleY || 1, 1)
  Object.assign(sprite.userData, {
    initialScale: sprite.scale.clone(),
    textWidth: canvas.width,
    textHeight: canvas.height
  })
  return sprite
}

export function makeSpriteTexture(message, parameters) {

  if (parameters === undefined) parameters = {}

  var fontface = parameters.hasOwnProperty('fontface') ?
    parameters['fontface'] : 'Arial'

  /* 字体大小 */
  var fontsize = parameters.hasOwnProperty('fontsize') ?
    parameters['fontsize'] : 18

  /* 创建画布 */
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  context.save()
  /* 字体加粗 */
  context.font = 'Bold ' + fontsize + 'px ' + fontface
  context.fillStyle = 'rgba(255,255,255,1)'
  /* 获取文字的大小数据，高度取决于文字的大小 */
  var metrics = context.measureText(message)
  var textWidth = metrics.width
  context.restore()
  context.save()
  canvas.width = textWidth * 1.2
  canvas.height = fontsize + 10
  canvas.style.width = canvas.width + 'px'
  canvas.style.height = canvas.height + 'px'
  canvas.style.border = '1px solid #d3d3d3'

  /* 字体颜色 */
  var fontColor = parameters.hasOwnProperty('fontColor') ?
    parameters['fontColor'] : { r: 95, g: 95, b: 95, a: 1.0 }
  context.font = 'Bold ' + fontsize + 'px ' + fontface
  context.fillStyle = 'rgba(' + fontColor.r + ',' + fontColor.g + ','
    + fontColor.b + ',' + fontColor.a + ')'
  var padding = fontsize / 4
  context.fillText(message, padding, fontsize)
  context.restore()
  /* 画布内容用于纹理贴图 */

  // 控制台打印canvas图片
  const consoleImage = (canvas) => {
    if (!canvas) return false
    const dataUrl = canvas.toDataURL()
    const image = new Image()
    return new Promise((resolve, reject) => {
      image.onload = function () {
        const style = [
          'font-size: 1px',
          'line-height: ' + canvas.height + 'px',
          'padding: ' + .5 + 'px ' + canvas.width * .5 + 'px',
          'background-size: ' + canvas.width + 'px ' + canvas.height + 'px',
          'background: url(' + dataUrl + ') no-repeat'
        ].join(' ')
        console.log('%c ', style)
        resolve(true)
      }
      image.onerror = function (e) {
        reject(false)
      }
      image.src = dataUrl
    })
  }
  consoleImage(canvas)
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}