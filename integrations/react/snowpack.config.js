/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  plugins: [
    '@snowpack/plugin-react-refresh',
    [
      '@snowpack/plugin-typescript',
      {
        args: '--project tsconfig.snowpack.json',
      },
    ],
  ],
};
