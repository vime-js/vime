import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { VolumeControl } from '../volume-control';

let page: SpecPage;
let control: HTMLVimeVolumeControlElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [VolumeControl],
    '<vime-volume-control />',
  ));

  control = page.root!.querySelector('vime-volume-control')!;
});

it('should be structurally sound', () => {
  expect(control).toMatchSnapshot();
});
