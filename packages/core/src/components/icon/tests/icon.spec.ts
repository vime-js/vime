import { newSpecPage } from '@stencil/core/testing';
import { Icon } from '../icon';

it('should be structurally sound', async () => {
  const page = await newSpecPage({
    components: [Icon],
    html: '<vime-icon icon="#my-icon"></vime-icon>',
  });

  expect(page.root).toMatchInlineSnapshot(`
    <vime-icon icon="#my-icon">
      <!---->
      <svg focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" style="color: #fff; transform: scale(1); opacity: 1;">
        <use href="#my-icon"></use>
      </svg>
    </vime-icon>
  `);
});

it('should accept a slotted inline-svg', async () => {
  const page = await newSpecPage({
    components: [Icon],
    html: `
      <vime-icon>
        <rect width="300" height="100" />
      </vime-icon>
    `,
  });

  expect(page.root).toMatchInlineSnapshot(`
    <vime-icon>
      <!---->
      <svg focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" style="color: #fff; transform: scale(1); opacity: 1;">
        <rect height="100" width="300"></rect>
      </svg>
    </vime-icon>
  `);
});
