import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../ui/tests';
import { Slider } from '../slider';

let page: SpecPage;
let slider: HTMLVimeSliderElement;
let input: HTMLInputElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [Slider],
    '<vime-slider />',
  ));

  slider = page.root!.querySelector('vime-slider')!;
  input = page.root!.querySelector('input')!;
});

it('should be structurally sound', () => {
  expect(slider).toMatchSnapshot();
});

it('should set the value text', async () => {
  expect(input.getAttribute('aria-valuetext')).toEqual('50%');
  slider.value = 7;
  await page.waitForChanges();
  expect(input.getAttribute('aria-valuetext')).toEqual('70%');
});

it('should fire valueChange event', async () => {
  const callback = jest.fn();
  slider.addEventListener('valueChange', callback);
  input.value = '8';
  input.dispatchEvent(new Event('input'));
  await page.waitForChanges();
  expect(callback).toHaveBeenCalled();
});

it('should fire focus event', async () => {
  const callback = jest.fn();
  slider.addEventListener('focus', callback);
  input.dispatchEvent(new Event('focus'));
  await page.waitForChanges();
  expect(callback).toHaveBeenCalled();
});

it('should fire blur event', async () => {
  const callback = jest.fn();
  slider.addEventListener('blur', callback);
  input.dispatchEvent(new Event('blur'));
  await page.waitForChanges();
  expect(callback).toHaveBeenCalled();
});
