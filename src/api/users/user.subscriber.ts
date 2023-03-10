import bcrypt from 'bcrypt'
import {
  EventSubscriber,
  type EntitySubscriberInterface,
  type InsertEvent,
  type UpdateEvent,
} from 'typeorm'

import { User } from './user.entity'

import { config } from '@/shared/config/config'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, class-methods-use-this
  listenTo() {
    return User
  }

  // eslint-disable-next-line class-methods-use-this
  async hashPassword(entity: User): Promise<void> {
    const rounds = config.env === 'development' ? 1 : 12
    // eslint-disable-next-line no-param-reassign
    entity.password = await bcrypt.hash(entity.password, rounds)
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    await this.hashPassword(event.entity)
  }

  async beforeUpdate({
    entity,
    databaseEntity,
  }: UpdateEvent<User>): Promise<void> {
    if (entity != null && entity.password !== databaseEntity.password) {
      await this.hashPassword(entity as User)
    }
  }
}
