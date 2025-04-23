import React from 'react';
import HomePage from '../pages/HomePage';
import ProjectEntryPage from '../pages/ProjectEntryPage';

export default function PageContent({ activePage }) {
  switch (activePage) {
    case 'home':
      return React.createElement(HomePage);
    case 'projectEntry':
      return React.createElement(ProjectEntryPage);
    // case 'postEntry':
    // case 'userEntry':
    // etc.
    default:
      return React.createElement('div', null, 'Page not found.');
  }
}
