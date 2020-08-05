import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { MenuRadio } from '../menu-radio';

let page: SpecPage;

beforeEach(async () => {
  page = await newSpecPage({
    components: [MenuRadio],
    html: '<vime-menu-radio />',
  });
});

it('should be structurally sound', () => {
  expect(page.root).toMatchSnapshot();
});
