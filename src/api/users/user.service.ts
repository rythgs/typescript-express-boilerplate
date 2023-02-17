import { Not, type DeepPartial } from 'typeorm'

import { User } from './user.entity'
import * as userSchema from './user.schema'

import { messages } from '@/shared/constants'
import { dataSource } from '@/shared/database/data-source'
import { ApiErrorBadRequest, ApiErrorNotFound } from '@/shared/utils/ApiError'

const userRepository = dataSource.getRepository(User)

/**
 * IDでユーザーを1件取得
 */
export const getUserById = async (id: string): Promise<User | null> =>
  userRepository.findOneBy({ id })

/**
 * メールアドレスでユーザーを1件取得
 */
export const getUserByEmail = async (email: string): Promise<User | null> =>
  userRepository.findOneBy({ email })

/**
 * メールアドレスが登録済みか確認する
 */
export const isEmailTaken = async (
  email: string,
  excludeUserId?: string,
): Promise<boolean> => {
  const user = await userRepository.findOne({
    select: { id: true },
    where: {
      email,
      ...(excludeUserId != null && { id: Not(excludeUserId) }),
    },
  })
  return Boolean(user)
}

/**
 * ユーザー作成
 * メールアドレスでユニークになるよう事前にチェックする
 */
export const createUser = async (
  payload: userSchema.CreateInput,
): Promise<User> => {
  if (await isEmailTaken(payload.email)) {
    throw new ApiErrorBadRequest('メールアドレスはすでに登録されています。')
  }
  return userRepository.save(userRepository.create(payload))
}

/**
 * ユーザー更新
 * メールアドレスでユニークになるよう事前にチェックする
 */
export const updateUserById = async (
  userId: string,
  payload: DeepPartial<User>,
): Promise<User> => {
  if ((await getUserById(userId)) == null) {
    throw new ApiErrorNotFound()
  }
  if (payload.email != null && (await isEmailTaken(payload.email, userId))) {
    throw new ApiErrorBadRequest(messages.ERR_EMAIL_IS_TAKEN)
  }

  await userRepository.update(userId, payload)

  return (await getUserById(userId)) as User
}

/**
 * ユーザー削除
 */
export const deleteUserById = async (userId: string): Promise<void> => {
  const user = await getUserById(userId)
  if (user == null) {
    throw new ApiErrorNotFound()
  }
  await userRepository.delete({ id: userId })
}

export const getUsers = async (): Promise<User[]> => userRepository.find()
