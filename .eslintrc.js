module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['import', 'unused-imports'],
  settings: {
    'import/resolver': {
      typescript: [],
    },
  },
  rules: {
    // 未使用のインポートを削除する
    'unused-imports/no-unused-imports': 'error',
    // インポート順の指定
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        'newlines-between': 'always',
      },
    ],
    // 空行を 1 行までとする
    'no-multiple-empty-lines': ['error', { max: 1 }],

    // default exportは強制しない
    'import/prefer-default-export': 'off',

    // void ステートメント許可
    'no-void': ['error', { allowAsStatement: true }],
  },
}
