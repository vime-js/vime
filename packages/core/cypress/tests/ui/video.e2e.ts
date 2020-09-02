// @ts-ignore
import { skipOn } from '@cypress/skip-test';
import { en } from '../../../src/components/core/player/lang/en';

before(() => {
  cy.visit('ui.html');
  cy.get('#video').click();
  cy.player().should('be.readyForPlayback');
  cy.get('vime-controls').should('be.visible');
});

after(() => {
  cy.pause();
});

afterEach(() => {
  cy.pause();
  cy.wait(50);
});

// @TODO why wont this pass in CI??
skipOn('headless', () => {
  it('should load video ui', () => {
    cy.wait(2000);
    cy.player().toMatchImageSnapshot();
  });
});

it('should toggle playback when clicking player', () => {
  cy.player()
    .click()
    .should('be.playing')
    .click()
    .should('not.be.playing');
});

it('should show/hide controls once playback starts/stops', () => {
  cy.player().click();
  cy.get('vime-controls').then(($controls) => { $controls.prop('activeDuration', 400); });
  cy.get('vime-controls').should('not.have.class', 'active');
  cy.pause();
  cy.get('vime-controls').should('have.class', 'active');
});

it('should show controls on mousemove', () => {
  cy.get('vime-controls').then(($controls) => { $controls.prop('activeDuration', 400); });
  cy.play();
  cy.get('vime-controls').should('not.have.class', 'active');
  cy.player().trigger('mousemove');
  cy.get('vime-controls').should('have.class', 'active');
});

// @TODO bit flaky.
it.skip('should not hide controls when interacting with them', () => {
  cy.get('vime-controls').then(($controls) => { $controls.prop('activeDuration', 400); });
  cy.control(en.playback).focus().should('have.focus');
  cy.play();
  cy.player().should('be.playing').wait(500);
  cy.get('vime-controls').should('have.class', 'active');
});

it('should not hide controls when settings is open', () => {
  cy.get('vime-controls').then(($controls) => { $controls.prop('activeDuration', 400); });
  cy.control(en.settings).focus().should('have.focus');
  cy.control(en.settings).type('{enter}').trigger('click');
  cy.play();
  cy.player().should('be.playing').wait(600);
  cy.get('vime-controls').should('have.class', 'active');
});

it('should toggle playback when clicking playback control', () => {
  // Play.
  cy.control(en.playback).click();
  cy.player().should('be.playing');
  cy.control(en.playback).tooltip().should('be.visible').and('contain.text', en.pause);
  cy.control(en.playback).should('have.attr', 'aria-pressed', 'true');
  cy.control(en.playback).toMatchImageSnapshot();

  // Pause.
  cy.control(en.playback).click();
  cy.player().should('not.be.playing');
  cy.control(en.playback).tooltip().should('be.visible').and('contain.text', en.play);
  cy.control(en.playback).should('have.attr', 'aria-pressed', 'false');
  cy.control(en.playback).toMatchImageSnapshot();
});

it('should toggle mute when clicking mute control', () => {
  // Mute.
  cy.control(en.mute).click();
  cy.player().should('have.prop', 'muted', true);
  cy.control(en.mute).tooltip().should('be.visible').and('contain.text', en.unmute);
  cy.control(en.mute).should('have.attr', 'aria-pressed', 'true');
  cy.control(en.mute).toMatchImageSnapshot();

  // Unmute.
  cy.control(en.mute).click();
  cy.player().should('have.prop', 'muted', false);
  cy.control(en.mute).tooltip().should('be.visible').and('contain.text', en.mute);
  cy.control(en.mute).should('have.attr', 'aria-pressed', 'false');
  cy.control(en.mute).toMatchImageSnapshot();
});

it('should mute when sliding volume control all the way left', () => {
  cy.control(en.volume).focus();
  cy.control(en.volume).invoke('val', 0).trigger('input');
  cy.player().should('have.prop', 'volume', 0);
  cy.player().should('have.prop', 'muted', true);
  cy.control(en.mute).should('have.attr', 'aria-pressed', 'true');
  cy.control(en.mute).toMatchImageSnapshot();
  cy.control(en.volume).toMatchImageSnapshot();
});

