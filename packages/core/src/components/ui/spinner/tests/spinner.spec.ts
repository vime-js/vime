import { SpecPage } from '@stencil/core/testing';
import { Spinner } from '../spinner';
import { newUISpecPage } from '../../ui/tests';
import { PlayerProp } from '../../../core/player/PlayerProp';
import { ViewType } from '../../../core/player/ViewType';

let page: SpecPage;
let provider: HTMLVimeFaketubeElement;
let spinner: HTMLVimeSpinnerElement;

beforeEach(async () => {
  ({ page, provider } = await newUISpecPage(
    [Spinner],
    '<vime-spinner />',
  ));

  spinner = page.root!.querySelector('vime-spinner')!;
});

it('should be structurally sound', () => {
  expect(spinner).toMatchSnapshot();
});

it('should not render if not a video view', async () => {
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Audio);
  await page.waitForChanges();
  await page.waitForChanges();
  expect(spinner).toHaveClass('hidden');
});

it('should render if a video view', async () => {
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await page.waitForChanges();
  await page.waitForChanges();
  expect(spinner).not.toHaveClass('hidden');
});

it('should be visible if buffering', async () => {
  await provider.dispatchStateChange(PlayerProp.Buffering, true);
  await page.waitForChanges();
  await page.waitForChanges();
  expect(spinner).toHaveClass('active');
});

it('should not be visible if not buffering', async () => {
  await provider.dispatchStateChange(PlayerProp.Buffering, false);
  await page.waitForChanges();
  await page.waitForChanges();
  expect(spinner).not.toHaveClass('active');
});

it('should emit vWillShow event when visible', async () => {
  const cb = jest.fn();
  spinner.addEventListener('vWillShow', cb);
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await provider.dispatchStateChange(PlayerProp.Buffering, true);
  await page.waitForChanges();
  await page.waitForChanges();
  expect(cb).toHaveBeenCalled();
});

it('should emit vWillHide event when not visible', async () => {
  const cb = jest.fn();
  spinner.addEventListener('vWillHide', cb);
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await provider.dispatchStateChange(PlayerProp.Buffering, true);
  await page.waitForChanges();
  await page.waitForChanges();
  await provider.dispatchStateChange(PlayerProp.Buffering, false);
  await page.waitForChanges();
  await page.waitForChanges();
  expect(cb).toHaveBeenCalled();
});
