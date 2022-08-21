import { MidwayConfig } from '@midwayjs/core';
import {User} from '../entity/user'
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
        synchronize: false,
        logging: true,
        entities: [User],
      }
    }
  },
} as MidwayConfig;
