import {MidwayConfig} from '@midwayjs/core';

export default {
  keys: '1661057321114_1263',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.mysql_url,
        port: 3306,
        username: process.env.mysql_username,
        password: process.env.mysql_password,
        database: process.env.mysql_database,
        synchronize: true,
        logging: true,
        cache: true,
        dateStrings: true,
        entities: ['/entity'],
      },
    },
  },
  jwt: {
    secret: process.env.jwt_secret,
    expiresIn: '2d',
  },
  passport: {
    session: false,
  },
  swagger: {
    auth: {
      authType: 'bearer',
    },
  },
  cors: {
    credentials: false,
  },
  elasticsearch: {
    client: {
      node: {
        url: new URL(process.env.elasticsearch_url),
      },
      auth: {
        username: process.env.elasticsearch_username,
        password: process.env.elasticsearch_password,
      }
    }
  }
} as MidwayConfig;
