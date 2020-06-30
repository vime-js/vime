import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Embed } from '../embed';

let page: SpecPage;

beforeEach(async () => {
  page = await newSpecPage({
    components: [Embed],
    html: '<vime-embed></vime-embed>',
  });
});

it('should be structurally sound', () => {
  expect(page.root).toMatchInlineSnapshot(`
    <vime-embed>
      <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="1" id="vime-embed-1" src=""></iframe>
    </vime-embed>
  `);
});

it('should set the iframe title', async () => {
  const iframe = page.root!.querySelector('iframe');
  expect(iframe?.title).toEqual('');
  page.root!.mediaTitle = 'Apples!';
  await page.waitForChanges();
  expect(iframe?.title).toEqual('Apples!');
});

it('should preconnect', async () => {
  page.rootInstance!.preconnections = [
    'https://apples.com',
    'https://bees.com',
  ];
  await page.waitForChanges();
  const links = page!.doc.head.querySelectorAll('link');
  expect(links[0]?.href).toEqual('https://apples.com/');
  expect(links[1]?.href).toEqual('https://bees.com/');
});
