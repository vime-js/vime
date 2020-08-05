import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Embed } from '../embed';
import { EmbedEvent } from '../EmbedEvent';

let page: SpecPage;

beforeEach(async () => {
  page = await newSpecPage({
    components: [Embed],
    html: '<vime-embed></vime-embed>',
  });
});

it('should be structurally sound', () => {
  expect(page.root).toMatchSnapshot();
});

it('should increment iframe id', async () => {
  page = await newSpecPage({
    components: [Embed],
    html: '<vime-embed></vime-embed><vime-embed></vime-embed>',
  });
  const frames = page.doc.querySelectorAll('iframe');
  expect(frames).toHaveLength(2);
  // Starts at 3 because of the 2 prior tests.
  expect(frames[0].id).toEqual('vime-iframe-3');
  expect(frames[1].id).toEqual('vime-iframe-4');
});

it('should fire event when src/params change', async () => {
  const cb = jest.fn();
  page.root!.addEventListener(EmbedEvent.SrcChange, cb);
  page.rootInstance!.embedSrc = 'http://apples.com';
  await page.waitForChanges();
  expect(cb).toHaveBeenCalled();
  page.rootInstance!.params = { controls: 0 };
  await page.waitForChanges();
  expect(cb).toHaveBeenCalledTimes(2);
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
