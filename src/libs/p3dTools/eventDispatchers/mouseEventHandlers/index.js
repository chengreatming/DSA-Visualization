import customCallbackHandler from './../shared/customCallbackHandler.js';
import mouseDown from './mouseDown.js';
import mouseDownActivate from './mouseDownActivate.js';
import mouseDrag from './mouseDrag.js';
import mouseMove from './mouseMove.js';
import measurementAdded from './../shared/measurementAdded.js'
import measurementModified from './../shared/measurementModified.js'
import measurementModifyCompleted from './../shared/measurementModifyCompleted.js'
import measurementRemoved from './../shared/measurementRemoved.js'
import measurementCompleted from './../shared/measurementCompleted.js'
import measurementHandleActiveChanged from './../shared/measurementHandleActiveChanged.js'
import measurementActiveChanged from './../shared/measurementActiveChanged.js'
import measurementSelected from './../shared/measurementSelected.js'
import measurementUnselected from './../shared/measurementUnselected.js'

const mouseClick = customCallbackHandler.bind(
  null,
  'Mouse',
  'mouseClickCallback'
);

const mouseDoubleClick = customCallbackHandler.bind(
  null,
  'Mouse',
  'doubleClickCallback'
);

const mouseUp = customCallbackHandler.bind(null, 'Mouse', 'mouseUpCallback');

const mouseWheel = customCallbackHandler.bind(
  null,
  'MouseWheel',
  'mouseWheelCallback'
);

export {
  mouseClick,
  mouseDown,
  mouseDownActivate,
  mouseDoubleClick,
  mouseDrag,
  mouseMove,
  mouseUp,
  mouseWheel,
  measurementAdded,
  measurementModified,
  measurementModifyCompleted,
  measurementRemoved,
  measurementCompleted,
  measurementHandleActiveChanged,
  measurementActiveChanged,
  measurementSelected,
  measurementUnselected
};
