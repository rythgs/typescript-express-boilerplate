import bcrypt from 'bcrypt'
import { Column, Entity, Index, OneToMany } from 'typeorm'

import { type Token } from '@/api/auth'
import { roles, Roles } from '@/shared/config/roles'
import { BaseEntity } from '@/shared/database/base-entity'

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

  @OneToMany('Token', 'user')
  tokens: Token[]

  async isPasswordMatch(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }
}
