import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { Submenu } from '../submenu';

let page: SpecPage;

beforeEach(async () => {
  page = await newSpecPage({
    components: [Submenu],
    html: '<vime-submenu />',
  });
});

it('should be structurally sound', () => {
  expect(page.root).toMatchSnapshot();
});
