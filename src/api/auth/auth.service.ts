import { Token, tokenService, TokenType } from '@/api/token'
import { userService } from '@/api/users'
import { dataSource } from '@/shared/database/data-source'
import { ApiError, ApiErrorNotFound } from '@/shared/utils'

const tokenRepository = dataSource.getRepository(Token)

/**
 * ログアウト処理
 * 該当トークンは破棄する
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const token = await tokenService.getActiveRefreshToken(refreshToken)
  if (token == null) {
    throw new ApiErrorNotFound()
  }

  await tokenRepository.remove([token])
}

/**
 * アクセストークンを更新する
 */
export const refreshAuth = async (
  refreshToken: string,
): Promise<tokenService.AuthTokens> => {
  const tokenModel = await tokenService.verifyToken(
    refreshToken,
    'refreshTokenPublicKey',
    TokenType.Refresh,
  )
  const user = await userService.getUserById(tokenModel.userId)
  if (user == null) {
    throw new ApiError()
  }
  await tokenService.destroyRefreshToken(tokenModel.id)

  return await tokenService.generateAuthTokens(user)
}
