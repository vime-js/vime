import React, { Fragment, useState } from 'react';
import codeBuilder from './codeBuilder';
import Prism from './Prism';

const TabItem = ({ title, active = false, onClick }) => (
  <li 
    className={`tabs__item ${active ? 'tabs__item--active' : ''}`}
    onClick={onClick}
  >
    {title}
  </li>
);
 
const languageTitle = {
  html: 'HTML',
  react: 'React',
  vue: 'Vue',
  svelte: 'Svelte',
  stencil: 'Stencil',
  angular: 'Angular',
};

const languageFileType = {
  html: 'html',
  react: 'tsx',
  vue: 'html',
  svelte: 'html',
  stencil: 'tsx',
  angular: 'html'
};

let urlParams;
if (typeof URLSearchParams !== 'undefined') {
  urlParams = new URLSearchParams(window.location.search);
}

const lib = urlParams && urlParams.get('lib');

const CodePreview = (props) => {
  let [currentLanguage, setCurrentLanguage] = useState(lib || 'html');

  return (
    <Fragment>
      <ul className="tabs">
        {
          Object.keys(languageFileType)
            .map(language => (
              <TabItem
                key={language} 
                title={languageTitle[language]} 
                active={currentLanguage === language} 
                onClick={() => setCurrentLanguage(language)} />
            ))
        }
      </ul>
      
      <Prism 
        code={codeBuilder({ ...props, language: currentLanguage })}  
        language={languageFileType[currentLanguage]} 
      />
    </Fragment>
  );
};

export default CodePreview;