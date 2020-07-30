import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { DefaultControls } from '../default-controls';

let page: SpecPage;
let controls: HTMLVimeDefaultControlsElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [DefaultControls],
    '<vime-default-controls />',
  ));

  controls = page.root!.querySelector('vime-default-controls')!;
});

it('should be structurally sound when mobile video', async () => {
  controls.isMobile = true;
  controls.isVideoView = true;
  await page.waitForChanges();
  expect(controls).toMatchSnapshot();
});

it('should be structurally sound when mobile video + live stream', async () => {
  controls.isMobile = true;
  controls.isLive = true;
  controls.isVideoView = true;
  await page.waitForChanges();
  expect(controls).toMatchSnapshot();
});

it('should be structurally sound when desktop video', async () => {
  controls.isVideoView = true;
  await page.waitForChanges();
  expect(controls).toMatchSnapshot();
});

it('should be structurally sound when desktop video + live stream', async () => {
  controls.isVideoView = true;
  controls.isLive = true;
  await page.waitForChanges();
  expect(controls).toMatchSnapshot();
});

it('should be structurally sound when audio', async () => {
  controls.isAudioView = true;
  await page.waitForChanges();
  expect(controls).toMatchSnapshot();
});

it('should be structurally sound when audio + live stream', async () => {
  controls.isAudioView = true;
  controls.isLive = true;
  await page.waitForChanges();
  expect(controls).toMatchSnapshot();
});
