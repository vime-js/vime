import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import CleanCSS from 'clean-css';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const production = !process.env.ROLLUP_WATCH;

const OUTPUT_DIR = 'public/build';

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      // eslint-disable-next-line global-require
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        },
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/index.js',
  output: {
    format: 'iife',
    name: 'Vime',
    file: `${OUTPUT_DIR}/app.js`,
  },
  plugins: [
    resolve({ browser: true }),
    css({
      output(styles) {
        if (!existsSync(`${OUTPUT_DIR}`)) mkdirSync(`${OUTPUT_DIR}`);
        writeFileSync(
          `${OUTPUT_DIR}/app.css`,
          production ? new CleanCSS().minify(styles).styles : styles,
        );
      },
    }),
    !production && serve(),
    !production && livereload('public'),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
