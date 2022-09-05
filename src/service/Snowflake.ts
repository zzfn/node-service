import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';

@Provide('idGenerate')
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class SnowflakeIdGenerate {
  private START_STMP = 0;
  private SEQUENCE_BIT = 12;
  private MACHINE_BIT = 5;
  private DATACENTER_BIT = 5;
  private MAX_DATACENTER_NUM = -1 ^ (-1 << this.DATACENTER_BIT);
  private MAX_MACHINE_NUM = -1 ^ (-1 << this.MACHINE_BIT);
  private MAX_SEQUENCE = -1 ^ (-1 << this.SEQUENCE_BIT);

  private MACHINE_LEFT = this.SEQUENCE_BIT;
  private DATACENTER_LEFT = this.SEQUENCE_BIT + this.MACHINE_BIT;
  private TIMESTMP_LEFT = this.DATACENTER_LEFT + this.DATACENTER_BIT;

  private datacenterId; //数据中心
  private machineId; //机器标识
  private sequence = 0; //序列号
  private lastStmp = -1; //上一次时间戳

  constructor(machineId = 1, datacenterId = 1) {
    if (this.machineId > this.MAX_MACHINE_NUM || this.machineId < 0) {
      throw new Error(
        'config.worker_id must max than 0 and small than maxWrokerId-[' +
          this.MAX_MACHINE_NUM +
          ']'
      );
    }
    if (this.datacenterId > this.MAX_DATACENTER_NUM || this.datacenterId < 0) {
      throw new Error(
        'config.data_center_id must max than 0 and small than maxDataCenterId-[' +
          this.MAX_DATACENTER_NUM +
          ']'
      );
    }
    this.machineId = machineId;
    this.datacenterId = datacenterId;
  }

  private getNewstmp = (): number => {
    return Date.now();
  };

  private getNextMill = (): number => {
    let timestamp = this.getNewstmp();
    while (timestamp <= this.lastStmp) {
      timestamp = this.getNewstmp();
    }
    return timestamp;
  };

  nextId = (): string => {
    let timestamp: number = this.getNewstmp();
    if (timestamp < this.lastStmp) {
      throw new Error(
        'Clock moved backwards. Refusing to generate id for ' +
          (this.lastStmp - timestamp)
      );
    }
    if (this.lastStmp === timestamp) {
      this.sequence = (this.sequence + 1) & this.MAX_SEQUENCE;
      if (this.sequence === 0) {
        timestamp = this.getNextMill();
      }
    } else {
      this.sequence = 0;
    }
    this.lastStmp = timestamp;
    const timestampPos =
      BigInt(timestamp - this.START_STMP) *
      BigInt(2) ** BigInt(this.TIMESTMP_LEFT);
    const dataCenterPos = BigInt(this.datacenterId << this.DATACENTER_LEFT);
    const workerPos = BigInt(this.machineId << this.MACHINE_LEFT);
    return (
      timestampPos |
      dataCenterPos |
      workerPos |
      BigInt(this.sequence)
    ).toString();
  };
}
