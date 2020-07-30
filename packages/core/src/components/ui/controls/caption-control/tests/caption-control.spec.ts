import { SpecPage } from '@stencil/core/testing';
import { CaptionControl } from '../caption-control';
import { newUISpecPage } from '../../../ui/tests';

let page: SpecPage;
let control: HTMLVimeCaptionControlElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [CaptionControl],
    '<vime-caption-control />',
  ));

  control = page.root!.querySelector('vime-caption-control')!;
});

it('should be structurally sound when not active', () => {
  expect(control).toMatchSnapshot();
});

it('should be structurally sound when active', async () => {
  control.isCaptionsActive = true;
  await page.waitForChanges();
  expect(control).toMatchSnapshot();
});

it('should be hidden if there is no current caption', () => {
  expect(control.querySelector('vime-control')).toEqual({});
});

it('should not be hidden if there is a current caption', async () => {
  // @ts-ignore
  control.currentCaption = {};
  await page.waitForChanges();
  expect(control.querySelector('vime-control')?.nodeName).toEqual('VIME-CONTROL');
});
