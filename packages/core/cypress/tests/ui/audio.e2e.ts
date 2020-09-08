import { en } from '../../../src/components/core/player/lang/en';

before(() => {
  cy.visit('/');
  cy.get('#ui').click();
  cy.get('#audio').click();
  cy.player().should('be.readyForPlayback');
  cy.get('vime-controls').should('be.visible');
});

// This is a simplified test suite because most tests overlap with `video-ui.e2e.ts`.

it('should load audio ui', () => {
  cy.wait(1000);
  cy.player().toMatchImageSnapshot();
});

it('should open audio settings', () => {
  cy.control(en.settings).click();
  cy.control(en.settings).menu().should('be.visible');
  cy.document().toMatchImageSnapshot();
});
