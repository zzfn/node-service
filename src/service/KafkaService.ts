import {
  Provide,
  Scope,
  ScopeEnum,
  Init,
  Autoload,
  Destroy,
  Config,
} from '@midwayjs/core';
import {Partitioners, ProducerRecord} from 'kafkajs';

const { Kafka } = require('kafkajs');

@Autoload()
@Provide()
@Scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
export class KafkaService {
  @Config('kafka')
  kafkaConfig: any;

  private connection;
  private producer;

  @Init()
  async connect() {
    // 创建连接，你可以把配置放在 Config 中，然后注入进来
    const {
      brokers,
      clientId,
      producerConfig = {
        // KAFKAJS_NO_PARTITIONER_WARNING: 1,
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    } = this.kafkaConfig.kafkaConfig;
    const client = new Kafka({
      clientId: clientId,
      brokers: brokers,
    });
    this.producer = client.producer(producerConfig);
    this.connection = await this.producer.connect();
  }

  // 发送消息
  public async send(producerRecord: ProducerRecord) {
    return this.producer.send(producerRecord);
  }

  @Destroy()
  async close() {
    await this.connection.close();
  }
}
