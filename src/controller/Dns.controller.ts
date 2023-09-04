import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Queries,
  Query,
} from '@midwayjs/decorator';
import { DnsServiceFactory } from '../service/Dns.service';
import { PageVo } from '../vo/PageVo';
import { Dns } from '../entity/Dns';

@Controller('/dns')
export class APIController {
  @Inject()
  dnsService: DnsServiceFactory;

  @Get('/domains')
  async domains() {
    const dnsClient = this.dnsService.get();
    const params = {};
    const requestOption = { method: 'POST' };
    const clientResponse: any = await dnsClient.request(
      'DescribeDomains',
      params,
      requestOption
    );
    return {
      records: clientResponse.Domains.Domain,
      total: clientResponse.TotalCount,
    };
  }

  @Get('/list')
  async get(
    @Query('DomainName') DomainName: string,
    @Queries() pageVo: PageVo
  ) {
    const dnsClient = this.dnsService.get();
    const params = {
      DomainName: DomainName,
      PageNumber: pageVo.current,
      PageSize: pageVo.pageSize,
    };
    const requestOption = {
      method: 'POST',
    };
    const r: any = await dnsClient.request(
      'DescribeDomainRecords',
      params,
      requestOption
    );
    return {
      records: r.DomainRecords.Record,
      total: r.TotalCount,
    };
  }

  @Post('/add')
  async addDomain(@Body() dns: Dns) {
    const dnsClient = this.dnsService.get();
    const params = {
      DomainName: dns.DomainName,
      RR: dns.RR,
      Type: dns.Type,
      Value: dns.Value,
    };
    const requestOption = {
      method: 'POST',
    };
    return dnsClient.request('AddDomainRecord', params, requestOption);
  }

  @Post('/update')
  async updateDomain(@Body() dns: Dns) {
    const dnsClient = this.dnsService.get();
    const params = {
      RecordId: dns.RecordId,
      RR: dns.RR,
      Type: dns.Type,
      Value: dns.Value,
    };
    const requestOption = {
      method: 'POST',
    };
    return dnsClient.request('UpdateDomainRecord', params, requestOption);
  }

  @Post('/del')
  async dnsDelete(@Body() { RecordId }: { RecordId: string }) {
    const dnsClient = this.dnsService.get();
    const params = {
      RecordId: RecordId,
    };
    const requestOption = {
      method: 'POST',
    };
    const result = await dnsClient.request(
      'DeleteDomainRecord',
      params,
      requestOption
    );
    console.log(result);
  }
}
