import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../ui/tests';
import { PlayerProp } from '../../../core/player/PlayerProp';
import { ViewType } from '../../../core/player/ViewType';
import { Scrim } from '../scrim';

let page: SpecPage;
let provider: HTMLVimeFaketubeElement;
let scrim: HTMLVimeScrimElement;

beforeEach(async () => {
  ({ page, provider } = await newUISpecPage(
    [Scrim],
    '<vime-scrim />',
  ));

  scrim = page.root!.querySelector('vime-scrim')!;
});

it('should be structurally sound', () => {
  expect(scrim).toMatchSnapshot();
});

it('should not render if not a video view', async () => {
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Audio);
  await page.waitForChanges();
  expect(scrim).toHaveClass('hidden');
});

it('should render if a video view', async () => {
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await page.waitForChanges();
  expect(scrim).not.toHaveClass('hidden');
});

it('should be visible if controls are active', async () => {
  scrim.isControlsActive = true;
  await page.waitForChanges();
  expect(scrim).toHaveClass('active');
});

it('should not be visible if controls are not active', async () => {
  scrim.isControlsActive = false;
  await page.waitForChanges();
  expect(scrim).not.toHaveClass('active');
});

it('should set gradient', async () => {
  scrim.gradient = 'up';
  await page.waitForChanges();
  expect(scrim).toHaveClass('gradient');
  expect(scrim).toHaveClass('gradientUp');
});
