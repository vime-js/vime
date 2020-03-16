import { text, boolean, object } from '@storybook/addon-knobs';

export default function (src, poster, tracks) {
  return {
    src: object('src', src),
    poster: text('poster', poster),
    tracks: object('tracks', tracks)
  };
}