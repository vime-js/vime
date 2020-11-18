// Default theme. ~960B
import '@vime/core/themes/default.css';

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css';

import {
  VmPlayer, VmVideo, VmFile, defineCustomElements,
} from '@vime/core';

// 1. Define the elements individually to save on the final bundle size.
customElements.define('vm-player', VmPlayer);
customElements.define('vm-video', VmVideo);
customElements.define('vm-file', VmFile);

// 2. Use the following the define all the elements in the Vime library, be aware this may bloat
// your final project size.
defineCustomElements();
