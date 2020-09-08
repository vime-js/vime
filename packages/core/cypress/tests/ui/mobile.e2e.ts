// @ts-ignore
import { skipOn } from '@cypress/skip-test';
import { en } from '../../../src/components/core/player/lang/en';

before(() => {
  cy.viewport('iphone-x');
  cy.visit('/', {
    onBeforeLoad: (win) => {
      Object.defineProperty(win.navigator, 'userAgent', { value: 'android' });
    },
  });
  cy.get('#ui').click();
  cy.get('#video').click();
  cy.player().should('be.readyForPlayback');
  cy.get('vime-controls').should('be.visible');
});

// This is a simplified test suite because most tests overlap with `video-ui.e2e.ts`.

// Skipping on headless because: https://github.com/cypress-io/cypress/issues/2102
skipOn('headless', () => {
  it('should load mobile ui', () => {
    cy.player().toMatchImageSnapshot();
  });

  it('should open mobile settings', () => {
    cy.control(en.settings).click();
    cy.control(en.settings).menu().should('be.visible');
    cy.document().toMatchImageSnapshot();
  });
});
