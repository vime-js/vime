import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { MuteControl } from '../mute-control';

let page: SpecPage;
let control: HTMLVimeMuteControlElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [MuteControl],
    '<vime-mute-control />',
  ));

  control = page.root!.querySelector('vime-mute-control')!;
});

it('should be structurally sound', () => {
  expect(control).toMatchSnapshot();
});
