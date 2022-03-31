import { state } from './index.js';

export default function (element) {
  return state.enabledElements.find(
    obj => obj.domElement === element
  );
}