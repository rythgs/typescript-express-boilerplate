import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { User } from '@/api/users'
import { BaseEntity } from '@/shared/database/base-entity'

export enum TokenType {
  Access = 'access',
  Refresh = 'refresh',
}

@Entity('tokens')
export class Token extends BaseEntity {
  @Column({ type: 'longtext' })
  token: string

  @Column({ type: 'enum', enum: TokenType })
  type: string

  @Column()
  expires: Date

  @Column()
  blacklisted: boolean

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: 'user_id' })
  user: User

  // varchar(36) にするために length を指定
  @Column({ length: 36 })
  userId: string
}
