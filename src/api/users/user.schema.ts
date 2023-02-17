import { z } from 'zod'

import { roles } from '@/shared/config/roles'
import { messages } from '@/shared/constants'
import { isValidPassword } from '@/shared/utils/helpers'

// ユーザー作成
export const create = z.object({
  body: z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z
        .string()
        .refine(isValidPassword, { message: messages.ERR_INVALID_PASSWORD }),
      // これは動かない
      // role: z.nativeEnum(roles).optional()
      role: z.nativeEnum(roles).or(z.literal(undefined)).optional(),
    })
    .strict(),
})

export type CreateSchema = z.infer<typeof create>
export type CreateInput = CreateSchema['body']

const params = {
  params: z
    .object({
      userId: z.string(),
    })
    .strict(),
}

// ユーザー更新
export const update = z.object({
  ...params,
  body: z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z
        .string()
        .refine(isValidPassword, { message: messages.ERR_INVALID_PASSWORD }),
      role: z.nativeEnum(roles),
    })
    .partial()
    .strict(),
})

export type UpdateSchama = z.infer<typeof update>
export type UpdateInput = UpdateSchama['body']

/**
 * ユーザー削除
 */
export const remove = z.object({
  ...params,
})

export type RemoveInput = z.infer<typeof remove>['params']

/**
 * ユーザー取得
 */
export const getOne = z.object({
  ...params,
})

export type GetOneInput = z.infer<typeof getOne>['params']
