import bcrypt from 'bcrypt'
import { Column, Entity, Index, OneToMany } from 'typeorm'

import { Token } from '@/api/token'
import { roles, Roles } from '@/shared/config'
import { BaseEntity } from '@/shared/database'

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string

  @Index('email_index')
  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string

  @Column({ type: 'enum', enum: Object.values(roles), default: roles.user })
  role: Roles

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[]

  async isPasswordMatch(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }
}
