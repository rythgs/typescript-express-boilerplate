import { tokenService } from '@/api/token'
import { userService } from '@/api/users'
import { ApiErrorForbidden } from '@/shared/utils'

/**
 * ログアウト処理
 * 該当トークンは破棄する
 */
export const logout = async (refreshToken: string): Promise<void> => {
  await tokenService.revokeRefreshToken(refreshToken)
}

/**
 * アクセストークンを更新する
 */
export const refreshAuth = async (
  refreshToken: string,
): Promise<tokenService.AuthTokens> => {
  const tokenModel = await tokenService.verifyRefreshToken(refreshToken)
  const user = await userService.getUserById(tokenModel.userId)
  if (user == null) {
    throw new ApiErrorForbidden()
  }
  await tokenService.revokeRefreshToken(tokenModel.token)
  return await tokenService.generateTokens(user)
}
