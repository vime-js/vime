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
  expect(spinner).not.toHaveClass('enabled');
});

it('should render if a video view', async () => {
  await provider.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await page.waitForChanges();
  expect(spinner).toHaveClass('enabled');
});

it('should be visible if buffering', async () => {
  await provider.dispatchStateChange(PlayerProp.Buffering, true);
  await page.waitForChanges();
  expect(spinner).toHaveClass('active');
});

it('should not be visible if not buffering', async () => {
  await provider.dispatchStateChange(PlayerProp.Buffering, false);
  await page.waitForChanges();
  expect(spinner).not.toHaveClass('active');
});
