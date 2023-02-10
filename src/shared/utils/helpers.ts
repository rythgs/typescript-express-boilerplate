/**
 * パスワードチェック
 * 半角英小文字,大文字,数字,記号をそれぞれ1つ含み8文字以上
 */
export const isValidPassword = (password: string): boolean =>
  /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*[.?/-=])[a-zA-Z\d.?/-=]{8,}$/.test(
    password,
  )
