import { state } from './../store/index.js';

const enable = function () {
  disable(); // Clean up any lingering listeners
  window.addEventListener('resize', resizeThrottler, false);
};

const disable = function () {
  window.removeEventListener('resize', resizeThrottler, false);
};

let resizeTimeout;

function resizeThrottler() {
  // Ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(function () {
      resizeTimeout = null;
      forceEnabledElementResize();

      // The actualResizeHandler will execute at a rate of 15fps
    }, 66);
  }
}

export const forceEnabledElementResize = function () {
  state.enabledElements.forEach(element => {
    console.log('resize')
  });
};

export default {
  enable,
  disable,
};
