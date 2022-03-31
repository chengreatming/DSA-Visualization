import * as THREE from 'three'
function verify(enabledElement) {
  return (enabledElement && enabledElement.domElement && enabledElement.camera)
}

function pageToScreen(enabledElement, pageCoord) {
  if (!enabledElement || !enabledElement.domElement) {
    console.log('element not enabled')
    return pageCoord
  }

  const element = enabledElement.domElement
  const rect = element.getBoundingClientRect();
  const x = pageCoord.x - rect.left - window.pageXOffset;
  const y = pageCoord.y - rect.top - window.pageYOffset;
  return new THREE.Vector2(x, y)
}
function screenToNdc(enabledElement, vec2) {
  if (verify(enabledElement)) {
    const { clientWidth, clientHeight } = enabledElement.domElement,
      // x = (vec2.x + 1) * clientWidth / 2,
      // y = (-vec2.y + 1) * clientHeight / 2
      x = 2 * vec2.x / clientWidth - 1,
      y = 1 - 2 * vec2.y / clientHeight
    return new THREE.Vector2(x, y)
  }
}

function ndcToScreen(enabledElement, cameraCoord) {
  if (verify(enabledElement)) {
    const { clientWidth, clientHeight } = enabledElement.domElement
    const a = clientWidth / 2;
    const b = clientHeight / 2;
    const x = Math.round(cameraCoord.x * a + a);
    const y = Math.round(-cameraCoord.y * b + b);
    const screenCoord = new THREE.Vector2(x, y);

    return screenCoord
  }
}

// Z坐标是不准的
function ndcToWorld(enabledElement, cameraCoord) {
  if (verify(enabledElement)) {
    const worldCoord = new THREE.Vector3(cameraCoord.x, cameraCoord.y, 0).unproject(enabledElement.camera)
    return worldCoord
  }
}

function worldToNdc(enabledElement, worldVector) {
  if (verify(enabledElement)) {
    const ndcCoord = worldVector.clone().project(enabledElement.camera);

    return ndcCoord
  }
}

// screen => ndc => world
function screenToWorld(enabledElement, vec2) {
  if (verify(enabledElement)) {
    const ndcCoord = screenToNdc(enabledElement, vec2)
    const worldCoord = ndcToWorld(enabledElement, ndcCoord)

    return worldCoord
  }
}
// world => ndc => screen
function worldToScreen(enabledElement, worldCoord) {
  if (verify(enabledElement)) {
    //世界坐标转标准设备坐标Ndc
    const ndcCoord = worldToNdc(enabledElement, worldCoord)
    const screenCoord = ndcToScreen(enabledElement, ndcCoord)
    return screenCoord
  }
}

function cameraToWorld(enabledElement, cameraCoord) {
  if (verify(enabledElement)) {
    const woordCoord = cameraCoord.clone().applyMatrix4(enabledElement.camera.matrixWorld)
    return woordCoord
  }
}

function worldToCamera(enabledElement, worldCoord) {
  if (verify(enabledElement)) {
    const cameraCoord = worldCoord.clone().applyMatrix4(enabledElement.camera.matrixWorldInverse)
    return cameraCoord
  }
}

function screenToCamera(enabledElement, screenCoord) {
  if (verify(enabledElement)) {
    const camera = enabledElement.camera
    const elm = enabledElement.domElement
    const ndcCoord = screenToNdc(enabledElement, screenCoord)
    const x = ndcCoord.x * (camera.right - camera.left) / camera.zoom / 2
    const y = ndcCoord.y * (camera.top - camera.bottom) / camera.zoom / 2
    const cameraCoord = new THREE.Vector3(x, y, 0)
    return cameraCoord
  }
}

export default {
  pageToScreen,
  screenToNdc,
  ndcToScreen,
  ndcToWorld,
  worldToNdc,
  cameraToWorld,
  worldToCamera,
  screenToWorld,
  worldToScreen,
  screenToCamera
}

