import { newSpecPage } from '@stencil/core/testing';
import { Icon } from '../icon';

it('should be structurally sound', async () => {
  const page = await newSpecPage({
    components: [Icon],
    html: '<vime-icon href="#my-icon"></vime-icon>',
  });

  expect(page.root).toMatchSnapshot();
});

it('should accept svg markup', async () => {
  const page = await newSpecPage({
    components: [Icon],
    html: `
      <vime-icon>
        <rect width="300" height="100" />
      </vime-icon>
    `,
  });

  expect(page.root).toMatchSnapshot();
});
