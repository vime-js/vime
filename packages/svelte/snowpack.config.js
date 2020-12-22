/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  plugins: [
    '@snowpack/plugin-svelte',
    ['@snowpack/plugin-typescript', {
      args: '--project tsconfig.snowpack.json',
    }],
  ],
};