it('should set volume high when sliding volume control to the right', () => {
  cy.control(en.volume).focus();
  cy.control(en.volume).invoke('val', 75).trigger('input');
  cy.player().should('have.prop', 'volume', 75);
  cy.player().should('have.prop', 'muted', false);
  cy.control(en.mute).toMatchImageSnapshot();
  cy.control(en.volume).toMatchImageSnapshot();
});

it('should set volume low when sliding volume control to the left', () => {
  cy.control(en.volume).focus();
  cy.control(en.volume).invoke('val', 25).trigger('input');
  cy.player().should('have.prop', 'volume', 25);
  cy.player().should('have.prop', 'muted', false);
  cy.control(en.mute).toMatchImageSnapshot();
  cy.control(en.volume).toMatchImageSnapshot();
});

it('should seek forward/backward when sliding scrubber', () => {
  // Setup.
  cy.play();
  cy.player().should('be.playing');
  cy.pause();
  cy.player().should('not.be.playing');
  cy.wait(150);

  // Forward.
  cy.control(en.scrubber).invoke('val', 30).trigger('input');
  cy.player().should(($player) => {
    expect($player.prop('currentTime')).be.greaterThan(29);
  });
  cy.control(en.scrubber).should('have.attr', 'aria-valuenow', '30');
  cy.control(en.scrubber).should('have.attr', 'aria-valuetext', '00:30 of 03:51');
  cy.control(en.scrubber).toMatchImageSnapshot();

  // Backward.
  cy.control(en.scrubber).invoke('val', 15).trigger('input');
  cy.player().should(($player) => {
    expect($player.prop('currentTime')).be.lessThan(29).and.greaterThan(14);
  });
  cy.control(en.scrubber).should('have.attr', 'aria-valuenow', '15');
  cy.control(en.scrubber).should('have.attr', 'aria-valuetext', '00:15 of 03:51');
  cy.control(en.scrubber).toMatchImageSnapshot();
});

it('should toggle captions on/off when clicking caption control', () => {
  // Setup.
  cy.play();
  cy.player().should('be.playing');
  cy.pause();
  cy.player().should('not.be.playing');
  cy.wait(150);
  cy.seekTo(15);

  // On.
  cy.get('vime-captions').should('contain.text', 'This is 327');
  cy.control(en.captions).click();
  cy.control(en.captions).tooltip().should('be.visible').and('contain.text', en.enableCaptions);
  cy.control(en.captions).should('have.attr', 'aria-pressed', 'false');
  cy.get('vime-captions').should('not.contain.text', 'This is 327');
  cy.control(en.captions).toMatchImageSnapshot();

  // Off.
  cy.control(en.captions).click();
  cy.control(en.captions).tooltip().should('be.visible').and('contain.text', en.disableCaptions);
  cy.control(en.captions).should('have.attr', 'aria-pressed', 'true');
  // This snapshot is flaky for some reason.
  // cy.control(en.captions).toMatchImageSnapshot();
  cy.play();
  cy.get('vime-captions').should('contain.text', 'Good luck, Agent');
});

// @TODO wait for Cypress to support native events.
it.skip('should toggle pip mode when clicking pip control', () => {
  // Setup.
  cy.play();
  cy.player().should('be.playing');

  // Enable.
  cy.control(en.pip).click();
  cy.control(en.pip).tooltip().should('be.visible').and('contain.text', en.exitPiP);
  cy.player().should('have.prop', 'isPiPActive', true);
  cy.control(en.pip).should('have.attr', 'aria-pressed', 'true');
  cy.control(en.pip).toMatchImageSnapshot();

  // Disable.
  cy.control(en.pip).click();
  cy.control(en.pip).tooltip().should('be.visible').and('contain.text', en.enterPiP);
  cy.player().should('have.prop', 'isPiPActive', false);
  cy.control(en.pip).should('have.attr', 'aria-pressed', 'false');
  cy.control(en.pip).toMatchImageSnapshot();
});

