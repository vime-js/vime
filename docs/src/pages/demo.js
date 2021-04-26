/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-filename-extension */

import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import styles from './demo.module.css';
import Draggable from 'react-draggable';
import buildEditorPanel from '../components/demo/editorPanel';
import CodePreview from '../components/demo/CodePreview';
import DemoPlayer from '../components/demo/LoadableDemoPlayer';

function Demo() {
  let editorPanel = useRef(null);

  const [color, setColor] = useState('#e86c8b');
  const [theme, setTheme] = useState('dark');
  const [showDefaultUi, setShowDefaultUi] = useState(true);
  const [provider, setProvider] = useState('video');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  useEffect(() => {
    const pane = buildEditorPanel({
      container: editorPanel.current,
      onColorChange: setColor,
      onThemeChange: setTheme,
      onDefaultUiChange: setShowDefaultUi,
      onProviderChange: setProvider,
    });

    const inputs = editorPanel.current.querySelectorAll(
      'input,canvas,button,select',
    );
    inputs.forEach(input => {
      input.classList.add('editor-input');
    });

    return () => pane.dispose();
  }, []);

  return (
    <Layout title={'Demo'}>
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

          <Draggable enableUserSelectHack={false} cancel=".editor-input">
            <div className={styles.editorPanel} ref={editorPanel} />
          </Draggable>
        </div>
      </div>
    </Layout>
  );
}

export default Demo;
