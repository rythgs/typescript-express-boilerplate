import bcrypt from 'bcrypt'
import { Column, Entity, Index, OneToMany } from 'typeorm'

import { Token } from '@/api/token'
import { BaseEntity } from '@/shared/database'

export enum RoleType {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string

  @Index('email_index')
  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[]

  async isPasswordMatch(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }
}
