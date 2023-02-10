import { z } from 'zod'

import { messages } from '@/shared/constants'
import { isValidPassword } from '@/shared/utils/helpers'

// ユーザー登録
export const register = z.object({
  body: z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z
        .string()
        .refine(isValidPassword, { message: messages.ERR_INVALID_PASSWORD }),
      passwordConfirm: z.string(),
    })
    .strict()
    .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
      path: ['passwordConfirm'],
      message: messages.ERR_PASSWORD_UNMATCHED,
    }),
})

export type RegisterInput = z.infer<typeof register>['body']

// ログイン
export const login = z.object({
  body: z
    .object({
      email: z.string().email(),
      password: z.string(),
    })
    .strict(),
})

export type LoginInput = z.infer<typeof login>['body']
