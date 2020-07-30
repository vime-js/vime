import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { ScrubberControl } from '../scrubber-control';

let page: SpecPage;
let control: HTMLVimeScrubberControlElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [ScrubberControl],
    '<vime-scrubber-control />',
  ));

  control = page.root!.querySelector('vime-scrubber-control')!;
});

it('should be structurally sound', () => {
  expect(control).toMatchSnapshot();
});
