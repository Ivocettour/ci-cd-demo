const globals = {
  console: 'readonly',
  describe: 'readonly',
  expect: 'readonly',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
  test: 'readonly'
};

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { args: 'after-used' }],
      'no-console': 'off'
    }
  },
  {
    ignores: ['coverage/**', 'node_modules/**']
  }
];
