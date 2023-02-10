import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string

  @CreateDateColumn()
  readonly createdAt!: Date

  @UpdateDateColumn()
  readonly updatedAt!: Date

  // @DeleteDateColumn()
  // readonly deletedAt?: Date
}
