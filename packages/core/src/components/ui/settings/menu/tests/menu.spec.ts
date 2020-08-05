import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { Menu } from '../menu';

let page: SpecPage;

beforeEach(async () => {
  page = await newSpecPage({
    components: [Menu],
    html: '<vime-menu />',
  });
});

it('should be structurally sound', () => {
  expect(page.root).toMatchSnapshot();
});

// More advanced menu tests are performed as E2E tests.
