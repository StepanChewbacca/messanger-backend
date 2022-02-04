module.exports = {
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'node', 'jest'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'airbnb-base',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/type-annotation-spacing': [2, {}],
    '@typescript-eslint/semi': ['error', 'always'],
    'no-unused-vars': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'import/no-unresolved': 0,
    'no-restricted-syntax': 0,
    'import/extensions': 0,
    'no-use-before-define': 0,
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    'no-case-declarations': 0,
    'no-useless-constructor': 0,
    'no-empty-function': 0,
    'lines-between-class-members': 0,
    'guard-for-in': 0,
    'import/no-extraneous-dependencies': 0,
    'one-var-declaration-per-line': 0,
    'one-var': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'consistent-return': 0,
    'no-negated-in-lhs': 2,
    'no-continue': 0,
    'no-await-in-loop': 0,
    'block-scoped-var': 2,
    'no-plusplus': 0,
    'max-len': ['error', { code: 110 }],
    'no-param-reassign': 0,
    'no-warning-comments': 1,
    'vars-on-top': 2,
    'no-catch-shadow': 2,
    'handle-callback-err': 1,
    'consistent-this': [2, 'self'],
    'no-bitwise': 2,
    camelcase: 0,
    'no-mixed-spaces-and-tabs': 2,
    'generator-star-spacing': [2, { before: true, after: false }],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'no-console': 0,
    'operator-linebreak': ['error', 'before'],
    'brace-style': [2, '1tbs'],
    'padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
    ],
  },
};
