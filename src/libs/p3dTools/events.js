/**
 *  Enumerates the events for CornestoneTools. Native events are captured,
 *  normalized, and re-triggered with a `p3dtools` prefix. This allows
 *  us to handle events consistently across different browsers.
 *
 *  @enum {String}
 *  @memberof p3dTools
 *  @readonly
 */
const EVENTS = {
  //
  // MOUSE
  //

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/mousedown
   *  @type {String}
   */
  MOUSE_DOWN: 'p3dtoolsmousedown',

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/mouseup
   *  @type {String}
   */
  MOUSE_UP: 'p3dtoolsmouseup',

  /**
   * Is fired if a handled `MOUSE_DOWN` event does not `stopPropagation`. The hook
   * we use to create new measurement data for mouse events.
   *  @type {String}
   */
  MOUSE_DOWN_ACTIVATE: 'p3dtoolsmousedownactivate',

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/drag
   *  @type {String}
   */
  MOUSE_DRAG: 'p3dtoolsmousedrag',

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/mousemove
   *  @type {String}
   */
  MOUSE_MOVE: 'p3dtoolsmousemove',

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/click
   *  @type {String}
   */
  MOUSE_CLICK: 'p3dtoolsmouseclick',

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/dblclick
   *  @type {String}
   */
  MOUSE_DOUBLE_CLICK: 'p3dtoolsmousedoubleclick',

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/wheel
   *  @type {String}
   */
  MOUSE_WHEEL: 'p3dtoolsmousewheel',

  //
  // TOUCH
  //

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/touchstart
   *  @type {String}
   */
  TOUCH_START: 'p3dtoolstouchstart',

  /**
   * Is fired if a handled `TOUCH_START` event does not `stopPropagation`. The hook
   * we use to create new measurement data for touch events.
   *  @type {String}
   */
  TOUCH_START_ACTIVE: 'p3dtoolstouchstartactive',

  /**
   *  @type {String}
   */
  TOUCH_END: 'p3dtoolstouchend',

  /**
   *  @type {String}
   */
  TOUCH_DRAG: 'p3dtoolstouchdrag',

  /**
   *  @type {String}
   */
  TOUCH_DRAG_END: 'p3dtoolstouchdragend',

  /**
   * http://hammerjs.github.io/recognizer-pinch/
   *  @type {String}
   */
  TOUCH_PINCH: 'p3dtoolstouchpinch',

  /**
   * http://hammerjs.github.io/recognizer-rotate/
   *  @type {String}
   */
  TOUCH_ROTATE: 'p3dtoolstouchrotate',

  /**
   * http://hammerjs.github.io/recognizer-press/
   *  @type {String}
   */
  TOUCH_PRESS: 'p3dtoolstouchpress',

  /**
   * http://hammerjs.github.io/recognizer-tap/
   *  @type {String}
   */
  TAP: 'p3dtoolstap',

  /**
   *  @type {String}
   */
  DOUBLE_TAP: 'p3dtoolsdoubletap',

  /**
   *  @type {String}
   */
  MULTI_TOUCH_START: 'p3dtoolsmultitouchstart',

  /**
   *  @type {String}
   */
  MULTI_TOUCH_START_ACTIVE: 'p3dtoolsmultitouchstartactive',

  /**
   *  @type {String}
   */
  MULTI_TOUCH_DRAG: 'p3dtoolsmultitouchdrag',

  //
  // KEYBOARD
  //

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/keydown
   *  @type {String}
   */
  KEY_DOWN: 'p3dtoolskeydown',

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/keyup
   *  @type {String}
   */
  KEY_UP: 'p3dtoolskeyup',

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Events/keypress
   *  @type {String}
   */
  KEY_PRESS: 'p3dtoolskeypress',

  //
  // CUSTOM
  //

  /**
   *  @type {String}
   */
  MEASUREMENT_ADDED: 'p3dtoolsmeasurementadded',

  /**
   *  @type {String}
   */
  MEASUREMENT_MODIFIED: 'p3dtoolsmeasurementmodified',

  /**
   *  @type {String}
   */
  MEASUREMENT_MODIFY_COMPLETED: 'p3dtoolsmeasurementmodifycompleted',

  /**
   *  @type {String}
   */
  MEASUREMENT_COMPLETED: 'p3dtoolsmeasurementcompleted',

  /**
   *  @type {String}
   */
  MEASUREMENT_REMOVED: 'p3dtoolsmeasurementremoved',

  /**
   *  @type {String}
   */
  MEASUREMENT_HANDLE_ACTIVE_CHANGED: 'p3dtoolsmeasurementhandleactivechanged',

  /**
   *  @type {String}
   */
  MEASUREMENT_ACTIVE_CHANGED: 'p3dtoolsmeasurementactivechanged',
  MEASUREMENT_SELECTED: 'p3dtoolsmeasurementselected',
  MEASUREMENT_UNSELECTED: 'p3dtoolsmeasurementunselected',
  /**
   *  @type {String}
   */
  TOOL_DEACTIVATED: 'p3dtoolstooldeactivated',

  /**
   *  @type {String}
   */
  CLIP_STOPPED: 'p3dtoolsclipstopped',

  /**
   *  @type {String}
   */
  STACK_SCROLL: 'p3dtoolsstackscroll',

  /**
   *  @type {String}
   */
  STACK_PREFETCH_IMAGE_LOADED: 'p3dtoolsstackprefetchimageloaded',

  /**
   *  @type {String}
   */
  STACK_PREFETCH_DONE: 'p3dtoolsstackprefetchdone',

  /**
   *  @type {String}
   */
  LABELMAP_MODIFIED: 'p3dtoolslabelmapmodified',
  /**
  *  @type {String}
  */
  UPDATE_IMAGE: 'p3dtoolsupdateimage',
};

export default EVENTS;
