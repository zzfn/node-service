import { Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { DnsServiceFactory } from '../service/Dns.service';

@Controller('/dns')
export class APIController {
  @Inject()
  dnsService: DnsServiceFactory;

  @Get('/get')
  async get() {
    const dnsClient = this.dnsService.get();
    const params = {
      DomainName: 'DomainName',
      PageNumber: 1,
      PageSize: 10,
    };
    const requestOption = {
      method: 'POST',
    };
    const r = await dnsClient.request(
      'DescribeDomainRecords',
      params,
      requestOption
    );
    console.log(r);
    return r;
  }

  @Post('/add')
  async saveUser() {
    const dnsClient = this.dnsService.get();
    const params = {
      DomainName: 'DomainName',
      RR: 'testsssss',
      Type: 'A',
      Value: 'ip',
    };
    const requestOption = {
      method: 'POST',
    };
    dnsClient.request('AddDomainRecord', params, requestOption).then(
      result => {
        console.log(JSON.stringify(result));
      },
      ex => {
        console.log(ex);
      }
    );
  }
}
