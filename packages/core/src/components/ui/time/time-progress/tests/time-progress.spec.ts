import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { TimeProgress } from '../time-progress';

let page: SpecPage;
let time: HTMLVimeTimeProgressElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [TimeProgress],
    '<vime-time-progress />',
  ));

  time = page.root!.querySelector('vime-time-progress')!;
});

it('should be structurally sound', async () => {
  expect(time).toMatchSnapshot();
});
