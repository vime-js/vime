import { SpecPage } from '@stencil/core/testing';
import { Controls } from '../controls';
import { newUISpecPage } from '../../../ui/tests';
import { ViewType } from '../../../../core/player/ViewType';

let page: SpecPage;
let provider: HTMLVimeFaketubeElement;
let controls: HTMLVimeControlsElement;

jest.useFakeTimers();

beforeEach(async () => {
  ({ page, provider } = await newUISpecPage(
    [Controls],
    '<vime-controls />',
  ));

  controls = page.root!.querySelector('vime-controls')!;
});

it('should be structurally sound', () => {
  expect(controls).toMatchSnapshot();
});

it('should hide controls', async () => {
  expect(controls).not.toHaveClass('hidden');
  controls.hidden = true;
  await page.waitForChanges();
  expect(controls).toHaveClass('hidden');
});

it('should become active', async () => {
  expect(controls).not.toHaveClass('active');
  await provider.dispatchChange('viewType', ViewType.Video);
  await provider.dispatchChange('playbackReady', true);
  await provider.dispatchChange('isControlsActive', true);
  await page.waitForChanges();
  expect(controls).toHaveClass('active');
});

it('should only be active when audio view', async () => {
  expect(controls).not.toHaveClass('active');
  await provider.dispatchChange('viewType', ViewType.Audio);
  await provider.dispatchChange('playbackReady', true);
  await page.waitForChanges();
  expect(controls).toHaveClass('active');
  await provider.dispatchChange('paused', false);
  await page.waitForChanges();
  jest.runAllTimers();
  expect(controls).toHaveClass('active');
});

it('should apply full width', async () => {
  expect(controls).not.toHaveClass('fullWidth');
  controls.fullWidth = true;
  await page.waitForChanges();
  expect(controls).toHaveClass('fullWidth');
});

it('should apply full height', async () => {
  expect(controls).not.toHaveClass('fullHeight');
  controls.fullHeight = true;
  await page.waitForChanges();
  expect(controls).toHaveClass('fullHeight');
});

it('should apply direction', async () => {
  expect(controls.style.flexDirection).toEqual('row');
  controls.direction = 'column';
  await page.waitForChanges();
  expect(controls.style.flexDirection).toEqual('column');
});

it('should align controls', async () => {
  expect(controls.style.alignItems).toEqual('center');
  controls.align = 'start';
  await page.waitForChanges();
  expect(controls.style.alignItems).toEqual('flex-start');
  controls.align = 'end';
  await page.waitForChanges();
  expect(controls.style.alignItems).toEqual('flex-end');
});

it('should justify controls', async () => {
  expect(controls.style.justifyContent).toEqual('start');
  controls.justify = 'space-between';
  await page.waitForChanges();
  expect(controls.style.justifyContent).toEqual('space-between');
});

it('should not pin controls if audio', async () => {
  await provider.dispatchChange('viewType', ViewType.Audio);
  controls.pin = 'topLeft';
  await page.waitForChanges();
  expect(controls.style.top).toEqual('');
  expect(controls.style.left).toEqual('');
});

it('should pin controls to the center', async () => {
  await provider.dispatchChange('viewType', ViewType.Video);
  controls.pin = 'center';
  await page.waitForChanges();
  expect(controls.style.top).toEqual('50%');
  expect(controls.style.left).toEqual('50%');
});

it('should pin controls', async () => {
  await provider.dispatchChange('viewType', ViewType.Video);
  controls.pin = 'topLeft';
  await page.waitForChanges();
  expect(controls.style.top).toEqual('0');
  expect(controls.style.left).toEqual('0');
  controls.pin = 'bottomRight';
  await page.waitForChanges();
  expect(controls.style.top).toEqual('');
  expect(controls.style.left).toEqual('');
  expect(controls.style.bottom).toEqual('0');
  expect(controls.style.right).toEqual('0');
});

it('should change active duration', async () => {
  controls.activeDuration = 3500;
  await provider.dispatchChange('playbackReady', true);
  await provider.dispatchChange('viewType', ViewType.Video);
  await provider.dispatchChange('isControlsActive', true);
  await provider.dispatchChange('paused', false);
  await page.waitForChanges();
  expect(controls.isControlsActive).toBeTruthy();
  requestAnimationFrame(async () => {
    jest.advanceTimersByTime(3000);
    await page.waitForChanges();
    expect(controls.isControlsActive).toBeTruthy();
    jest.advanceTimersByTime(500);
    await page.waitForChanges();
    expect(controls.isControlsActive).toBeFalsy();
  });
});

it('should wait for playback to start before showing controls', async () => {
  controls.waitForPlaybackStart = true;
  await provider.dispatchChange('playbackReady', true);
  await provider.dispatchChange('viewType', ViewType.Video);
  await provider.dispatchChange('paused', false);
  await page.waitForChanges();
  expect(controls.isControlsActive).toBeFalsy();
  await provider.dispatchChange('playbackStarted', true);
  await page.waitForChanges();
  expect(controls.isControlsActive).toBeTruthy();
});

it('should hide controls when paused', async () => {
  controls.hideWhenPaused = true;
  await provider.dispatchChange('playbackReady', true);
  await provider.dispatchChange('viewType', ViewType.Video);
  await provider.dispatchChange('paused', false);
  await page.waitForChanges();
  expect(controls.isControlsActive).toBeTruthy();
  await provider.dispatchChange('paused', true);
  await page.waitForChanges();
  requestAnimationFrame(async () => {
    expect(controls.isControlsActive).toBeTruthy();
    jest.runAllTimers();
    await page.waitForChanges();
    expect(controls.isControlsActive).toBeFalsy();
  });
});

it('should hide controls on mouse leave', async () => {
  controls.hideOnMouseLeave = true;
  await provider.dispatchChange('playbackReady', true);
  await provider.dispatchChange('viewType', ViewType.Video);
  await page.waitForChanges();
  expect(controls.isControlsActive).toBeTruthy();
  await provider.dispatchChange('paused', false);
  await page.waitForChanges();
  await controls.dispatchEvent(new Event('mouseleave', { bubbles: true }));
  await page.waitForChanges();
  expect(controls.isControlsActive).toBeFalsy();
});
