import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { MenuRadioGroup } from '../menu-radio-group';
import { MenuRadio } from '../../menu-radio/menu-radio';

let page: SpecPage;

beforeEach(async () => {
  page = await newSpecPage({
    components: [MenuRadioGroup, MenuRadio],
    html: `
      <vime-menu-radio-group value="1">
        <vime-menu-radio label="one" value ="1"></vime-menu-radio>
        <vime-menu-radio label="two" value ="2"></vime-menu-radio>
        <vime-menu-radio label="three" value ="3"></vime-menu-radio>
      </vime-menu-radio-group>
    `,
  });
});

it('should be structurally sound', () => {
  expect(page.root).toMatchSnapshot();
});

it('should turn off checked radios on change', async () => {
  const radioTwo = page.root!.querySelector('vime-menu-radio[value="2"] > vime-menu-item');
  (radioTwo as HTMLElement).click();
  await page.waitForChanges();
  expect(page.root).toMatchSnapshot();
});
