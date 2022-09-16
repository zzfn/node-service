import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ILogger } from '@midwayjs/logger';
import { SnowflakeIdGenerate } from './Snowflake';
import { ShortUrl } from '../entity/ShortUrl';

@Provide()
export class ShortUrlService {
  @InjectEntityModel(ShortUrl)
  model;
  @Logger()
  logger: ILogger;
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  async list() {
    return this.model.find({});
  }
}
