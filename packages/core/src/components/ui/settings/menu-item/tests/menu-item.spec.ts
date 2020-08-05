import { SpecPage } from '@stencil/core/testing';
import { MenuItem } from '../menu-item';
import { newUISpecPage } from '../../../ui/tests';

let page: SpecPage;
let menuItem: HTMLVimeMenuItemElement;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [MenuItem],
    '<vime-menu-item label="Label"></vime-menu-item>',
  ));

  menuItem = page.root!.querySelector('vime-menu-item')! as HTMLVimeMenuItemElement;
});

it('should be structurally sound if plain', () => {
  expect(menuItem).toMatchSnapshot();
});

it('should be structurally sound if navigation item', async () => {
  menuItem.menu = 'menu-1';
  menuItem.hint = 'hint';
  await page.waitForChanges();
  expect(menuItem).toMatchSnapshot();
});

it('should be structurally sound if expanded navigation item', async () => {
  menuItem.menu = 'menu-1';
  menuItem.expanded = true;
  menuItem.hint = 'hint';
  await page.waitForChanges();
  expect(menuItem).toMatchSnapshot();
});

it('should be structurally sound if checked radio button', async () => {
  menuItem.checked = true;
  await page.waitForChanges();
  expect(menuItem).toMatchSnapshot();
});

it('should be structurally sound if unchecked radio button', async () => {
  menuItem.checked = false;
  await page.waitForChanges();
  expect(menuItem).toMatchSnapshot();
});

it('should be structurally sound if item has hint', async () => {
  menuItem.hint = 'hint';
  await page.waitForChanges();
  expect(menuItem).toMatchSnapshot();
});

it('should be structurally sound if item has a badge', async () => {
  menuItem.badge = 'badge';
  await page.waitForChanges();
  expect(menuItem).toMatchSnapshot();
});
