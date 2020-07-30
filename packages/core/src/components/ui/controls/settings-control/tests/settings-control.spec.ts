import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { SettingsControl } from '../settings-control';

let page: SpecPage;
let control: HTMLVimeSettingsControlElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [SettingsControl],
    '<vime-settings-control />',
  ));

  control = page.root!.querySelector('vime-settings-control')!;
});

it('should be structurally sound', () => {
  expect(control).toMatchSnapshot();
});
