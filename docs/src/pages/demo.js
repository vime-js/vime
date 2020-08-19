/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function Demo() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={`Demo ${siteConfig.title}`}
    >
      Coming Soon.
    </Layout>
  );
}

export default Demo;
