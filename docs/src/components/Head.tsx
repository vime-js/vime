import React from 'react';
import ReactDOM from 'react-dom';

const headRoot = document.head;

export const Head = () => (
  ReactDOM.createPortal(this.props.children, headRoot);
);