import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { EndTime } from '../end-time';

let page: SpecPage;
let time: HTMLVimeEndTimeElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [EndTime],
    '<vime-end-time />',
  ));

  time = page.root!.querySelector('vime-end-time')!;
});

it('should be structurally sound', async () => {
  time.duration = 120;
  await page.waitForChanges();
  expect(time).toMatchSnapshot();
});
