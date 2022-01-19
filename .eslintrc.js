module.exports = {
    root: true,

    env: {
      node: true
    },

    'extends': [
      'eslint:recommended',
      'plugin:vue/vue3-essential',
      '@vue/typescript/recommended' // 貌似安装了@vue/eslint-config-typescript之后能正常extend
    ],

    parserOptions: {
      ecmaVersion: 2020
    },

    rules: {
      'semi': ['error', 'never'],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
  }
