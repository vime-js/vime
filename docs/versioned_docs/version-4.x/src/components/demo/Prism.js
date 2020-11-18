import React from 'react';
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from 'prism-react-renderer/themes/oceanicNext';

const Prism = ({ code, language }) => (
    <Highlight {...defaultProps} theme={theme} code={code || ''} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
  </Highlight>
);

export default Prism;