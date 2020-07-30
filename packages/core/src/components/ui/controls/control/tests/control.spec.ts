import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { Control } from '../control';

let page: SpecPage;
let control: HTMLVimeControlElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [Control],
    '<vime-control>Control</vime-control>',
  ));

  control = page.root!.querySelector('vime-control')!;
});

it('should be structurally sound', async () => {
  expect(control).toMatchSnapshot();
});
