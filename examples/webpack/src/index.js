// Default theme. ~960B
import '@vime/core/themes/default.css';

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css';

import { VimePlayer, VimeVideo, VimeFile } from '@vime/core';

customElements.define('vime-player', VimePlayer);
customElements.define('vime-video', VimeVideo);
customElements.define('vime-file', VimeFile);
