/** @type {import('prettier').Options} */
const prettierConfig = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  proseWrap: 'never',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/app.css',
  tailwindFunctions: ['classNames'],
};

export default prettierConfig
