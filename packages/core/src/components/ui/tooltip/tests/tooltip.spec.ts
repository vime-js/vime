import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../ui/tests';
import { Tooltip } from '../tooltip';

let page: SpecPage;
let tooltip: HTMLVimeTooltipElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [Tooltip],
    '<vime-tooltip>Play</vime-tooltip>',
  ));

  tooltip = page.root!.querySelector('vime-tooltip')!;
});

it('should be structurally sound', () => {
  expect(tooltip).toMatchSnapshot();
});

it('should not render if hidden', async () => {
  tooltip.hidden = true;
  await page.waitForChanges();
  expect(tooltip).toHaveClass('hidden');
});

it('should toggle aria hidden property', async () => {
  expect(tooltip).toEqualAttribute('aria-hidden', 'true');
  tooltip.active = true;
  await page.waitForChanges();
  expect(tooltip).toEqualAttribute('aria-hidden', 'false');
  tooltip.isTouch = true;
  await page.waitForChanges();
  expect(tooltip).toEqualAttribute('aria-hidden', 'true');
});

it('should set positional classes', async () => {
  tooltip.position = 'top';
  await page.waitForChanges();
  expect(tooltip).toHaveClass('onTop');
  expect(tooltip).not.toHaveClass('onBottom');
  tooltip.position = 'bottom';
  await page.waitForChanges();
  expect(tooltip).not.toHaveClass('onTop');
  expect(tooltip).toHaveClass('onBottom');
});

it('should set directional classes', async () => {
  tooltip.direction = 'left';
  await page.waitForChanges();
  expect(tooltip).toHaveClass('growLeft');
  expect(tooltip).not.toHaveClass('growRight');
  tooltip.direction = 'right';
  await page.waitForChanges();
  expect(tooltip).not.toHaveClass('growLeft');
  expect(tooltip).toHaveClass('growRight');
  tooltip.direction = undefined;
  await page.waitForChanges();
  expect(tooltip).not.toHaveClass('growLeft');
  expect(tooltip).not.toHaveClass('growRight');
});
