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
  expect(scrim).not.toHaveClass('enabled');
});

it('should render if a video view', async () => {
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await page.waitForChanges();
  expect(scrim).toHaveClass('enabled');
});

it('should be visible if active', async () => {
  scrim.active = true;
  await page.waitForChanges();
  expect(scrim).toHaveClass('active');
});

it('should not be visible if not active', async () => {
  scrim.active = false;
  await page.waitForChanges();
  expect(scrim).not.toHaveClass('active');
});

it('should emit willShow event when visible', async () => {
  const cb = jest.fn();
  scrim.addEventListener('willShow', cb);
  scrim.active = true;
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await page.waitForChanges();
  expect(cb).toHaveBeenCalled();
});

it('should emit willHide event when not visible', async () => {
  const cb = jest.fn();
  scrim.addEventListener('willHide', cb);
  scrim.active = true;
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await page.waitForChanges();
  scrim.active = false;
  await page.waitForChanges();
  expect(cb).toHaveBeenCalled();
});
