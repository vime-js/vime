import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { CurrentTime } from '../current-time';

let page: SpecPage;
let time: HTMLVimeCurrentTimeElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [CurrentTime],
    '<vime-current-time />',
  ));

  time = page.root!.querySelector('vime-current-time')!;
});

it('should be structurally sound', async () => {
  time.currentTime = 120;
  await page.waitForChanges();
  expect(time).toMatchSnapshot();
});
