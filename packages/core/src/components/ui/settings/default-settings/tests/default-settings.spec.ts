import { SpecPage } from '@stencil/core/testing';
import { DefaultSettings } from '../default-settings';
import { newUISpecPage } from '../../../ui/tests';
import { Settings } from '../../settings/settings';
import { MenuRadioGroup } from '../../menu-radio-group/menu-radio-group';
import { MenuRadio } from '../../menu-radio/menu-radio';
import { MenuItem } from '../../menu-item/menu-item';
import { Menu } from '../../menu/menu';
import { Submenu } from '../../submenu/submenu';
import { MockMediaProviderAdapter } from '../../../../providers/MediaProvider';

let page: SpecPage;
let player: HTMLVimePlayerElement;
let provider: HTMLVimeFaketubeElement;
let defaultSettings: HTMLVimeDefaultSettingsElement;

const getSettingsMenu = () => page.root!.querySelector('vime-settings');

const getController = (label: string) => page.root!
  .querySelector(`vime-menu-item[aria-label="${label}"]`)! as HTMLVimeMenuItemElement;

const getPlaybackRateSubmenuController = () => getController('Playback Rate');
const getPlaybackQualitySubmenuController = () => getController('Playback Quality');

beforeEach(async () => {
  ({ page } = await newUISpecPage(
    [
      DefaultSettings, Settings, Menu,
      Submenu, MenuRadioGroup, MenuRadio,
      MenuItem,
    ],
    '<vime-default-settings>DefaultSlot</vime-default-settings>',
  ));

  player = page.root! as HTMLVimePlayerElement;
  provider = page.root!.querySelector('vime-faketube')!;
  defaultSettings = page.root!.querySelector('vime-default-settings')!;

  // Trigger another render cycle for the submenus to be built.
  defaultSettings.playbackRates = [1];
  await page.waitForChanges();
});

it('should be structurally sound', () => {
  expect(page.root).toMatchSnapshot();
});

test('playback rate submenu should be structurally sound', async () => {
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetPlaybackRate!.mockReturnValue(Promise.resolve(true));
  provider.dispatchChange('playbackRates', [1, 2, 3]);
  await page.waitForChanges();
  getPlaybackRateSubmenuController().click();
  await page.waitForChanges();
  expect(getSettingsMenu()).toMatchSnapshot();
});

it('should change playback rate on radio selection', async () => {
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetPlaybackRate!.mockReturnValue(Promise.resolve(true));
  provider.dispatchChange('playbackRates', [1, 2, 3]);
  await page.waitForChanges();
  getPlaybackRateSubmenuController().click();
  await page.waitForChanges();
  const radio = page.root!.querySelector('vime-menu-item[aria-label="2"]')! as HTMLVimeMenuItemElement;
  radio.click();
  await page.waitForChanges();
  expect(player.playbackRate).toEqual(2);
});

it('should update selected radio on playback rate change', async () => {
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetPlaybackRate!.mockReturnValue(Promise.resolve(true));
  provider.dispatchChange('playbackRates', [1, 2, 3]);
  await page.waitForChanges();
  getPlaybackRateSubmenuController().click();
  await page.waitForChanges();
  player.playbackRate = 3;
  await page.waitForChanges();
  const radio = page.root!.querySelector('vime-menu-item[aria-label="3"]')! as HTMLVimeMenuItemElement;
  expect(radio.checked).toBeTruthy();
});

test('playback quality submenu should be structurally sound', async () => {
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetPlaybackQuality!.mockReturnValue(Promise.resolve(true));
  provider.dispatchChange('playbackQuality', '720p');
  provider.dispatchChange('playbackQualities', ['1080p', '720p', '480p']);
  await page.waitForChanges();
  getPlaybackQualitySubmenuController().click();
  await page.waitForChanges();
  expect(getSettingsMenu()).toMatchSnapshot();
});

it('should change playback quality on radio selection', async () => {
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetPlaybackQuality!.mockReturnValue(Promise.resolve(true));
  provider.dispatchChange('playbackQuality', '720p');
  provider.dispatchChange('playbackQualities', ['1080p', '720p', '480p']);
  await page.waitForChanges();
  getPlaybackQualitySubmenuController().click();
  await page.waitForChanges();
  const radio = page.root!.querySelector('vime-menu-item[aria-label="1080p"]')! as HTMLVimeMenuItemElement;
  radio.click();
  await page.waitForChanges();
  expect(player.playbackQuality).toEqual('1080p');
});

it('should update selected radio on playback quality change', async () => {
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetPlaybackQuality!.mockReturnValue(Promise.resolve(true));
  provider.dispatchChange('playbackQuality', '720p');
  provider.dispatchChange('playbackQualities', ['1080p', '720p', '480p']);
  await page.waitForChanges();
  getPlaybackQualitySubmenuController().click();
  await page.waitForChanges();
  player.playbackQuality = '480p';
  await page.waitForChanges();
  const radio = page.root!.querySelector('vime-menu-item[aria-label="480p"]')! as HTMLVimeMenuItemElement;
  expect(radio.checked).toBeTruthy();
});
