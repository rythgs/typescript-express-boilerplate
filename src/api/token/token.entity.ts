import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { User } from '@/api/users'

@Entity('tokens')
export class Token {
  @PrimaryColumn()
  token: string

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
