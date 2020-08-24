import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

export default function swCustom() {
  registerRoute((context) => [
    /cdn.jsdelivr.net/,
    /github.com\/vime-js\/vime/,
  ].some((regex) => context.url.href.match(regex)), new StaleWhileRevalidate());
}
