import { SpecPage } from '@stencil/core/testing';
import { newUISpecPage } from '../../../ui/tests';
import { Settings } from '../settings';
import { SettingsController } from '../SettingsController';

let page: SpecPage;
let settings: HTMLVimeSettingsElement;
let menu: HTMLVimeMenuElement;
let controller: SettingsController;

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [Settings],
    `
    <vime-settings>
     DefaultSlot 
    </vime-settings>
    `,
  ));

  settings = page.root!.querySelector('vime-settings')!;
  menu = page.root!.querySelector('vime-settings > vime-menu')! as HTMLVimeMenuElement;

  controller = {
    menu: undefined,
    expanded: false,
    addEventListener: jest.fn(),
  } as any;

  await settings.setController('controller', controller);
});

it('should be structurally sound', () => {
  expect(page.root).toMatchSnapshot();
});

it('should set the controller', async () => {
  await page.waitForChanges();
  expect(menu.getAttribute('controller')).toEqual('controller');
  expect(controller.menu).toEqual('vime-settings-2');
});

it('should readjust position based on controls height', async () => {
  settings.controlsHeight = 100;
  await page.waitForChanges();
  expect(settings.style.bottom).toEqual('100px');
});

it('should change active state', async () => {
  settings.active = true;
  await page.waitForChanges();
  expect(page.root!.isSettingsActive).toBeTruthy();
  expect(controller.expanded).toBeTruthy();
  settings.active = false;
  await page.waitForChanges();
  expect(page.root!.isSettingsActive).toBeFalsy();
  expect(controller.expanded).toBeFalsy();
});
