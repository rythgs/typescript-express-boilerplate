import 'reflect-metadata'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { config } from '@/shared/config'

interface DbConfigs {
  development: DataSourceOptions
  test: DataSourceOptions
  production: DataSourceOptions
}

const dbConfigs: DbConfigs = {
  development: {
    type: 'mysql',
    host: config.db.host,
    port: 3306,
    username: config.db.username,
    password: config.db.password,
    database: `${config.db.database}_development`,
    synchronize: true,
    logging: true,
    entities: ['src/api/**/*.entity.ts'],
    migrations: [],
    subscribers: ['src/api/**/*.subscriber.ts'],
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      // timezone: '+09:00',
      charset: 'utf8mb4',
    },
  },
  test: {
    type: 'mysql',
    host: config.db.host,
    port: 3306,
    username: config.db.username,
    password: config.db.password,
    database: `${config.db.database}_test`,
    synchronize: true,
    logging: true,
    entities: ['src/api/**/*.entity.ts'],
    migrations: [],
    subscribers: ['src/api/**/*.subscriber.ts'],
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      // timezone: '+09:00',
      charset: 'utf8mb4',
    },
  },
  production: {
    type: 'mysql',
    host: config.db.host,
    port: 3306,
    username: config.db.username,
    password: config.db.password,
    database: `${config.db.database}_production`,
    synchronize: false,
    logging: true,
    entities: ['src/api/**/*.entity.ts'],
    migrations: [],
    subscribers: ['src/api/**/*.subscriber.ts'],
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      // timezone: '+09:00',
      charset: 'utf8mb4',
    },
  },
}

const dbConfig: DataSourceOptions = dbConfigs[config.env]

export const dataSource = new DataSource(dbConfig)
