import {Controller, Get, Inject, Post, Queries, Query} from '@midwayjs/decorator';
import { DnsServiceFactory } from '../service/Dns.service';
import {PageVo} from "../vo/PageVo";

@Controller('/dns')
export class APIController {
  @Inject()
  dnsService: DnsServiceFactory;

  @Get('/list')
  async get(@Query("url") url:string,@Queries() pageVo:PageVo) {
    const dnsClient = this.dnsService.get();
    const params = {
      DomainName: url,
      PageNumber: pageVo.current,
      PageSize: pageVo.pageSize,
    };
    const requestOption = {
      method: 'POST',
    };
    const r:any = await dnsClient.request(
      'DescribeDomainRecords',
      params,
      requestOption
    );
    const response={
      records: r.DomainRecords.Record,
      total: r.TotalCount
    }
    return response;
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