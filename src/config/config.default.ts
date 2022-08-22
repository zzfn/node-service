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
        host: 'rm-uf6b5g31sq0001m6aro.mysql.rds.aliyuncs.com',
        port: 3306,
        username: 'node',
        password: 'node123!',
        database: 'node',
        synchronize: true,
        logging: true,
        cache: true,
        dateStrings: true,
        entities: ['/entity'],
      },
    },
  },
  jwt: {
    secret: 'zzfzzf', // fs.readFileSync('xxxxx.key')
    expiresIn: '2d', // https://github.com/vercel/ms
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
        url: new URL('http://212.129.237.18:9200'),
      },
      auth: {
        username: 'elastic',
        password: 'paAd5vXJaZlhYGpmDMcm',
      }
    }
  }
} as MidwayConfig;
