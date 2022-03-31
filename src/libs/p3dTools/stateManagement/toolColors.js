import * as THREE from 'three'
let defaultColor = new THREE.Color('#FF8C00'), //'darkorange',
  activeColor = new THREE.Color('#ADFF2F'), //'greenyellow',
  fillColor = 'transparent',
  warningColor = new THREE.Color('#FF0000'),
  tipsColor = new THREE.Color('#FF8C00'),
  deactiveColor = new THREE.Color('#FF0000'); // red
function setFillColor(color) {
  fillColor = color;
}

function getFillColor() {
  return fillColor;
}

function setToolColor(color) {
  defaultColor = color;
}

function getToolColor() {
  return defaultColor;
}

function setActiveColor(color) {
  activeColor = color;
}

function getActiveColor() {
  return activeColor;
}

function setTipsColor(color) {
  tipsColor = color;
}

function getTipsColor() {
  return tipsColor;
}

function setWarningColor(color) {
  warningColor = color;
}

function getWarningColor() {
  return warningColor;
}

function getColorIfActive(data) {
  if (data.color) {
    return data.color;
  }

  return data.active ? activeColor : defaultColor;
}

function getDeactiveColor() {
  return deactiveColor
}

const toolColors = {
  setFillColor,
  getFillColor,
  setToolColor,
  getToolColor,
  setActiveColor,
  getActiveColor,
  setTipsColor,
  getTipsColor,
  setWarningColor,
  getWarningColor,
  getColorIfActive,
  getDeactiveColor,
};

export default toolColors;
