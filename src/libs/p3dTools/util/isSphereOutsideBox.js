import * as THREE from 'three'

export default function (sphere, box3) {
  let isSphereOutsideBox = false

  const xMax = new THREE.Vector3(sphere.radius, 0, 0).add(sphere.center)
  const xMin = new THREE.Vector3(-sphere.radius, 0, 0).add(sphere.center)
  const yMax = new THREE.Vector3(0, sphere.radius, 0).add(sphere.center)
  const yMin = new THREE.Vector3(0, -sphere.radius, 0).add(sphere.center)
  const zMax = new THREE.Vector3(0, 0, sphere.radius).add(sphere.center)
  const zMin = new THREE.Vector3(0, 0, -sphere.radius).add(sphere.center)
  const points = [xMax, xMin, yMax, yMin, zMax, zMin]
  for (let p of points) {
    if (!box3.containsPoint(p)) {
      isSphereOutsideBox = true
      break
    }
  }

  return isSphereOutsideBox
}