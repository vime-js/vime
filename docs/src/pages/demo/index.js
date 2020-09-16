/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-filename-extension */

import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import Draggable from 'react-draggable';
import buildEditorPanel from './editorPanel';
import CodePreview from './CodePreview';
import DemoPlayer from './DemoPlayer';

function Demo() {
  let editorPanel = useRef(null);

  const [color, setColor] = useState('#eb7290');
  const [theme, setTheme] = useState('dark');
  const [showDefaultUi, setShowDefaultUi] = useState(true);
  const [provider, setProvider] = useState('video');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'visible'; };
  }, []);

  useEffect(() => {
    const pane = buildEditorPanel({
      container: editorPanel.current,
      onColorChange: setColor,
      onThemeChange: setTheme,
      onDefaultUiChange: setShowDefaultUi,
      onProviderChange: setProvider,
    });

    return () => pane.dispose()
  }, []);

  return (
    <Layout
      title={'Demo'}
    >
      <div className={styles.container}>
        <div className={styles.codePreview}>
          <CodePreview 
            color={color}
            theme={theme}
            provider={provider}
            showDefaultUi={showDefaultUi}
          />
        </div>
        <div className={styles.playerContainer}>
          <div className={styles.player}>
            <DemoPlayer 
              color={color}
              theme={theme}
              provider={provider}
              showDefaultUi={showDefaultUi}
            />
          </div>
          
          <Draggable>
            <div className={styles.editorPanel} ref={editorPanel} />
          </Draggable>
        </div>
      </div>
    </Layout>
  );
}

export default Demo;