// eslint-disable-next-line import/no-commonjs
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 11,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  extends: ['prettier', 'plugin:prettier/recommended'],
  plugins: ['import', 'prettier'],
  rules: {
    'import/no-unresolved': [2, { commonjs: true, amd: true }],
    'import/no-commonjs': ['error'],
  },
  globals: {
    expect: true,
    process: true,
    describe: true,
    before: true,
    after: true,
    beforeEach: true,
    suite: true,
    test: true,
    it: true,
  },
}
