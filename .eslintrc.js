module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['unused-imports'],
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
  },
}
