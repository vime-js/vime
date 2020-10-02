import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../ui/tests';
import { ViewType } from '../../../core/player/ViewType';
import { Captions } from '../captions';

let page: SpecPage;
let provider: HTMLVimeFaketubeElement;
let captions: HTMLVimeCaptionsElement;

beforeEach(async () => {
  ({ page, provider } = await newUISpecPage(
    [Captions],
    '<vime-captions/>',
  ));

  captions = page.root!.querySelector('vime-captions')!;
});

it('should be structurally sound', () => {
  expect(captions).toMatchSnapshot();
});

it('should not render if not a video view', async () => {
  await provider.dispatchChange('playbackStarted', true);
  await provider.dispatchChange('viewType', ViewType.Audio);
  await page.waitForChanges();
  expect(captions).not.toHaveClass('enabled');
});

it('should render if a video view and playback has started', async () => {
  await provider.dispatchChange('playbackStarted', true);
  await provider.dispatchChange('viewType', ViewType.Video);
  await page.waitForChanges();
  expect(captions).toHaveClass('enabled');
});

it('should not be visible if hidden', async () => {
  captions.hidden = true;
  await page.waitForChanges();
  expect(captions).toHaveClass('hidden');
});

it('should adjust position based on controls height', async () => {
  await provider.dispatchChange('isControlsActive', true);
  captions.controlsHeight = 140;
  await page.waitForChanges();
  expect(captions.style.transform).toEqual('translateY(-140px)');
  await provider.dispatchChange('isControlsActive', false);
  await page.waitForChanges();
  expect(captions.style.transform).toEqual('translateY(-24px)');
});
