
import * as THREE from 'three'

const raycaster = new THREE.Raycaster()

const defaultOptions = {
  intersectBoundingBox: true,
  intersectClipBox: true,
  intersectMpr: true,
}

export default function (enabledElement, currentPoints, opts = {}) {
  if (!enabledElement) {
    console.warn('element not enbaled')
    return false
  }
  const _opts = Object.assign({}, defaultOptions, opts)

  const label = _opts.label || ''
  const where = _opts.where || {}

  const { scene, control, camera } = enabledElement

  raycaster.setFromCamera(currentPoints.ndc, camera);

  const visibleObjects = []

  scene.traverseVisible((o) => {
    if (o.isMesh) {
      if (label) {
        // 自定义筛选label
        if (Array.isArray(o.userData.label) && o.userData.label.includes(label)) {
          visibleObjects.push(o)
        }
      } else if (_opts.where) {
        Object.keys(where).forEach(key => {
          if (o.userData[key] == where[key]) {
            visibleObjects.push(o)
          }
        })
      } else {
        visibleObjects.push(o)
      }
    }
  })

  // 判断与物体是否相交
  const intersects = raycaster.intersectObjects(visibleObjects);


  if (intersects.length > 1) {
    return intersects[0]
  }

  // 判断与剪辑框或者boundingBox是否相交
  const { widgets } = enabledElement
  let box3
  let boxIntersection
  if (widgets.getVolumeBoundingBox()) {
    box3 = widgets.getVolumeBoundingBox()
  }

  // if (widgets.getClipBox()) {
  //   box3 = widgets.getClipBox()
  // }

  if (box3) {
    if (raycaster.ray.intersectsBox(box3)) {
      // ·p1 --------> ·p3 --------> ·p2
      /*
       * p1: 视线与box第一个交点
       * p2: 视线与box第二个交点
       * p3: p1和p2的中点
      */
      const p1 = new THREE.Vector3()
      const p2 = new THREE.Vector3()
      const ray2 = raycaster.ray.clone()

      raycaster.ray.intersectBox(box3, p1)
      ray2.origin.copy(p1).add(ray2.direction.clone().multiplyScalar(5))
      const isP2Exist = ray2.intersectBox(box3, p2)

      if (isP2Exist) {
        boxIntersection = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
      } else {
        boxIntersection = p1
      }
    }
  }

  // 判断与MPR平面是否相交
  if (_opts.intersectMpr) {
    if (boxIntersection) {
      const mprPlanes = widgets.getMprPlanes()
      if (Array.isArray(mprPlanes) && mprPlanes.length > 0) {
        for (let p of mprPlanes) {
          // 视线与MPR平面交点
          const p4 = new THREE.Vector3()
          const isIntersectPlane = raycaster.ray.intersectPlane(p, p4)
          if (isIntersectPlane && box3.containsPoint(p4)) {
            return {
              point: p4,
              object: null
            }
          }
        }
      }
    }
  }


  if ((_opts.intersectBoundingBox || _opts.intersectClipBox) && boxIntersection) {
    return {
      point: boxIntersection,
      object: null
    }
  }

  return null
}