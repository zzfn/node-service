import { MidwayConfig } from '@midwayjs/core';
import * as redisStore from 'cache-manager-ioredis';

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
        synchronize: false,
        logging: true,
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
      },
    },
  },
  upload: {
    mode: 'stream',
    fileSize: '10mb',
  },
  cache: {
    store: redisStore,
    options: {
      host: process.env.redis_host,
      port: process.env.redis_port,
      password: process.env.redis_password,
      db: 1,
      keyPrefix: 'midway:',
      ttl: 60 * 30,
    },
  },
  oss: {
    client: {
      cname: true,
      accessKeyId: process.env.oss_accessKeyId,
      accessKeySecret: process.env.oss_accessKeySecret,
      bucket: process.env.oss_bucket,
      endpoint: process.env.oss_endpoint,
      timeout: '60s',
    },
  },
  dns: {
    client: {
      accessKeyId: process.env.dns_accessKeyId,
      accessKeySecret: process.env.dns_accessKeySecret,
      endpoint: process.env.dns_endpoint,
    },
  },
  redis: {
    client: {
      port: process.env.redis_port,
      host: process.env.redis_host,
      password: process.env.redis_password,
      db: 0,
    },
  },
  rabbitmq: {
    url: process.env.mq_url,
  },
  // kafka: {
  //   kafkaConfig: {
  //     clientId: 'my-app',
  //     brokers: [process.env.KAFKA_URL || 'localhost:9092'],
  //   },
  //   consumerConfig: {
  //     groupId: 'groupId-test',
  //   },
  // },
  bull: {
    defaultQueueOptions: {
      redis: {
        port: Number.parseInt(process.env.redis_port),
        host: process.env.redis_host,
        password: process.env.redis_password,
      },
    },
  },
  socketIO: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  },
} as MidwayConfig;
