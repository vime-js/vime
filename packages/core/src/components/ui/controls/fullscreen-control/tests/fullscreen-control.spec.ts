import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { FullscreenControl } from '../fullscreen-control';

let page: SpecPage;
let control: HTMLVimeFullscreenControlElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [FullscreenControl],
    '<vime-fullscreen-control />',
  ));

  control = page.root!.querySelector('vime-fullscreen-control')!;
});

it('should be structurally sound when not active', () => {
  expect(control).toMatchSnapshot();
});

it('should be structurally sound when active', async () => {
  control.isFullscreenActive = true;
  await page.waitForChanges();
  expect(control).toMatchSnapshot();
});
