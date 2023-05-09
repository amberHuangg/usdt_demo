module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
    [
      'postcss-pxtorem',
      {
        rootValue: 100,
        propList: ['*', '!border'],
        minPixelValue: 4,
        selectorBlackList: [],
        mediaQuery: false,
      },
    ],
  ],
}