// @TODO wait for Cypress to support native events.
it.skip('should toggle fullscreen mode when clicking fullscreen control', () => {
  // Setup.
  cy.play();
  cy.player().should('be.playing');

  // Enable.
  cy.control(en.fullscreen).click();
  cy.control(en.fullscreen).tooltip().should('be.visible').and('contain.text', en.exitFullscreen);
  cy.player().should('have.prop', 'isFullscreenActive', true);
  cy.control(en.fullscreen).should('have.attr', 'aria-pressed', 'true');
  cy.control(en.fullscreen).toMatchImageSnapshot();

  // Disable.
  cy.control(en.fullscreen).click();
  cy.control(en.fullscreen).tooltip().should('be.visible').and('contain.text', en.enterFullscreen);
  cy.player().should('have.prop', 'isFullscreenActive', false);
  cy.control(en.fullscreen).should('have.attr', 'aria-pressed', 'false');
  cy.control(en.fullscreen).toMatchImageSnapshot();
});

it('should open/close settings menu when clicking settings control', () => {
  // Setup.
  cy.pause();
  cy.player().should('not.be.playing');

  // Open.
  cy.control(en.settings).click();
  cy.control(en.settings).tooltip().should('not.be.visible');
  cy.player().should('have.prop', 'isSettingsActive', true);
  cy.control(en.settings).should('have.attr', 'aria-expanded', 'true');
  cy.get('vime-settings').should('be.visible');
  cy.control(en.settings).toMatchImageSnapshot();
  cy.get('vime-settings').toMatchImageSnapshot();

  // Close.
  cy.control(en.settings).click();
  cy.control(en.settings).tooltip().should('be.visible').and('contain.text', en.settings);
  cy.player().should('have.prop', 'isSettingsActive', false);
  cy.control(en.settings).should('have.attr', 'aria-expanded', 'false');
  cy.get('vime-settings').should('not.be.visible');
  cy.control(en.settings).toMatchImageSnapshot();
});

it('should open/close submenu when clicking menu item', () => {
  // Setup.
  cy.pause();
  cy.player().should('not.be.playing');
  cy.control(en.settings).click();
  cy.get('vime-settings').should('be.visible');

  // Open.
  cy.control(en.playbackRate).should('be.visible');
  cy.control(en.playbackRate).menu().should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
  cy.get('vime-settings').toMatchImageSnapshot();
  cy.control(en.playbackRate).click();
  cy.control(en.playbackRate).menu().should('be.visible').and('have.attr', 'aria-hidden', 'false');
  cy.get('vime-settings').toMatchImageSnapshot();

  // Close.
  cy.control(en.playbackRate).click();
  cy.control(en.playbackRate).menu().should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
  cy.get('vime-settings').toMatchImageSnapshot();

  // Teardown.
  cy.control(en.settings).click();
  cy.get('vime-settings').should('not.be.visible');
});

it('should change playback rate when selecting from settings', () => {
  // Setup.
  cy.pause();
  cy.player().should('not.be.playing');
  cy.control(en.settings).click();
  cy.get('vime-settings').should('be.visible');
  cy.control(en.playbackRate).click();
  cy.control(en.playbackRate).menu().should('be.visible');

  // Select.
  cy.get('vime-menu-item[aria-label="1.5"]').click();
  cy.player().should('have.prop', 'playbackRate', 1.5);
  cy.get('vime-settings').toMatchImageSnapshot();

  // Teardown.
  cy.control(en.settings).click();
  cy.get('vime-settings').should('not.be.visible');
});

it('should change captions when selecting from settings', () => {
  // Setup.
  cy.pause();
  cy.player().should('not.be.playing');
  cy.control(en.settings).click();
  cy.get('vime-settings').should('be.visible');

  // Select.
  cy.control(en.subtitlesOrCc).click();
  cy.control(en.subtitlesOrCc).menu().should('be.visible');
  cy.get('vime-settings').toMatchImageSnapshot();
  cy.get('vime-menu-item[aria-label="Spanish"]').click();
  cy.player().should(($player) => {
    expect($player.prop('currentCaption')).to.exist;
    expect($player.prop('currentCaption').label).to.equal('Spanish');
    expect($player.prop('isCaptionsActive')).to.be.true;
  });
  cy.get('vime-settings').toMatchImageSnapshot();

  // Teardown.
  cy.control(en.settings).click();
  cy.get('vime-settings').should('not.be.visible');
});

