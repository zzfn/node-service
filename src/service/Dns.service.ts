import { ServiceFactory } from '@midwayjs/core';
import { Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as Core from '@alicloud/pop-core';

@Provide()
@Scope(ScopeEnum.Singleton)
export class DnsServiceFactory extends ServiceFactory<Core> {
  @Config('dns')
  dnsConfig;

  @Init()
  async init() {
    await this.initClients(this.dnsConfig);
  }

  protected createClient(config: any): any {
    return new Core({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      endpoint: config.endpoint,
      apiVersion: '2015-01-09',
    });
  }

  getName() {
    return 'dnsClient';
  }
}
