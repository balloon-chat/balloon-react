module.exports = {
  presets: [
    'next/babel'
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
      },
    ],
    [
      "babel-plugin-styled-components",
      {
        "ssr": true,
        "displayName": false,
      }
    ],
    'inline-react-svg'
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
      ],
    }
  }
};