it('should toggle playback when pressing "k"', () => {
  cy.player()
    .focus()
    .should('have.focus')
    .type('k')
    .should('be.playing')
    .type('k')
    .should('not.be.playing');
});

it('should toggle mute when pressing "m"', () => {
  cy.player()
    .focus()
    .should('have.focus')
    .type('m')
    .should('have.prop', 'muted', true)
    .type('m')
    .should('have.prop', 'muted', false);
});

it('should toggle captions when pressing "c"', () => {
  cy.player()
    .focus()
    .should('have.focus')
    .type('c')
    .should('have.prop', 'isCaptionsActive', false)
    .type('c')
    .should('have.prop', 'isCaptionsActive', true);
});

// @TODO wait for Cypress to support native events.
it.skip('should toggle pip mode when pressing "p"', () => {
  cy.player()
    .focus()
    .should('have.focus')
    .type('p')
    .should('have.prop', 'isPiPActive', true)
    .type('p')
    .should('have.prop', 'isPiPActive', false);
});

// @TODO wait for Cypress to support native events.
it.skip('should toggle fullscreen mode when pressing "f"', () => {
  cy.player()
    .focus()
    .should('have.focus')
    .type('f')
    .should('have.prop', 'isFullscreenActive', true)
    .type('f')
    .should('have.prop', 'isFullscreenActive', false);
});

it('should increase/decrease volume when pressing "{uparrow/downarrow}" ', () => {
  cy.player()
    .focus()
    .should('have.focus')
    .then(($player) => {
      const volume = $player.prop('volume');
      cy.player().type('{uparrow}').should('have.prop', 'volume', (volume + 5));
      cy.player().type('{downarrow}').should('have.prop', 'volume', volume);
    });
});

it('should seek forward/backward when pressing "{leftarrow/rightarrow}"', () => {
  cy.player()
    .focus()
    .should('have.focus')
    .then(($player) => {
      const currentTime = $player.prop('currentTime');

      cy.player()
        .type('{rightarrow}')
        .should(() => {
          expect($player.prop('currentTime')).to.be.closeTo((currentTime + 5), 1);
        });

      cy.player()
        .type('{leftarrow}')
        .should(() => {
          expect($player.prop('currentTime')).to.be.closeTo(currentTime, 1);
        });
    });
});

it('should tab cycle through all controls', () => {
  cy.player().focus().should('have.focus');
  const tab = (control: string) => cy.tab().control(control).should('have.focus');
  tab(en.scrubber);
  tab(en.playback);
  tab(en.mute);
  tab(en.volume);
  tab(en.captions);
  tab(en.pip);
  tab(en.settings);
  tab(en.fullscreen);
});

it('should navigate settings menu with keyboard', () => {
  cy.control(en.settings).focus().should('have.focus');

  cy.control(en.settings)
    .type('{enter}')
    .trigger('click')
    .menu()
    .should('be.visible');

  cy.control(en.playbackRate).should('have.focus');

  const pressKey = (key: string, control = en.settings) => cy.control(control).menu().type(key);
  const hasFocus = (control: string) => cy.control(control).should('have.focus');

  pressKey('{downarrow}');
  hasFocus(en.playbackQuality);
  pressKey('{downarrow}');
  hasFocus(en.subtitlesOrCc);
  pressKey('{downarrow}');
  hasFocus(en.playbackRate);
  pressKey('{uparrow}');
  hasFocus(en.subtitlesOrCc);
  pressKey('{uparrow}');
  hasFocus(en.playbackQuality);
  pressKey('{uparrow}');
  hasFocus(en.playbackRate);
  pressKey('{enter}');
  hasFocus('0.25');
  pressKey('{downarrow}');
  hasFocus('0.5');
  pressKey('{uparrow}');
  hasFocus('0.25');
  pressKey('{esc}');
  hasFocus(en.playbackRate);
  pressKey('{rightarrow}');
  hasFocus('0.25');
  pressKey('{leftarrow}');
  hasFocus(en.playbackRate);
  pressKey('{esc}');
  hasFocus(en.settings);
});
