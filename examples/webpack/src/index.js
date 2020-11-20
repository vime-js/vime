// Default theme. ~960B
import '@vime/core/themes/default.css';

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css';

// Load Vime and register custom elements
import * as vime from '@vime/core';
vime.defineCustomElements()

// Or import components individually
// import { VimePlayer, VimeVideo, VimeFile } from '@vime/core';

// customElements.define('vime-player', VimePlayer);
// customElements.define('vime-video', VimeVideo);
// customElements.define('vime-file', VimeFile);
