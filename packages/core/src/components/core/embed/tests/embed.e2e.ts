import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { EmbedEvent } from '../EmbedEvent';

let page: E2EPage;

beforeEach(async () => {
  page = await newE2EPage({
    url: '/src/components/core/embed/tests',
  });
});

test('embed', async () => {
  const embed = await page.find('vime-embed');
  const embedSrc = embed.getAttribute('embed-src');
  const embedRequestURL = `${embedSrc}?controls=0`;

  // Check src changes.
  const srcChangeEventSpy = await embed.spyOnEvent(EmbedEvent.SrcChange);
  embed.setProperty('params', { controls: 0 });
  await page.waitForChanges();
  expect(srcChangeEventSpy).toHaveReceivedEventDetail(embedRequestURL);

  // We are lazy-loading so src should not be set on iframe.
  const iframe = await page.find('iframe');
  expect(iframe.getAttribute('src')).toEqual('');

  // Check preconnections are made.
  const links = await page.findAll('link');
  expect(links.some((l) => l?.getAttribute('href') === embedSrc)).toBeTruthy();

  // Scroll to bottom of the page to load embed.
  await page.evaluate(() => { window.scrollBy(0, window.innerHeight); });
  await page.waitForChanges();

  expect(iframe.getAttribute('src')).toEqual(embedRequestURL);
  await embed.waitForEvent(EmbedEvent.Loaded);

  // Screenshots
  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
