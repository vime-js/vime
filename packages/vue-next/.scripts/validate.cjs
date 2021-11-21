try {
  require('@vime/core');
} catch (e) {
  console.log(
    '\n\n',
    '\x1b[31m****************************************************************************',
    '\033[1m\x1b[31m\n 🚨 `@vime/core` was moved to peer dependencies, run `npm install @vime/core`',
    '\x1b[0m\x1b[31m\n ****************************************************************************',
    '\x1b[0m\n\n',
  );
}
